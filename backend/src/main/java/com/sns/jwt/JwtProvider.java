package com.sns.jwt;

import java.security.Key;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.sns.dao.RefreshTokenMapper;
import com.sns.dao.UserDao;
import com.sns.dto.RefreshTokenListDto;
import com.sns.dto.UserDto;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtProvider {
	private final static String AUTHORITIES_KEY = "auth";
	
	@Value("${jwt.secret}")
	private String secret;
	@Value("${jwt.access-expiration-time}")
	private long accessExpirationTime;
	@Value("${jwt.refresh-expiration-time}")
	private long refreshExpirationTime;
	@Value("${jwt.header}")
	private String jwtHeader;
	@Value("${jwt.type}")
	private String jwtType;
	
	private Key key;
	
	@Autowired
	private RefreshTokenMapper refreshTokenMapper;
	
	@Autowired
	private UserDao userDao;
	
	@PostConstruct
	public void init() {
		byte[] keyBytes = Decoders.BASE64.decode(secret);
	}
	
	// Access Token 생성
	public String generateAccessToken(Authentication authentication) {
		// 인증된 사용자의 권한 목록 조회
		PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
		String authority = principalDetails.getUserDto().getIs_admin() ? "ROLE_ADMIN" : "ROLE_USER";	// is_admin 값에 따라 권한 설정

		
		// 토큰의 expire 시간을 설정
		long now = (new Date()).getTime();
		Date expiration = new Date(now + accessExpirationTime);
				
		return Jwts.builder()
				.setSubject(authentication.getName())
				.claim("userId", principalDetails.getUserId())
				.claim(AUTHORITIES_KEY, authority)
				.setExpiration(expiration)
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();
	}
	
	// Refresh Token 생성
	@Transactional
	public String generateRefreshToken(String userId) {
		long create = (new Date()).getTime();
		long expired = (new Date(create + refreshExpirationTime)).getTime();
		String tokenUuid = UUID.randomUUID().toString();
		
		Timestamp createAt = new Timestamp(create);
		Timestamp expiresIn = new Timestamp(expired);
		
		refreshTokenMapper.saveRefreshToken(userId, tokenUuid, createAt, expiresIn);
		
		return tokenUuid;
	}
	
	// 토큰에서 인증 정보 조회 후 AUthentication 객체 리턴
	// 토큰 -> 클레임 추출 -> 유저 객체 제작 -> Authentication 객체 리턴
	public Authentication getAuthentication(String token) {
		Claims claims = this.parseClaims(token);
		
		if (claims.get(AUTHORITIES_KEY) == null) {
			throw new RuntimeException("권한 정보가 없는 토큰입니다.");
		}
		
		// JWT에서 권한 정보 가져오기(ROLE_ADMIN 또는 ROLE_USER)
		String authority = claims.get(AUTHORITIES_KEY).toString();
		List<? extends GrantedAuthority> authorities =
				Arrays.asList(new SimpleGrantedAuthority(authority));
		
		// JWT에서 userId 추출해 MyBatis로 회원 정보 조회
		String userId = claims.get("userId").toString();
		UserDto userDto = userDao.mtdFindByUuid(userId);
		
		if (userDto == null) {
			throw new RuntimeException("사용자 정보가 없습니다.");
		}
		
		// 사용자 정보를 PrincipalDetails에 설정
		PrincipalDetails principalDetails = new PrincipalDetails(userDto);
		
		return new UsernamePasswordAuthenticationToken(principalDetails, token, authorities);
	}
	
	// JWT Claims 복호화
	public Claims parseClaims(String token) {
		try {
			return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
		} catch (ExpiredJwtException e) {
			return e.getClaims();
		}
	}
	
	// 토큰 검증
	public JwtCode validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
			return JwtCode.ACCESS;
		} catch (ExpiredJwtException e) {
			log.info("Expired JWT Token");
			return JwtCode.EXPIRED;
		} catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("Invalid JWT Token");
            return JwtCode.DENIED;
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT Token");
            return JwtCode.DENIED;
        } catch (IllegalArgumentException e) {
            log.info("JWT claims string is empty");
            return JwtCode.DENIED;
        } catch (Exception e) {
            log.info("Exception");
            return JwtCode.DENIED;
        }
	}
	
	// Refresh Token 검증
	public boolean validateRefreshToken(String userId, String validRefreshToken) {
		// 유저의 모든 Refresh Token 조회
		List<RefreshTokenListDto> refreshTokens = refreshTokenMapper.findByUserId(userId);
		
		// 조회된 토큰 리스트에서 유효한 토큰인지 확인
		for (RefreshTokenListDto tokenDto : refreshTokens) {
			if (tokenDto.getReToken().equals(refreshTokens)) {
				// 만료 시간이 현재 시간보다 뒤에 있는지 확인
				if(tokenDto.getExpiresIn().after(new Timestamp(System.currentTimeMillis()))) {
					return true;
				}
			}
		}
		return false;
	}
	
	public String resolveToken(HttpServletRequest request) {
		String bearerToken = request.getHeader(jwtHeader);
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(jwtType)) {
			return bearerToken.substring(7);
		}
		return null;
	}
	
	// prefix Token Type Add
	public String addTokenType(String token) {
		return String.format("%s %s", jwtType, token);
	}
	
	public String getJwtHeader() {
		return jwtHeader;
	}
	
	public String getJwtType() {
		return jwtType;
	}
}
