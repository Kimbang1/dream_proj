package com.sns.ctr;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sns.dao.UserDao;
import com.sns.dto.UserDto;
import com.sns.social.KakaoApi;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/join")
@RequiredArgsConstructor
@Slf4j
public class JoinController {
	
	private final UserDao userDao;
	private final KakaoApi kakaoApi;
	private final PasswordEncoder passwordEncoder;
	
	@PostMapping("/local")
	@Transactional
	public ResponseEntity<?> mtdJoinProc(@RequestBody UserDto  userDto) {
		
		// 가입되어있는지 체크
		if(userDao.mtdFindByEmailAndProvider(userDto.getEmail(), userDto.getProvider()) != null) {
			log.error("이미 존재하는 회원입니다.");
			
			return ResponseEntity
					.status(HttpStatus.CONFLICT)	// 409 상태코드
					.body("이미 존재하는 회원입니다.");
		}
		
		// uuid 생성
		String create_uuid = UUID.randomUUID().toString();
		userDto.setUuid(create_uuid);
		
		// 비밀번호 passwordEncoder로 해싱하기
		userDto.setPwd(passwordEncoder.encode(userDto.getPwd()));
		
		try {
			userDao.mtdInsert(userDto);
			return ResponseEntity
					.status(HttpStatus.CREATED)
					.body("회원가입 성공");
		} catch(Exception e) {
			// 오류 발생 시 error 페이지로 넘기기
			log.error("회원가입 처리 중 오류 : {}", e.getMessage());
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원가입 처리 중 오류 발생");
		}
	}
	
	@RequestMapping("/kakao")
	public void mtdKakao(HttpServletResponse response) {
	    String rest_api_key = "8f8065c3d2d2cc8e683269c8d075800c";
	    String redirect_uri = "http://localhost:8081/auth/kakao_res";
	    String uri = "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=" + rest_api_key + "&redirect_uri=" + redirect_uri;
	    try {
	        response.sendRedirect(uri);
	    } catch (IOException e) {
	        e.printStackTrace();
	    }
	}
	
	@RequestMapping("/kakao_res")
	public ResponseEntity<?> mtdSocialRes(@RequestParam("code") String code, HttpServletResponse response){
		// ^ 인가 코드 받기
		
		// 2. 토큰 받기
		String accessToken = kakaoApi.getAccessToken(code);
		
		// 3. 사용자 정보 받기
		Map<String, Object> userInfo = kakaoApi.getUserInfo(accessToken);
		
		String id = (String)userInfo.get("id");
		String email = (String)userInfo.get("email");
		String nickname = (String)userInfo.get("nickname");
		
		UserDto userDto = userDao.mtdFindByEmailAndProvider(email, "kakao");
		
		// 가입되어있는지 체크
		if(userDto != null && userDto.getIs_using()) {
			log.info("이미 존재하는 회원입니다.");
			
			return ResponseEntity
					.status(HttpStatus.CONFLICT)	// 409 상태코드
					.body("이미 존재하는 회원입니다.");
		}
		
		System.out.println("id : " + id);
		System.out.println("email : " + email);
		System.out.println("nickname : " + nickname);
		System.out.println("accessToken : " + accessToken);
		
		try {
			userDao.mtdInsert(userDto);
			return ResponseEntity
					.status(HttpStatus.CREATED)
					.body("회원가입 성공");
		} catch(Exception e) {
			// 오류 발생 시 error 페이지로 넘기기
			log.error("회원가입 처리 중 오류 : {}", e.getMessage());
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원가입 처리 중 오류 발생");
		}
		
	}
	
}
