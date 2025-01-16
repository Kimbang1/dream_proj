package com.sns.ctr;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sns.dao.SNSDao;
import com.sns.dao.UserMapper;
import com.sns.dto.SNSDto;
import com.sns.dto.UserDto;
import com.sns.social.KakaoApi;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor 	// final이 붙은 필드에 의존성 자동 주입
@RestController
public class MainController {
	
	@Autowired
	private SNSDao snsDao;
	
	@Autowired
	private UserMapper userDao;
	
	private final KakaoApi kakaoApi;
	
	@RequestMapping("/res")
	public String mtdRes() {
		return "완료";
	}
	
	@GetMapping("/test")
	public List<String> hello() {
		List<String> test = new ArrayList<String>();
		test.add("seoul");
		test.add("incheon");
		test.add("bucheon");
		test.add("gumcheongucheong");
		return test;
	}
	
	@RequestMapping("/linkchk")
	public ResponseEntity<Map<String, String>> test(SNSDto snsDto) {
		System.out.println("username" + snsDto.getUsername());
		System.out.println("age" + snsDto.getAge());
		System.out.println("dazim" + snsDto.getDazim());
		snsDao.mtdInsert(snsDto);
		Map<String, String> response = new HashMap<>();
		response.put("redirectUrl", "/res");
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/select")
	public List<SNSDto> select() {
		List<SNSDto> list = snsDao.mtdSelect();
		return list;
	}
	
	@RequestMapping("/kakao")
	public ResponseEntity<?> mtdKakao(HttpServletResponse response) {
		String rest_api_key = "8f8065c3d2d2cc8e683269c8d075800c";
		String redirect_uri = "http://localhost:8081/social_res";
		String uri = "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=" + rest_api_key + "&redirect_uri=" + redirect_uri;
		try {
			response.sendRedirect(uri);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok().build();
	}
	
	@RequestMapping("/social_res")
	public String mtdSocialRes(@RequestParam("code") String code, HttpServletResponse response){
		// ^ 인가 코드 받기
		
		// 2. 토큰 받기
		String accessToken = kakaoApi.getAccessToken(code);
		
		// 3. 사용자 정보 받기
		Map<String, Object> userInfo = kakaoApi.getUserInfo(accessToken);
		
		String id = (String)userInfo.get("id");
		String email = (String)userInfo.get("email");
		String nickname = (String)userInfo.get("nickname");
		
		System.out.println("id : " + id);
		System.out.println("email : " + email);
		System.out.println("nickname : " + nickname);
		System.out.println("accessToken : " + accessToken);
		
		return "성공";
	}
	
	@GetMapping("/select_test")
	public ResponseEntity<?> mtdSelectTest(@RequestParam("email") String email, @RequestParam("provider") String provider) {
		UserDto userDto = userDao.mtdFindByEmailAndProvider(email, provider);
		System.out.println(userDto.getEmail());
		System.out.println(userDto.getTag_id());
		System.out.println(userDto.getUuid());
		return ResponseEntity.ok(userDto);
	}
	
}
