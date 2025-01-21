package com.sns.ctr;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sns.dao.RefreshTokenMapper;
import com.sns.dao.UserBlockListMapper;
import com.sns.dao.UserMapper;
import com.sns.dto.RefreshTokenListDto;
import com.sns.dto.UserBlockListDto;
import com.sns.dto.UserDto;
import com.sns.jwt.CustomAuthenticationToken;
import com.sns.jwt.JwtProvider;
import com.sns.jwt.PrincipalDetails;

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
	private final UserMapper userMapper;
	private final RefreshTokenMapper refreshTokenMapper;
	private final UserBlockListMapper userBlockListMapper;
	
	@RequestMapping("/reason")
	public ResponseEntity<?> reason(@RequestBody HashMap<String, String> requestBody, HttpServletRequest request, HttpServletResponse response) {
		HashMap<String, Object> responseBody = new HashMap<>();
		String email = requestBody.get("email");
		String provider = requestBody.get("provider");
		UserDto user = userMapper.mtdFindByEmailAndProvider(email, provider);
		UserBlockListDto userBlock = userBlockListMapper.mtdSearchUser(user.getUuid());
		responseBody.put("reason", userBlock.getReason());
		responseBody.put("duration", userBlock.getDuration());
		responseBody.put("create_at", userBlock.getCreate_at());

		return ResponseEntity.ok(responseBody);
	}
	
	@PostMapping("/login")
	public ResponseEntity<HashMap<String, String>> login(@RequestBody HashMap<String, String> requestBody, HttpServletRequest request, HttpServletResponse response) {
		// requestBody에서 email, password, provider값 가져옴
		String email = requestBody.get("email");
		String provider = requestBody.get("provider");
		String key = provider.equals("local") ? requestBody.get("pwd") : requestBody.get("social_key");
		HashMap<String, String> responseBody = new HashMap<>();
		String falseType = "no_users";
		
		UserDto userDto = userMapper.mtdFindByEmailAndProvider(email, provider);
		if (userDto == null) {
			responseBody.put("message", "가입 정보가 없습니다.");
			responseBody.put("falseType", falseType);
			return new ResponseEntity<>(responseBody, HttpStatus.FORBIDDEN);	// 403			
		} else {
			if (userDto.getIs_using() == false) {
				falseType = (userDto.getIs_delete() == false) ? "block" : "resign";
				responseBody.put("message", "계정 정지/탈퇴한 회원입니다.");
				responseBody.put("falseType", falseType);
				return new ResponseEntity<>(responseBody, HttpStatus.FORBIDDEN);	// 403
			}			
		}
		
		// 인증 토큰 생성
		CustomAuthenticationToken authenticationToken =
				new CustomAuthenticationToken(email, key, provider, "login");
		try {
			// 인증 처리
			Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			
			PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
			
			// JWT 토큰 생성
			String accessToken = jwtProvider.generateAccessToken(authentication);
			String refreshToken = jwtProvider.generateRefreshToken(principalDetails.getUserId(), request);
			
			// accessToken을 HttpOnly 쿠키로 설정
			Cookie accessTokenCookie = createCookies("accessToken", accessToken, 60*10);
			addSameSiteCookieToResponse(response, accessTokenCookie, "None");
			response.addCookie(accessTokenCookie);	// 응답에 쿠키 추가
			
			// refreshToken을 HttpOnly 쿠키로 설정
			Cookie refreshTokenCookie = createCookies("refreshToken", refreshToken, 60*60*10);
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
		log.info("refreshToken: {}", inputRefreshToken);

		boolean isRefreshTokenValid = jwtProvider.validateRefreshToken(inputRefreshToken);
		log.info("isRefreshTokenValid: {}", isRefreshTokenValid);
		
		// RefreshToken이 유효하지 않은 경우
		if(!isRefreshTokenValid) {
			log.info("isRefreshTokenValid: {} 일 때 if문 들어옴", isRefreshTokenValid);
			
			// 기존 RefreshToken 비활성화
			jwtProvider.deleteRefreshToken(inputRefreshToken);
			
			// RefreshToken 유효하지 않으면 로그인 하도록 유도
			responseBody.put("message", "Refresh token is invalid or expired. Please log in again.");

			return new ResponseEntity<>(responseBody, HttpStatus.UNAUTHORIZED); 	// 401
		}
		
		RefreshTokenListDto refreshTokenListDto = refreshTokenMapper.findByRefreshToken(inputRefreshToken);
		UserDto userDto = userMapper.mtdFindByUuid(refreshTokenListDto.getUuid());
		
		String email = userDto.getEmail();
		String provider = userDto.getProvider();
		
		log.info("email: {}, provider: {}", email, provider);
		
		CustomAuthenticationToken authenticationToken = new CustomAuthenticationToken(email, null, provider, "refresh");
		Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		String newAccessToken = jwtProvider.generateAccessToken(authentication);
		log.info("newAccessToken: {}", newAccessToken);
		
		// accessToken을 HttpOnly 쿠키로 설정
		Cookie accessTokenCookie = createCookies("accessToken", newAccessToken, 60*10);
		addSameSiteCookieToResponse(response, accessTokenCookie, "None");
		response.addCookie(accessTokenCookie);	// 응답에 쿠키 추가
		
		responseBody.put("message", "Refresh Token has been successfully recreated.");
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
	    response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, setCookieHeader);
	}
	
	private ResponseEntity<HashMap<String, String>> createErrorResponse(String message, HttpStatus status) {
		HashMap<String, String> errorResponse = new HashMap<>();
		errorResponse.put("message", message);
		return new ResponseEntity<>(errorResponse, status);
	}
	
};
