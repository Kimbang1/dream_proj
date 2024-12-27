package com.sns.ctr;

import java.util.HashMap;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sns.jwt.JwtCode;
import com.sns.jwt.JwtProvider;
import com.sns.jwt.PrincipalDetails;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
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
	
	@PostMapping("/login")
	public ResponseEntity<HashMap<String, String>> login(@RequestBody HashMap<String, String> requestBody) {
		// requestBody에서 email, password, provider값 가져옴
		String email = requestBody.get("email");
		String password = requestBody.get("password");
		String provider = requestBody.get("provider");
		
		// 인증 토큰 생성
		UsernamePasswordAuthenticationToken authenticationToken =
				new UsernamePasswordAuthenticationToken(requestBody.get("email"), requestBody.get("password"));
		
		// 인증 처리
		Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
		
		String sAccessToken = jwtProvider.generateAccessToken(authentication);
		String sRefreshToken = jwtProvider.generateRefreshToken(principalDetails.getUserId());
		
		HashMap<String, String> responseBody = new HashMap<>();
		responseBody.put("userId", principalDetails.getUserId());
		requestBody.put("userName", principalDetails.getUsername());
		responseBody.put("refreshToken", sRefreshToken);
		
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.add(jwtProvider.getJwtHeader(), jwtProvider.addTokenType(sAccessToken));
		
		return new ResponseEntity<>(requestBody, httpHeaders, HttpStatus.OK);
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
				String sNewRefreshToken = jwtProvider.generateRefreshToken(userId);
				
				SecurityContextHolder.getContext().setAuthentication(authentication);
				
				httpHeaders.add(jwtProvider.getJwtHeader(), jwtProvider.addTokenType(sNewRefreshToken));
				
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
