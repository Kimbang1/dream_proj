package com.sns.jwt;

import java.util.Collection;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class CustomAuthenticationToken extends UsernamePasswordAuthenticationToken {
	
	private final String provider;
	private final String requestType;
	
	public CustomAuthenticationToken(Object pricipal, Object credentials, String provider, String requestType) {
		super(pricipal, credentials);
		this.provider = provider;
		this.requestType = requestType;
	}
	
	public CustomAuthenticationToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities, String provider, String requestType) {
		super(principal, credentials, authorities); // 기존 UsernamePasswordAuthenticationToken 생성자 호출
        this.provider = provider;
        this.requestType = requestType;
	}
	
	public String getProvider() {
		return provider;
	}
	
	public String getRequestType() {
		return requestType;
	}
}
