package com.sns.jwt;

import java.util.Collection;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class CustomAuthenticationToken extends UsernamePasswordAuthenticationToken {
	
	private final String provider;
	
	public CustomAuthenticationToken(Object pricipal, Object credentials, String provider) {
		super(pricipal, credentials);
		this.provider = provider;
	}
	
	public CustomAuthenticationToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities, String provider) {
		super(principal, credentials, authorities); // 기존 UsernamePasswordAuthenticationToken 생성자 호출
        this.provider = provider;
	}
	
	public String getProvider() {
		return provider;
	}
}
