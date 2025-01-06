package com.sns.ctr;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
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
import com.sns.social.GoogleApi;
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
	private final GoogleApi googleApi;
	private final PasswordEncoder passwordEncoder;
	
	@Value("${spring.security.oauth2.client.registration.google.client-id}")
	private String googleClientId;
	
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
	public ResponseEntity<?> mtdKakaoRes(@RequestParam("code") String code, HttpServletResponse response){
		// ^ 인가 코드 받기
		
		// 2. 인가 코드로 액세스 토큰 요청
		String accessToken = kakaoApi.getAccessToken(code);
		
		// 3. 사용자 정보 요청
		Map<String, Object> userInfo = kakaoApi.getUserInfo(accessToken);
		String id = (String)userInfo.get("id");
		String email = (String)userInfo.get("email");
		String nickname = (String)userInfo.get("nickname"); // 나중에 지우기
		String provider = "kakao";
		
		System.out.println("id : " + id);
		System.out.println("email : " + email);
		System.out.println("nickname : " + nickname);
		System.out.println("accessToken : " + accessToken);
		
		UserDto userDto = userDao.mtdFindByEmailAndProvider(email, provider);
		
		// 가입 여부 확인 및 처리
		if(userDto == null) {
			// 새 사용자 등록
			userDto = new UserDto();
			String create_uuid = UUID.randomUUID().toString(); 	// uuid 생성
			userDto.setUuid(create_uuid);
			userDto.setEmail(email);
			userDto.setSocial_key(id);
			userDto.setProvider(provider);
			
			// 사용자 데이터 저장
			try {
				userDao.mtdInsert(userDto);
				
				// 신규 사용자 JSON 응답
				return ResponseEntity
						.status(HttpStatus.CREATED)
						.body(Map.of(
								"status", "success",
								"message", "회원가입 성공",
								"data", Map.of(
										"provider", provider,
										"uuid", userDto.getUuid()
										)
								));
			} catch (Exception e) {
				log.error("회원가입 처리 중 오류: {}", e.getMessage());
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.body(Map.of(
								"status", "error",
								"message", "회원가입 처리 중 오류 발생"
								));
			}
		}
		
		// 기존 회원 JSON 응답(로그인 데이터 반환)
		return ResponseEntity
				.status(HttpStatus.OK)
				.body(Map.of(
						"status", "success",
						"message", "이미 존재하는 회원입니다.",
						"data", Map.of(
								"provider", provider,
								"email", email,
								"key", id
								)
						));
	}
	
	@RequestMapping("/google")
	public void mtdGoogle(HttpServletResponse response) {
	    String redirect_uri = "http://localhost:8081/join/google_res";
	    String uri = "https://accounts.google.com/o/oauth2/v2/auth?client_id="+googleClientId+"&redirect_uri="+redirect_uri+"&response_type=code&scope=email profile";
	    try {
	        response.sendRedirect(uri);
	    } catch (IOException e) {
	        e.printStackTrace();
	    }
	}
	
	@RequestMapping("/google_res")
	public void mtdGoogleRes(@RequestParam("code")String code) {
		String accessToken = googleApi.getAccessToken(code);
	}
	
}
