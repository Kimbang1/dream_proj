package com.sns.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {
	
	@Value("${permit.url}")
	private String[] PERMIT_ALL_RESOURCES;
	
	private final JwtProvider jwtProvider;
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	};
	
	@Bean
	protected SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception {
		httpSecurity
		.httpBasic(HttpBasicConfigurer -> HttpBasicConfigurer.disable())
		.formLogin(formLogin -> formLogin.disable())
		.csrf(csrf -> csrf.disable())
		.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
		.authorizeHttpRequests(authorize -> authorize
				.requestMatchers(this.getPermitAllResources()).permitAll()
				.requestMatchers(new AntPathRequestMatcher("/admin/**")).hasAuthority("ADMIN")
				.requestMatchers(new AntPathRequestMatcher("/api/v1/**")).hasAnyAuthority("USER", "ADMIN")
				.anyRequest().authenticated())
		.exceptionHandling(exception -> exception
				.accessDeniedHandler(new JwtAccessDeniedHandler())
				.authenticationEntryPoint(new JwtAuthenticationEntryPoint()))
		.addFilterBefore(new JwtAuthenticationFilter(jwtProvider, PERMIT_ALL_RESOURCES), UsernamePasswordAuthenticationFilter.class);
		return httpSecurity.build();
	}
	
	private AntPathRequestMatcher[] getPermitAllResources() {
		AntPathRequestMatcher antPathRequestMatcherArr[] = new AntPathRequestMatcher[PERMIT_ALL_RESOURCES.length];
		for(int i = 0; i < PERMIT_ALL_RESOURCES.length; i++) {
			antPathRequestMatcherArr[i] = new AntPathRequestMatcher(PERMIT_ALL_RESOURCES[i]);
		}
		return antPathRequestMatcherArr;
	}
	
}
