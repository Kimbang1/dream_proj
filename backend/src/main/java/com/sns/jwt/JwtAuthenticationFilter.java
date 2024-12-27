package com.sns.jwt;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	
	private final JwtProvider jwtProvider;
	private final String[] PERMIT_ALL_RESOURCES;
	
	public JwtAuthenticationFilter (JwtProvider jwtProvider, String ... permitAllResources) {
		this.jwtProvider = jwtProvider;
		this.PERMIT_ALL_RESOURCES = permitAllResources;
	}
	
	@Override
	protected void doFilterInternal(
			HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain
			) throws ServletException, IOException {
		
		// Request에서 Access Token 추출
		String sAccessToken = jwtProvider.resolveToken(request);
		if (sAccessToken == null || !StringUtils.hasText(sAccessToken)) {
			log.info("Invalid JWT Token : " + request.getServletPath());
			response.sendError(HttpServletResponse.SC_FORBIDDEN);
		}
		
		// Access Token 검증
		JwtCode jwtCode = jwtProvider.validateToken(sAccessToken);
		
		switch(jwtCode) {
		case ACCESS:
			// Access Token에서 인증(Authentication) 객체 생성
			Authentication authentication = jwtProvider.getAuthentication(sAccessToken);
			
			// security context에 인증 정보 저장
			SecurityContextHolder.getContext().setAuthentication(authentication);
			break;
		case EXPIRED:
			log.info("Access token expired");
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			break;
		case DENIED:
			log.info("Invalid JWT Token");
			response.sendError(HttpServletResponse.SC_FORBIDDEN);
			break;
		default:
			log.info("Invalid JWT Token");
			response.sendError(HttpServletResponse.SC_FORBIDDEN);
			break;
		}
		
		filterChain.doFilter(request, response);
	}
	
	// 필터링에서 제외시키고 싶은 request
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		return Arrays.stream(PERMIT_ALL_RESOURCES)
				.anyMatch(permit -> new AntPathMatcher().match(permit, request.getRequestURI()));
	}
}
