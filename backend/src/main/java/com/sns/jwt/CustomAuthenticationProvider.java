package com.sns.jwt;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {
	private final CustomUserDetailsService customUserDetailsService;
	private final PasswordEncoder passwordEncoder;
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String email = authentication.getName();
		String password = authentication.getCredentials().toString();
		String provider = ((CustomAuthenticationToken) authentication).getProvider();
		
		UserDetails userDetails =  customUserDetailsService.loadUserByEmailAndProvider(email, provider);
		
		// 비밀번호 검증(이 과정은 기본적으로 PasswordEncoder를 사용)
		if (userDetails.getPassword() == null) {
			throw new BadCredentialsException("password null");
		}
		if (!passwordEncoder.matches(password, userDetails.getPassword())) {
			throw new BadCredentialsException("Invalid credentials CUstomAuthenticationProvider");
		}
		
		// 인증이 완료된 후, 4개의 매개변수로 새로운 Authentication 객체 반환
		return new CustomAuthenticationToken(userDetails, null, userDetails.getAuthorities(), provider);
	}
	
	@Override
	public boolean supports(Class<?> authentication) {
		return CustomAuthenticationToken.class.isAssignableFrom(authentication);
	}
}
