package com.sns.ctr;

import java.io.IOException;
import java.util.HashMap;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
	
	@RequestMapping("/join")
	public ResponseEntity<?> mtdJoinProc(@RequestBody UserDto  userDto, HttpServletResponse response) {
		String redirect_uri;
		
		// uuid 생성
		String create_uuid = UUID.randomUUID().toString();
		userDto.setUuid(create_uuid);
		
		// 비밀번호 passwordEncoder로 해싱하기
		userDto.setPwd(passwordEncoder.encode(userDto.getPwd()));
		
		try {
			userDao.mtdInsert(userDto);
			redirect_uri="http://localhost:8081/res";
			return ResponseEntity.status(HttpStatus.FOUND)
					.header("Location", redirect_uri)
					.build();
		} catch(Exception e) {
			// 오류 발생 시 error 페이지로 넘기기
			log.error("회원가입 처리 중 오류 : {}", e.getMessage());
			redirect_uri="http://localhost:8081/custom_error";
			return ResponseEntity.status(HttpStatus.FOUND)
					.header("Location", redirect_uri)
					.build();
		}
	}
	
	@PostMapping("/login")
	public ResponseEntity<HashMap<String, String>> login(@RequestBody HashMap<String, String> requestBody, HttpServletRequest request) {
		// requestBody에서 email, password, provider값 가져옴
		String email = requestBody.get("email");
		String password = requestBody.get("password");
		String provider = requestBody.get("provider");
		
		// 인증 토큰 생성
		CustomAuthenticationToken authenticationToken =
				new CustomAuthenticationToken(email, password, provider);
		
		// 인증 처리
		Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
		
		// JWT 토큰 생성
		String sAccessToken = jwtProvider.generateAccessToken(authentication);
		String sRefreshToken = jwtProvider.generateRefreshToken(principalDetails.getUserId(), request);
		
		// 응답 데이터 준비
		HashMap<String, String> responseBody = new HashMap<>();
		responseBody.put("userId", principalDetails.getUserId());
		responseBody.put("userName", principalDetails.getUsername());
		responseBody.put("refreshToken", sRefreshToken);
		
		// HTTP 헤더에 Access Token 추가
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.add(jwtProvider.getJwtHeader(), jwtProvider.addTokenType(sAccessToken));
		
		return new ResponseEntity<>(responseBody, httpHeaders, HttpStatus.OK);
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
