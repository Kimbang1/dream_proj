package com.sns.ctr;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sns.dao.FileListMapper;
import com.sns.dao.FilePostMapper;
import com.sns.dao.PostMapper;
import com.sns.dao.UserDao;
import com.sns.dto.UserDto;
import com.sns.jwt.JwtProvider;
import com.sns.svc.FileService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/comment")
@Slf4j
@RequiredArgsConstructor
public class CommentController {
	
	private final JwtProvider jwtProvider;
	private final UserDao userDao;
	
	@RequestMapping("/write")
	public Object mtdCommentWrite(@RequestBody HashMap<String, String> requestData, HttpServletRequest request) {
		
		log.info("/comment/write 까지 왔어");
		
		HashMap<String, String> responseBody = new HashMap<>();
	    String linkId = requestData.get("linkId");
	    String content = requestData.get("content");
	    
	    System.out.println("link_id: " + linkId);
        System.out.println("content: " + content);
		   
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
			responseBody.put("message", "로그인이 필요합니다.");
			return new ResponseEntity<>(responseBody, HttpStatus.UNAUTHORIZED);
		}
		
		// AccessToken에서 사용자 정보 추출
		String email = jwtProvider.getEmailFromToken(accessToken);
		String provider = jwtProvider.getProviderFromToken(accessToken);
		UserDto user = userDao.mtdFindByEmailAndProvider(email, provider);
		
		requestData.get(accessToken);
		
		return null;
	}
	
}
