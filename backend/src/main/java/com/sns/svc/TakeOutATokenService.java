package com.sns.svc;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sns.dao.UserMapper;
import com.sns.dto.UserDto;
import com.sns.jwt.JwtProvider;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TakeOutATokenService {
	
	private final JwtProvider jwtProvider;
	private final UserMapper userDao;
	
	public HashMap<String, Object> takeOutAToken(HttpServletRequest request) {
		HashMap<String, Object> responseBody = new HashMap<>();
		String accessToken = null;
		
		// AccessToken 추출
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if ("accessToken".equals(cookie.getName())) {
					accessToken = cookie.getValue();
					break;
				}
			}
		}
			
		if (accessToken == null) {
			log.error("Access token이 존재하지 않습니다.");
			responseBody.put("data", null);
			responseBody.put("message", "로그인이 필요합니다.");
			return responseBody;
		}
			
		// AccessToken에서 사용자 정보 추출
		String email = jwtProvider.getEmailFromToken(accessToken);
		String provider = jwtProvider.getProviderFromToken(accessToken);
		UserDto user = userDao.mtdFindByEmailAndProvider(email, provider);
		
		responseBody.put("data", user);
		
		return responseBody;
	}
	
}
