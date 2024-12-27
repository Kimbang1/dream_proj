package com.sns.jwt;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
// Spring Security 설정 시 ExceptionHandling에 추가
// 인가(Authorization)실패 시 실행
// SC_FORBIDDEN(403) Error
public class JwtAccessDeniedHandler implements AccessDeniedHandler {
	
	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
			AccessDeniedException accessDeniedException) throws IOException, ServletException {
		log.error("JWT : {}, URI : {}, MESSAGE : {}, Error : {}",
				request.getHeader("Authorization"),
				request.getRequestURI(),
				accessDeniedException.getMessage(),
				HttpServletResponse.SC_FORBIDDEN);
		response.sendError(HttpServletResponse.SC_FORBIDDEN);
	}
	
}
