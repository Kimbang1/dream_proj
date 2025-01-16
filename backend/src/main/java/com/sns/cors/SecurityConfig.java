package com.sns.cors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.sns.dao.UserMapper;
import com.sns.jwt.CustomAuthenticationProvider;
import com.sns.jwt.CustomUserDetailsService;
import com.sns.jwt.JwtAccessDeniedHandler;
import com.sns.jwt.JwtAuthenticationEntryPoint;
import com.sns.jwt.JwtAuthenticationFilter;
import com.sns.jwt.JwtProvider;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {
	
	@Value("${permit.url}")
	private String[] PERMIT_ALL_RESOURCES;
	
	private final JwtProvider jwtProvider;
	private final CustomUserDetailsService customUserDetailsService;
	private final UserMapper userDao;
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	};
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}
	
	@Bean
	public AuthenticationProvider proAuthenticationProvider() {
		return new CustomAuthenticationProvider(userDao, passwordEncoder());
	}
	
	@Bean
	public SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception {
		httpSecurity
		.httpBasic(HttpBasicConfigurer -> HttpBasicConfigurer.disable()) 	// HTTP Basic 인증 비활성화
		.formLogin(formLogin -> formLogin.disable())						// Form Login 비활성화
		.csrf(csrf -> csrf.disable())										// CSRF 비활성화
		.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) 	// Stateless 세션 관리
		.authorizeHttpRequests(authorize -> authorize
				.requestMatchers(this.getPermitAllResources()).permitAll()
				.requestMatchers(new AntPathRequestMatcher("/admin/**")).hasAuthority("ROLE_ADMIN")
				.requestMatchers(new AntPathRequestMatcher("/api/v1/**")).hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
				.anyRequest().authenticated())		// 위에 작성한 것 외의 요청은 인증 필요
		.exceptionHandling(exception -> exception
				.accessDeniedHandler(new JwtAccessDeniedHandler())	// 권한 오류 처리
				.authenticationEntryPoint(new JwtAuthenticationEntryPoint()))	// 인증 실패 처리
		.addFilterBefore(new JwtAuthenticationFilter(jwtProvider,customUserDetailsService, PERMIT_ALL_RESOURCES), UsernamePasswordAuthenticationFilter.class);
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
