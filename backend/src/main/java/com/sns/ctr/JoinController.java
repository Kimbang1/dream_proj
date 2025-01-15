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
		UserDto inputUserDto = userDao.mtdFindByEmailAndProvider(userDto.getEmail(), userDto.getProvider());
		
		if (inputUserDto == null) {
			// uuid 생성
			String create_uuid = UUID.randomUUID().toString();
			userDto.setUuid(create_uuid);
			
			// 비밀번호 passwordEncoder로 해싱하기
			userDto.setPwd(passwordEncoder.encode(userDto.getPwd()));
			
			// 계정 활성화 설정
			userDto.setIs_using(true);
			userDto.setProfile_path("defaultProfile.png");
			
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
		
		if(!inputUserDto.getIs_using()) {
			inputUserDto.setIs_using(true);
			userDao.mtdSocialJoin(inputUserDto);
			return ResponseEntity
					.status(HttpStatus.CREATED)
					.body("회원가입 성공");
		}
		
		log.error("이미 존재하는 회원입니다.");
		
		return ResponseEntity
				.status(HttpStatus.CONFLICT)	// 409 상태코드
				.body("이미 존재하는 회원입니다.");
	}
	
	@RequestMapping("/kakao")
	public void mtdKakao(HttpServletResponse response) {
	    String rest_api_key = "8f8065c3d2d2cc8e683269c8d075800c";
	    String redirect_uri = "http://localhost:8081/join/kakao_res";
	    String uri = "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=" + rest_api_key + "&redirect_uri=" + redirect_uri;
	    try {
	        response.sendRedirect(uri);
	    } catch (IOException e) {
	        e.printStackTrace();
	    }
	}
	
	@RequestMapping("/kakao_res")
	public void mtdKakaoRes(@RequestParam("code") String code, HttpServletResponse response){
		// ^ 1. 인가 코드 받기
		
		try {
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
				userDto.setSocial_key(passwordEncoder.encode(id));
				userDto.setProvider(provider);
				userDto.setIs_using(false);
				userDto.setProfile_path("defaultProfile.png");
				
				// 사용자 데이터 저장
				userDao.mtdInsert(userDto);
				
				// 회원가입 완료 후 프론트엔드로 리다이렉트
				response.sendRedirect("http://localhost:3000/Social?provider=" + provider + "&uuid=" + create_uuid + "&res=join");
			} else {
				// 기존 회원 
				
				response.sendRedirect("http://localhost:3000/Social?provider=" + provider + "&email=" + email + "&res=login&key=" + id);
			}
			
		} catch (IOException e) {
			log.error("kakao_res, IOE: {}", e.getMessage());
			try {
				response.sendRedirect("http://localhost:3000/login?status=error&message=" + e.getMessage());
			} catch (IOException ie) {
				ie.printStackTrace();
			}
		}
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
