package com.sns.jwt;

import org.springframework.beans.BeanUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.sns.dao.UserDao;
import com.sns.dto.UserDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
	private final UserDao userDao;
	
	public UserDetails loadUserByEmailAndProvider(String email, String provider) throws UsernameNotFoundException {
		log.info("CustomUserDetailsService loadUserByUsernameAndProvider : email={}, provider={} ", email, provider);
		
		UserDto userDto = userDao.mtdFindByEmailAndProvider(email, provider);
		
		if(userDto == null) {
			log.error("No user found for email={} and provider={}", email, provider);
			throw new UsernameNotFoundException("User not found with email=" + email + " and provider=" + provider);
		}
		
		return new PrincipalDetails(userDto);
	}
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		log.info("Use loadUserByEmailAndProvider instead.");
		log.info("CustomUserDetailsService loadUserByUsername: username={}", username);
		return loadUserByEmailAndProvider(username, "local");
	}
}
