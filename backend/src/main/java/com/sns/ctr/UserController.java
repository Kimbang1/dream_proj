package com.sns.ctr;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sns.dao.UserDao;
import com.sns.dto.UserDto;
import com.sns.jwt.JwtProvider;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@Slf4j
public class UserController {
	
	private final UserDao userDao;
	private final JwtProvider jwtProvider;
	
	@GetMapping("/info")
	public ResponseEntity<?> mtdUserInfo(HttpServletRequest request) {
		
		HashMap<String, String> responseBody = new HashMap<>();
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
		
		return ResponseEntity.ok(user);
	}
	
	@PutMapping("/update")
	public ResponseEntity<HashMap<String, String>> updateUserProfile(@RequestBody UserDto userDto, HttpServletRequest request) {
		log.info("tag_id: {}", userDto.getTag_id());
		log.info("username: {}", userDto.getUsername());
		log.info("phone: {}", userDto.getPhone());
		
		HashMap<String, String> responseBody = new HashMap<>();
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
		
		if (user == null) {
			log.error("사용자를 찾을 수 없습니다.");
			responseBody.put("message", "사용자 정보를 찾을 수 없습니다.");
	        return new ResponseEntity<>(responseBody, HttpStatus.NOT_FOUND);
		}
		
		String tagId = userDto.getTag_id();
		
		// tag_id 중복 검사
		if(tagId != null && !(user.getTag_id().equals(tagId))) {
			boolean tagIdChk = userDao.mtdTagIdCheck(tagId);
			if(tagIdChk) {
				log.info("이미 존재하는 tagid입니다.");
				responseBody.put("message", "이미 존재하는 tagid입니다.");
				return new ResponseEntity<>(responseBody, HttpStatus.UNAUTHORIZED);
			} else {
				log.info("변경 가능한 tagid입니다.");
			}
		}
		
		// UserDto 업데이트
		UserDto updatedUserDto = UserDto.builder()
				.uuid(user.getUuid())
				.tag_id(userDto.getTag_id())
				.username(userDto.getUsername())
				.phone(userDto.getPhone())
				.build();
		
		// DB 업데이트 처리
		if (userDao.mtdUpdateUser(updatedUserDto) == 1) {
			log.info("변경이 완료되었습니다.");
			responseBody.put("message", "변경이 완료되었습니다.");
		    return new ResponseEntity<>(responseBody, HttpStatus.OK);
		} else {
			log.error("업데이트 실패");
		    responseBody.put("message", "업데이트에 실패했습니다.");
		    return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
		
	
}
