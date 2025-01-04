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
		
		String requestURI = request.getRequestURI();
		String requestURL = request.getRequestURL().toString();
		log.info("requestURI: {}", requestURI);
		log.info("requestURL: {}", requestURL);
		
		// /refresh 엔드포인트는 인증을 건너뛰고 계속 진행
        if ("/auth/refresh".equals(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }
		
	    // 쿠키에서 Access Token 추출
	    String accessToken = null;
	    Cookie[] cookies = request.getCookies();
	    if (cookies != null) {
	        for (Cookie cookie : cookies) {
	            if ("accessToken".equals(cookie.getName())) {
	                accessToken = cookie.getValue();
	                break;
	            }
	        }
	    }
	    log.info("Access Token from cookie: {}", accessToken);
	    // Access Token이 없으면 요청 차단
	    if (!StringUtils.hasText(accessToken)) {
	        log.info("Access Token is missing");
	        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Access Token is missing");
	        return;
	    }
		
		// Access Token 검증
		JwtCode jwtCode = jwtProvider.validateToken(accessToken);
		log.info("JWT Token validation result: {}", jwtCode);
		
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
			response.sendRedirect("/auth/refresh");
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
		
		// 다음 필터로 요청 전달
		filterChain.doFilter(request, response);
	}
	
	// 필터링에서 제외시키고 싶은 request
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		return Arrays.stream(PERMIT_ALL_RESOURCES)
				.anyMatch(permit -> new AntPathMatcher().match(permit, request.getRequestURI()));
	}
	

}
