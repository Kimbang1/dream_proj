package com.sns.jwt;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final TokenProvider tokenProvider;
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				// token을 사용하는 방식이기 때문에 csrf disable
				.csrf(csrf -> csrf.disable())
				
				.authorizeHttpRequests(authorizeRequests ->
				authorizeRequests
					.requestMatchers("/api/authenticate").permitAll()  // antMatchers() 대신 requestMatchers() 사용
					.anyRequest().authenticated()  // 모든 요청은 인증 필요
				)
				.addFilterBefore(new JwtFilter(tokenProvider), UsernamePasswordAuthenticationFilter.class);  // and()가 필요 없음

		return http.build();
	}
}
