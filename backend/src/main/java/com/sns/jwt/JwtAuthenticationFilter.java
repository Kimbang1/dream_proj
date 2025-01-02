package com.sns.jwt;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.sns.dao.RefreshTokenMapper;
import com.sns.dto.RefreshTokenListDto;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	
	private final JwtProvider jwtProvider;
	private final String[] PERMIT_ALL_RESOURCES;
	private final CustomUserDetailsService customUserDetailsService;
	
	@Autowired
	private RefreshTokenMapper refreshTokenMapper;
	
	public JwtAuthenticationFilter (JwtProvider jwtProvider, CustomUserDetailsService customUserDetailsService, String ... permitAllResources) {
		this.jwtProvider = jwtProvider;
		this.PERMIT_ALL_RESOURCES = permitAllResources;
		this.customUserDetailsService = customUserDetailsService;
	}
	
	@Override
	protected void doFilterInternal(
			HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain
			) throws ServletException, IOException {
		
	    // 쿠키에서 Access Token 추출
	    String accessToken = null;
	    String refreshToken = null;
	    Cookie[] cookies = request.getCookies();
	    if (cookies != null) {
	        for (Cookie cookie : cookies) {
	            if ("accessToken".equals(cookie.getName())) {
	                accessToken = cookie.getValue();
	            }
	            if ("refreshToken".equals(cookie.getName())) {
	            	refreshToken = cookie.getValue();
	            }
	        }
	    }
	    
	    // Access Token이 없을 경우, RefreshToken 검사
	    if (!StringUtils.hasText(accessToken)) {
	    	if(StringUtils.hasText(refreshToken)) {
	    		log.info("Access Token is missing, checking Refresh Token...");
	            handleTokenReissue(refreshToken, response, request);  // refreshToken 검사 및 재발급 처리
	    	} else {
	    		log.info("Access Token and Refresh Token are both missing.");
	            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Access Token and Refresh Token are missing");
	            return;
	    	}
	    } else {
	    	// Access Token이 존재하는 경우, 검증
	    	JwtCode jwtCode = jwtProvider.validateToken(accessToken);
	    	
	    	switch(jwtCode) {
	    	case ACCESS:
	    		// Access Token에서 이메일과 provider 정보를 추출
	    		String email = jwtProvider.getEmailFromToken(accessToken);
	    		String provider = jwtProvider.getProviderFromToken(accessToken);
	    		
	    		try {
	    			// 사용자 정보 로드
	    			UserDetails userDetails = customUserDetailsService.loadUserByEmailAndProvider(email, provider);
	    			
	    			// Authentication 인증 객체 생성 -> SecurityContext에 인증 정보 설정
	    			Authentication authentication = new UsernamePasswordAuthenticationToken(
	    					userDetails, null, userDetails.getAuthorities());
	    			
	    			// security context에 인증 정보 저장
	    			SecurityContextHolder.getContext().setAuthentication(authentication);
	    			
	    		} catch (UsernameNotFoundException e) {
	    			log.info("User not found with email: {} , and provider: {}", email, provider);
	    			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
	    			return;
	    		}
	    		break;
	    	case EXPIRED:
	    		log.info("Access token expired");
	    		Claims claims = jwtProvider.parseClaims(accessToken);
	    		if(claims.get("userId") == null) {
	    			log.info("Invalid JWT Token: userId is missing.");
	    			response.sendError(HttpServletResponse.SC_UNAUTHORIZED); // 401
	    		}
	    		String userId = claims.get("userId").toString();
	    		
	    		// Refresh Token 검증
	    		handleTokenReissue(refreshToken, response, request);
	    		break;
	    	case DENIED:
	    		log.info("Invalid JWT Token");
	    		response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid Access Token");
	    		break;
	    	default:
	    		log.info("Invalid JWT Token");
	    		response.sendError(HttpServletResponse.SC_FORBIDDEN);
	    		break;
	    	}
	    }
		
		// 다음 필터로 요청 전달
		filterChain.doFilter(request, response);
	}
	
	// 필터링에서 제외시키고 싶은 request
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		return Arrays.stream(PERMIT_ALL_RESOURCES)
				.anyMatch(permit -> new AntPathMatcher().match(permit, request.getRequestURI()));
	}
	
	// RefreshToken을 검사하고 새로은 AccessToken을 재발급하는 메서드
	private void handleTokenReissue(String refreshToken, HttpServletResponse response, HttpServletRequest request) throws IOException {
		if (StringUtils.hasText(refreshToken)) {
			// RefreshToken 검증
			boolean isRefreshTokenValid = jwtProvider.validateRefreshToken(refreshToken);
			if(isRefreshTokenValid) {
				log.info("Refresh Token is valid, generating new Access Token...");
				
				// Refresh Token을 기반으로 새로운 Access Token 생성
				Authentication authentication = jwtProvider.getAuthenticationFromRefreshToken(refreshToken);
				String newAccessToken = jwtProvider.generateAccessToken(authentication);
				
				// 새로운 Access Token을 쿠키로 설정
				Cookie accessTokenCookie = new Cookie("accessToken", newAccessToken);
				accessTokenCookie.setHttpOnly(true);	// 클라이언트의 js코드에서 접근할 수 없도록 제한
				accessTokenCookie.setSecure(true);		// HTTPS 연결 시 사용
				accessTokenCookie.setPath("/");		// 쿠키가 유효한 경로 지정(특정 경로에서만 사용할 수 있게 제한 가능)
				accessTokenCookie.setMaxAge(60);	// 쿠키 만료 시간()
				response.addCookie(accessTokenCookie);
				
				log.info("New Access Token generated and sent to client.");
				
				// Authentication 정보를 security context에 설정
				SecurityContextHolder.getContext().setAuthentication(authentication);
			} else {
				log.error("Invalid or expired Refresh Token.");
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired Refresh Token");
			}
		} else {
			log.error("Refresh Token is missing.");
	        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Refresh Token is missing");
		}
	}

}
