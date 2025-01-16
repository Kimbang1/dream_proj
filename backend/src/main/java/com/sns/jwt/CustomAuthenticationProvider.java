package com.sns.jwt;

import java.util.Collection;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.sns.dao.UserMapper;
import com.sns.dto.UserDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class CustomAuthenticationProvider implements AuthenticationProvider {
	private final UserMapper userDao;
	private final PasswordEncoder passwordEncoder;
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		CustomAuthenticationToken token = (CustomAuthenticationToken) authentication;
		
		String email = (String) token.getPrincipal();
		String credentials = (String) token.getCredentials();
		String provider = token.getProvider();
		String requestType = token.getRequestType();

		// 사용자 조회
		UserDto userDto = userDao.mtdFindByEmailAndProvider(email, provider);
		
		
		if (userDto == null) {
			log.warn("CustomAuthenticationProvider: User not found with email={} and provider={}", email, provider);
			throw new BadCredentialsException("CustomAuthenticationProvider: User not found C");
		}
		
		String key = provider.equals("local") ? userDto.getPwd() : userDto.getSocial_key();
		if (key == null || key.isEmpty()) {
		    throw new BadCredentialsException("CustomAuthenticationProvider: Key is missing or empty");
		}
		
		// 비밀번호 검증은 login 요청에서만 수행
		if("login".equals(requestType)) {
			// 비밀번호가 불일치 하는 경우
			if (!passwordEncoder.matches(credentials, key)) {
				log.warn("CustomAuthenticationProvider: Invalid credentials for email={} and provider={}", email, provider);
				throw new BadCredentialsException("CustomAuthenticationProvider: Invalid credentials");
			}
		}
		
		// 인증 성공 시 PrincipalDetails 생성
		PrincipalDetails principalDetails = new PrincipalDetails(userDto);
		
		return new CustomAuthenticationToken(principalDetails, null, principalDetails.getAuthorities(), provider, requestType);
	}
	
	@Override
	public boolean supports(Class<?> authentication) {
		return CustomAuthenticationToken.class.isAssignableFrom(authentication);
	}
}
