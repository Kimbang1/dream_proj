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
@Slf4j
public class AuthController {
	private final AuthenticationManagerBuilder authenticationManagerBuilder;
	private final JwtProvider jwtProvider;
	private final PasswordEncoder passwordEncoder;
	private final UserDao userDao;
	
	@PostMapping("/join")
	@Transactional
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
			Cookie accessTokenCookie = createCookies("accessToken", accessToken, 60*60);
			addSameSiteCookieToResponse(response, accessTokenCookie, "None");
			response.addCookie(accessTokenCookie);	// 응답에 쿠키 추가
			
			// refreshToken을 HttpOnly 쿠키로 설정
			Cookie refreshTokenCookie = createCookies("refreshToken", refreshToken, 60*60);
			addSameSiteCookieToResponse(response, refreshTokenCookie, "None");
			response.addCookie(refreshTokenCookie);	// 응답에 쿠키 추가
			
			// 쿠키만 설정하여 응답 반환
		    return new ResponseEntity<>(HttpStatus.OK);
		} catch (BadCredentialsException e) {
			// 인증 실패 처리 - 잘못된 자격 증명(인증 정보가 잘못된 경우 - 잘못된 이메일, 비밀번호)
			return createErrorResponse("Invalid credentials.", HttpStatus.UNAUTHORIZED); 	// 401번
		} catch (InternalAuthenticationServiceException e) {
			// 인증 서비스 오류 - 인증 서비스 자체가 내부적으로 문제를 일으킨 경우
			return createErrorResponse("Authentication service is unavailable.", HttpStatus.INTERNAL_SERVER_ERROR); 	// 500번
		} catch (Exception e) {
			// 일반적인 예외 처리
			return createErrorResponse("An unexpected error occurred.", HttpStatus.BAD_REQUEST);		// 400번
			
		}
	}
	
	@PostMapping("/logout")
	public ResponseEntity<HashMap<String, String>> logout(HttpServletRequest httpServletRequest, @RequestBody HashMap<String, String> requestBody, HttpServletResponse response) {
		HashMap<String, String> responseBody = new HashMap<>();
		
		// 쿠키에서 refreshToken 값 가져오기
		String inputRefreshToken = null;
		Cookie[] cookies = httpServletRequest.getCookies();		// 요청에 포함된 모든 쿠키 가져오기
		if(cookies != null) {
			for (Cookie cookie : cookies) {
				if("refreshToken".equals(cookie.getName())) {
					inputRefreshToken = cookie.getValue();
					break;
				}
			}
		}
		
		// refreshToken이 없으면 에러 처리
		if(inputRefreshToken == null) {
			return createErrorResponse("Failed to log out: Refresh token not found.", HttpStatus.UNAUTHORIZED); 	// 401
		}
		
		// RefreshToken 삭제
		boolean isDeleted = jwtProvider.deleteRefreshToken(inputRefreshToken);
		if(!isDeleted) {
			return createErrorResponse("Failed to log out: Invalid or expired refresh token.", HttpStatus.UNAUTHORIZED); 	// 401
		}
		
		// Cookie 삭제
		Cookie accessTokenCookie = createCookies("accessToken", null, 0);
	    response.addCookie(accessTokenCookie);  // 응답에 쿠키 추가
	    
	    Cookie refreshTokenCookie = createCookies("refreshToken", null, 0);
	    response.addCookie(refreshTokenCookie); // 응답에 쿠키 추가
		
	    responseBody.put("message", "Successfully logged out.");
		return new ResponseEntity<>(responseBody, HttpStatus.OK);
	}
	
	@PostMapping("/refresh")
	public ResponseEntity<HashMap<String, String>> refresh(HttpServletRequest httpServletRequest, @RequestBody HashMap<String, String> requestBody, HttpServletResponse response) {
		HashMap<String, String> responseBody = new HashMap<>();
		log.info("여기까지는 왔어");
		// 쿠키에서 refreshToken 값 가져오기
		String inputRefreshToken = null;
		Cookie[] cookies = httpServletRequest.getCookies();		// 요청에 포함된 모든 쿠키 가져오기
		if(cookies != null) {
			for (Cookie cookie : cookies) {
				if("refreshToken".equals(cookie.getName())) {
					inputRefreshToken = cookie.getValue();
					break;
				}
			}
		} else {
			log.error("No cookies found in the request.");
		}
		
		// refreshToken이 없으면 에러 처리
		if(inputRefreshToken == null) {
			return createErrorResponse("Failed to log out: Refresh token not found.", HttpStatus.UNAUTHORIZED); 	// 401
		}
		
		String sAccessToken = jwtProvider.resolveToken(httpServletRequest);
		JwtCode jwtCode = jwtProvider.validateToken(sAccessToken);
		
		switch(jwtCode) {
		case ACCESS:	// AccessToken이 만료되지 않은 경우
			log.info("JWT Token Not Expired");
			responseBody.put("message", "Access token is still valid. No refresh needed.");
			return new ResponseEntity<>(responseBody, HttpStatus.OK);
		case EXPIRED:	// AccessToken이 만료된 경우
			Claims claims = jwtProvider.parseClaims(sAccessToken);
			if(claims.get("userId") == null) {	// userId가 없는 경우
				log.info("Invalid JWT Token: userId is missing.");
				return createErrorResponse("JWT Token is invalid: userId is missing.", HttpStatus.UNAUTHORIZED); 	// 401
			}
			String userId = claims.get("userId").toString();
			boolean isRefreshTokenValid = jwtProvider.validateRefreshToken(inputRefreshToken);
			Authentication authentication = jwtProvider.getAuthentication(sAccessToken);
			
			// RefreshToken이 유효하지 않은 경우
			if(!isRefreshTokenValid) {
				
				// 기존 RefreshToken 비활성화
				if (jwtProvider.deleteRefreshToken(inputRefreshToken)) {
					// 새로운 RefreshToken, AccessToken 발급
					String newAccessToken = jwtProvider.generateAccessToken(authentication);
					String newRefreshToken = jwtProvider.generateRefreshToken(userId, httpServletRequest);
					
					// accessToken을 HttpOnly 쿠키로 설정
					Cookie accessTokenCookie = createCookies("accessToken", newAccessToken, 60*60);
					addSameSiteCookieToResponse(response, accessTokenCookie, "None");
					response.addCookie(accessTokenCookie);	// 응답에 쿠키 추가
					
					// refreshToken을 HttpOnly 쿠키로 설정
					Cookie refreshTokenCookie = createCookies("refreshToken", newRefreshToken, 60*60);
					addSameSiteCookieToResponse(response, refreshTokenCookie, "None");
					response.addCookie(refreshTokenCookie);	// 응답에 쿠키 추가
					
					log.info("Expired Refresh Token Replaced with New Tokens");
					responseBody.put("message", "Expired Refresh Token Recreated");
					return new ResponseEntity<>(requestBody, HttpStatus.OK);
				} else {
					log.error("Failed to delete: RefreshToken '{}' doesn't exist.", inputRefreshToken);
					responseBody.put("message", "RefreshToken doesn't exist.");
					return new ResponseEntity<>(requestBody, HttpStatus.UNAUTHORIZED);
				}
			}
			
			// RefreshToken이 유효한 경우(AccessToken만 재발급)
			String newAccessToken = jwtProvider.generateAccessToken(authentication);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			
			// accessToken을 HttpOnly 쿠키로 설정
			Cookie accessTokenCookie = createCookies("accessToken", newAccessToken, 60*60);
			addSameSiteCookieToResponse(response, accessTokenCookie, "None");
			response.addCookie(accessTokenCookie);	// 응답에 쿠키 추가
			
			responseBody.put("message", "Refresh Token has been successfully recreated.");
			break;
		
		default:
			// 예상치 못한 상황
			log.error("Unexpected JWT Token status: {}", jwtCode);
			return createErrorResponse("Unexpected JWT Token status.", HttpStatus.UNAUTHORIZED); 	// 401
		}
		
		return new ResponseEntity<>(responseBody, HttpStatus.OK);
	}
	
	private Cookie createCookies(String name, String value, int maxAge) {
		Cookie cookie = new Cookie(name, value);
		cookie.setHttpOnly(true);	// 클라이언트의 js코드에서 접근할 수 없도록 제한
		cookie.setSecure(true);		// HTTPS 연결 시 사용
		cookie.setPath("/");		// 쿠키가 유효한 경로 지정(특정 경로에서만 사용할 수 있게 제한 가능)
		cookie.setMaxAge(maxAge);	// 쿠키 만료 시간()
		return cookie;
	}
	
	private void addSameSiteCookieToResponse(HttpServletResponse response, Cookie cookie, String sameSite) {
	    // 쿠키를 헤더에 직접 추가
	    String setCookieHeader = String.format(
	            "%s=%s; Max-Age=%d; Path=%s; HttpOnly; Secure; SameSite=%s",
	            cookie.getName(), cookie.getValue(), cookie.getMaxAge(), cookie.getPath(), sameSite
	    );
	    response.addHeader(HttpHeaders.SET_COOKIE, setCookieHeader);
	}
	
	private ResponseEntity<HashMap<String, String>> createErrorResponse(String message, HttpStatus status) {
		HashMap<String, String> errorResponse = new HashMap<>();
		errorResponse.put("message", message);
		return new ResponseEntity<>(errorResponse, status);
	}
	
}
