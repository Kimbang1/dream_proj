package com.sns.jwt;

import java.security.Key;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SigningKeyResolver;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {
	private final CustomUserDetailsService customUserDetailsService;
	private final PasswordEncoder passwordEncoder;
//	@Value("${jwt.secret}")
//	private String secret;
	@Autowired
	private JwtProvider jwtProvider;
//	
//	@Override
//	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
//		String email = authentication.getName();
//		String password = authentication.getCredentials().toString();
//		String provider = ((CustomAuthenticationToken) authentication).getProvider();
//		
//		try {
//			
//			String token = getTokenFromCookies(authentication);
//			
//			if(token != null) {
//				JwtParser parser = Jwts.parserBuilder()
//						.setSigningKeyResolver(getSigningKeyResolver())
//						.build();
//				parser.parseClaimsJws(token);
//			} else {
//				throw new BadCredentialsException("JWT token not found in cookies.");
//			}
//			
//			UserDetails userDetails =  customUserDetailsService.loadUserByEmailAndProvider(email, provider);
//			
//			// 비밀번호 검증(기본적으로 PasswordEncoder를 사용)
//			if (userDetails.getPassword() == null) {
//				throw new BadCredentialsException("password null");
//			}
//			if (!passwordEncoder.matches(password, userDetails.getPassword())) {
//				throw new BadCredentialsException("Invalid credentials CUstomAuthenticationProvider");
//			}
//			
//			// 인증이 완료된 후, 5개의 매개변수로 새로운 Authentication 객체 반환
//			HttpServletRequest request = ((CustomAuthenticationToken) authentication).getRequest();
//			return new CustomAuthenticationToken(userDetails, null, userDetails.getAuthorities(), provider, request);
//		} catch (ExpiredJwtException e) {
//			// ExpiredJwtException 발생 시 JwtAuthenticationException 던지기
//			throw new JwtAuthenticationException("Expired JWT token", e);
//		} catch (Exception e ) {
//			throw new BadCredentialsException("Invalid credentials CUstomAuthenticationProvider", e);
//		}
//	}
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String email = authentication.getName();
		String password = authentication.getCredentials().toString();
		String provider = ((CustomAuthenticationToken) authentication).getProvider();
		
		String token = getTokenFromCookies(authentication);
		
		if (token == null) {
			// 1. accessToken이 없을 때: 로그인 시도 / 토큰 만료 구분
			if (email != null && password != null) {
				// 로그인 시도로 간주
				return handleLogin(authentication);
			} else {
				// accessToken이 없고, 로그인 정보가 없는 경우: 토큰 만료로 간주
				throw new ExpiredJwtException(null, null, "Access token is missing or expired.");
			}
		} else {
			// 2. accessToken이 있는 경우: JWT 검증 로직 수행
			return verifyTokenAndAuthenticate(authentication, token, provider);
		}
	}
	
	// 로그인 처리
	private Authentication handleLogin(Authentication authentication) {
		String email = authentication.getName();
	    String password = authentication.getCredentials().toString();
	    String provider = ((CustomAuthenticationToken) authentication).getProvider();
	    
	    UserDetails userDetails = customUserDetailsService.loadUserByEmailAndProvider(email, provider);
	    
	    // 비밀번호 검증
	    if (!passwordEncoder.matches(password, userDetails.getPassword())) {
	    	throw new BadCredentialsException("Invalid credentials");
	    }
	    
	    // 인증 성공 시 Authentication 객체 반환
	    HttpServletRequest request = ((CustomAuthenticationToken) authentication).getRequest();
	    return new CustomAuthenticationToken(userDetails, null, userDetails.getAuthorities(), provider, request);
	}
	
	// JWT 검증 로직
	private Authentication verifyTokenAndAuthenticate(Authentication authentication, String token, String provider) {
		try {
			// JwtProvider를 사용해 이메일 추출
			String email = jwtProvider.getEmailFromToken(token);
			
			if (email == null || email.isEmpty()) {
				throw new BadCredentialsException("Email not found in JWT token");
			}
			
			// 사용자 인증 정보 생성
			UserDetails userDetails = customUserDetailsService.loadUserByEmailAndProvider(email, provider);
			
			// 인증 성공 시 Authentication 객체 반환
			HttpServletRequest request = ((CustomAuthenticationToken) authentication).getRequest();
			return new CustomAuthenticationToken(userDetails, null, userDetails.getAuthorities(), provider, request);
			
		} catch (ExpiredJwtException e) {
			// accessToken 만료 처리
	        throw new ExpiredJwtException(null, null, "Access token has expired.", e);
		} catch (Exception e) {
			// 기타 JWT 검증 오류 처리
	        throw new BadCredentialsException("Invalid JWT token", e);
		}
		
	}
	
	@Override
	public boolean supports(Class<?> authentication) {
		return CustomAuthenticationToken.class.isAssignableFrom(authentication);
	}
	
	// 쿠키에서 JWT  토큰을 추출하는 메서드
	private String getTokenFromCookies(Authentication authentication) {
		HttpServletRequest request = ((CustomAuthenticationToken) authentication).getRequest();
		Cookie[] cookies = request.getCookies();
		if(cookies != null) {
			for(Cookie cookie : cookies) {
				if("accessToken".equals(cookie.getName())) {
					return cookie.getValue();
				}
			}
		}
		return null;
	}
	
//	// 서명 검증을 위한 키를 얻는 메서드
//	private SigningKeyResolver getSigningKeyResolver() {
//		return new SigningKeyResolver() {
//			
//			@Override
//			public Key resolveSigningKey(JwsHeader header, String plaintext) {
//				return null;
//			}
//			
//			@Override
//			public Key resolveSigningKey(JwsHeader header, Claims claims) {
//				
//				return new SecretKeySpec(secret.getBytes(), SignatureAlgorithm.HS256.getJcaName());
//			}
//		};
//	}
}
