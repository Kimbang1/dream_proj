package com.sns.jwt;

import java.util.Collection;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import jakarta.servlet.http.HttpServletRequest;

public class CustomAuthenticationToken extends UsernamePasswordAuthenticationToken {
	
	private final String provider;
	private final HttpServletRequest request;
	
	public CustomAuthenticationToken(Object pricipal, Object credentials, String provider, HttpServletRequest request) {
		super(pricipal, credentials);
		this.provider = provider;
		this.request = request;
	}
	
	public CustomAuthenticationToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities, String provider, HttpServletRequest request) {
		super(principal, credentials, authorities); // 기존 UsernamePasswordAuthenticationToken 생성자 호출
        this.provider = provider;
        this.request = request;
	}
	
	public String getProvider() {
		return provider;
	}
	
	public HttpServletRequest getRequest() {
		return request;
	}
}
