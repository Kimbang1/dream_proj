package com.sns.ctr;

import java.util.HashMap;
import java.util.UUID;

import javax.security.sasl.AuthenticationException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sns.dao.UserDao;
import com.sns.dto.UserDto;
import com.sns.jwt.CustomAuthenticationToken;
import com.sns.jwt.JwtCode;
import com.sns.jwt.JwtProvider;
import com.sns.jwt.PrincipalDetails;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthController {
	private final AuthenticationManagerBuilder authenticationManagerBuilder;
	private final JwtProvider jwtProvider;
	private final PasswordEncoder passwordEncoder;
	private final UserDao userDao;
	
	@PostMapping("/join")
	public ResponseEntity<?> mtdJoinProc(@RequestBody UserDto  userDto) {
		
		// 가입되어있는지 체크
		if(userDao.mtdFindByEmailAndProvider(userDto.getEmail(), userDto.getProvider()) != null) {
			log.error("이미 존재하는 회원입니다.");
			
			return ResponseEntity
					.status(HttpStatus.CONFLICT)	// 409 상태코드
					.body("이미 존재하는 회원입니다.");
		}
		
		// uuid 생성
		String create_uuid = UUID.randomUUID().toString();
		userDto.setUuid(create_uuid);
		
		// 비밀번호 passwordEncoder로 해싱하기
		userDto.setPwd(passwordEncoder.encode(userDto.getPwd()));
		
		try {
			userDao.mtdInsert(userDto);
			return ResponseEntity
					.status(HttpStatus.CREATED)
					.body("회원가입 성공");
		} catch(Exception e) {
			// 오류 발생 시 error 페이지로 넘기기
			log.error("회원가입 처리 중 오류 : {}", e.getMessage());
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원가입 처리 중 오류 발생");
		}
	}
	
	@PostMapping("/login")
	public ResponseEntity<HashMap<String, String>> login(@RequestBody HashMap<String, String> requestBody, HttpServletRequest request, HttpServletResponse response) {
		// requestBody에서 email, password, provider값 가져옴
		String email = requestBody.get("email");
		String password = requestBody.get("pwd");
		String provider = requestBody.get("provider");
		
		// 인증 토큰 생성
		CustomAuthenticationToken authenticationToken =
				new CustomAuthenticationToken(email, password, provider);
		try {
			// 인증 처리
			Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			
			// JWT 토큰 생성
			String accessToken = jwtProvider.generateAccessToken(authentication);
			String refreshToken = jwtProvider.generateRefreshToken(principalDetails.getUserId(), request);
			
			// accessToken을 HttpOnly 쿠키로 설정
			Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
			accessTokenCookie.setHttpOnly(true);	// 클라이언트의 js코드에서 접근할 수 없도록 제한
			accessTokenCookie.setSecure(true);		// HTTPS 연결 시 사용
			accessTokenCookie.setPath("/");			// 쿠키가 유효한 경로 지정(특정 경로에서만 사용할 수 있게 제한 가능)
			accessTokenCookie.setMaxAge(60 * 30);	// 쿠키 만료 시간(30분)
			response.addCookie(accessTokenCookie);	// 응답에 쿠키 추가
			
			// refreshToken을 HttpOnly 쿠키로 설정
			Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
			refreshTokenCookie.setHttpOnly(true);	// 클라이언트의 js코드에서 접근할 수 없도록 제한
			refreshTokenCookie.setSecure(true);		// HTTPS 연결 시 사용
			refreshTokenCookie.setPath("/");		// 쿠키가 유효한 경로 지정(특정 경로에서만 사용할 수 있게 제한 가능)
			refreshTokenCookie.setMaxAge(60 * 60);	// 쿠키 만료 시간(1시간)
			response.addCookie(refreshTokenCookie);	// 응답에 쿠키 추가
			
			// 쿠키만 설정하여 응답 반환
		    return new ResponseEntity<>(HttpStatus.OK);
		} catch (BadCredentialsException e) {
			// 인증 실패 처리 - 잘못된 자격 증명(인증 정보가 잘못된 경우 - 잘못된 이메일, 비밀번호)
			HashMap<String, String> errorResponse = new HashMap<>();
			errorResponse.put("message", "Invalid credentials.");
			return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);	// 401번
		} catch (InternalAuthenticationServiceException e) {
			// 인증 서비스 오류 - 인증 서비스 자체가 내부적으로 문제를 일으킨 경우
			HashMap<String, String> errorResponse = new HashMap<>();
			errorResponse.put("message", "Authentication service is unavailable.");
			return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);	// 500번
		} catch (Exception e) {
			// 일반적인 예외 처리
			HashMap<String, String> errorResponse = new HashMap<>();
			errorResponse.put("message", "An unexpected error occurred.");
			return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);		// 400번
		}
	}
	
	@PostMapping("/refresh")
	public ResponseEntity<HashMap<String, String>> refresh(HttpServletRequest httpServletRequest, @RequestBody HashMap<String, String> requestBody) {
		HashMap<String, String> responseBody = new HashMap<>();
		HttpHeaders httpHeaders = new HttpHeaders();
		
		String inputRefreshToken = requestBody.get("refreshToken");
		String sAccessToken = jwtProvider.resolveToken(httpServletRequest);
		JwtCode jwtCode = jwtProvider.validateToken(sAccessToken);
		
		switch(jwtCode) {
		case ACCESS:
			log.info("JWT Token Not Expired");
			break;
		case EXPIRED:
			Claims claims = jwtProvider.parseClaims(sAccessToken);
			if(claims.get("userId") == null) {
				log.info("Invalid JWT Token");
				return null;
			}
			String userId = claims.get("userId").toString();
			boolean bRefreshTokenValid = jwtProvider.validateRefreshToken(userId, inputRefreshToken);
			if(bRefreshTokenValid) {
				Authentication authentication = jwtProvider.getAuthentication(sAccessToken);
				String sNewAccessToken = jwtProvider.generateAccessToken(authentication);
				String sNewRefreshToken = jwtProvider.generateRefreshToken(userId, httpServletRequest);
				
				SecurityContextHolder.getContext().setAuthentication(authentication);
				
				httpHeaders.add(jwtProvider.getJwtHeader(), jwtProvider.addTokenType(sNewAccessToken));
				
				responseBody.put("msg", "Expired Token Re Create");
				responseBody.put("refreshToken", sNewRefreshToken);
			} else {
				log.info("Invalid JWT Token");
				responseBody.put("error", "Invalid JWT Token");
			}
			break;
		
		default:
			log.info("Invalid JWT Token");
			responseBody.put("error", "Invalid JWT Token");
			break;
		}
		
		return new ResponseEntity<>(responseBody, httpHeaders, HttpStatus.OK);
	}
	
	
}
