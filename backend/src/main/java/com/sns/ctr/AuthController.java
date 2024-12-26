package com.sns.ctr;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sns.dao.UserDao;
import com.sns.dto.TokenDto;
import com.sns.dto.UserDto;
import com.sns.jwt.TokenProvider;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {
	private final TokenProvider tokenProvider;
	private final AuthenticationManagerBuilder authenticationManagerBuilder;
	
	@PostMapping("/authenticate")
	public ResponseEntity<TokenDto> authenticate(@RequestBody UserDto userDto) {
		Authentication authentication = authenticationManagerBuilder.getObject()
				.authenticate(new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPwd()));
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		String jwt = tokenProvider.createToken(authentication);
		
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.add("Authorization", "Bearer" + jwt);
		
		TokenDto tokenDto = new TokenDto(jwt);
		return new ResponseEntity<>(tokenDto, httpHeaders, HttpStatus.OK);
	}
}
