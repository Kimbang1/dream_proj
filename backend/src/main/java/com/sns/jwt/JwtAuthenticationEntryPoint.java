package com.sns.jwt;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
// Spring Security 설정 시 ExceptionHandling에 추가
// 인증(Authentication) 실패 시 실행
// SC_UNAUTHORIZED(401) Error
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
	
	@Override
	public void commence(HttpServletRequest request,
			HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {
		log.info("message: {}", authException.getMessage());
		if (authException.getMessage().contains("Expired JWT token")) {
			log.error("URI : {} , MESSAGE : {} , Error : {}",
					request.getRequestURI(),
					authException.getMessage(),
					600);
			response.setStatus(600);
			response.getWriter().write("Access token expired. Please refresh your token.");
			return;
		}
		log.error("URI : {} , MESSAGE : {} , Error : {}",
				request.getRequestURI(),
				authException.getMessage(),
				HttpServletResponse.SC_UNAUTHORIZED);
		response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
	}
}
