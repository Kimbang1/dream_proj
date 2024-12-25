package com.sns.social;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import lombok.extern.slf4j.Slf4j;

// Kakao API를 사용해 사용자 인증 및 정보 처리

// Spring의 Bean으로 등록하기 위한 어노테이션
@Component

// Lombok 어노테이션, log 객체를 자동 생성
@Slf4j
public class KakaoApi {
	
	// application-private.properties에서 설정된 값을 읽어들이는 어노테이션
	@Value("${kakao.api_key}")
	private String kakaoApiKey; 		// Kakao REST API의 클라이언트 키
	
	@Value("${kakao.redirect_uri}")
	private String kakaoRedirectUri;	// 사용자 인증 후 리디렉션될 URI
	
	
	// 인가 코드를 받아서 accessToken을 반환하는 메서드
	public String getAccessToken(String code) {
		String accessToken = "";
		String refreshToken = "";
		
		// Kakao Token 발급 요청 URL 설정
		String reqUrl = "https://kauth.kakao.com/oauth/token";
		
		try {
			URL url = new URL(reqUrl);
			
			// HTTP 연결 객체 생성 및 설정
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			// 필수 헤더 세팅
			conn.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
			// OutputStream으로 POST 데이터를 보낼 준비(서버로 데이터를 전송하기 위한 출력 스트림을 열겠다는 설정)
			conn.setDoOutput(true);
			
			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
			StringBuilder sb = new StringBuilder();
			
			// 필수 쿼리 파라미터 세팅
			sb.append("grant_type=authorization_code");				// authorization_code로 고정, 인증 방식을 지정
			sb.append("&client_id=").append(kakaoApiKey);			// Kakao API Key
			sb.append("&redirect_uri=").append(kakaoRedirectUri);	// 리디렉션 URI
			sb.append("&code=").append(code);						// 사용자가 전달한 인가 코드
			
			bw.write(sb.toString());
			bw.flush();
			
			// 응답 처리
			int responseCode = conn.getResponseCode();
			log.info("[KakaoApi.getAccessToken] responseCode = {}", responseCode);
			
			BufferedReader br;
			if (responseCode >= 200 && responseCode < 300) { 	// 응답 코드가 200번대면 성공적으로 처리된 데이터를 읽기
				br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			} else {	// 응답코드가 200번대가 아닌 경우 에러 데이터 읽기
				br = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
			}
			
			String line = "";
			StringBuilder responseSb = new StringBuilder();
			while((line = br.readLine()) != null) {
				responseSb.append(line);
			}
			String result = responseSb.toString();
			log.info("responseBody = {}", result);
			
			// JSON 데이터 파싱, 응답 데이터를 JSON 형태로 파싱해 act와 rft를 추출
			JsonObject jsonObject = JsonParser.parseString(result).getAsJsonObject();
			accessToken = jsonObject.get("access_token").getAsString();
			refreshToken = jsonObject.get("refresh_token").getAsString();
			
			br.close();
			bw.close();
			
		} catch (MalformedURLException e) {
			System.out.println("act f발급 중 MURLE : " + e.getMessage());
		} catch (IOException e) {
			System.out.println("act 발급 중 IOE : " + e.getMessage());
		}
		
		
		return accessToken;
	}
	
	
	// 발급 받은 accessToken으로 사용자의 프로필 정보 가져오는 메서드
	public HashMap<String, Object> getUserInfo(String accessToken) {
		
		// 사용자 정보 저장할 HashMap 생성
		HashMap<String, Object> userInfo = new HashMap<>();
		
		// Kakao 사용자 정보 요청 URL 설정
		String reqUrl = "https://kapi.kakao.com/v2/user/me";
		
		try {
			URL url = new URL(reqUrl);
			
			// HTTP 연결 객체 생성 및 설정
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			
			// Authorization 헤더에 Access Token 추가하여 인증
			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			conn.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
			
			int responseCode = conn.getResponseCode();
			log.info("[KakaoApi.getUserInfo] responseCode : {}", responseCode);
			
			BufferedReader br;
			if (responseCode >= 200 && responseCode < 300) {
				br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			} else {
				br = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
			}
			
			String line = "";
			StringBuilder responseSb = new StringBuilder();
			while((line = br.readLine()) != null) {
				responseSb.append(line);
			}
			String result = responseSb.toString();
			log.info("responseBody = {}", result);
			
			// 응답 처리 및 JSON 파싱
			JsonObject jsonObject = JsonParser.parseString(result).getAsJsonObject();
			// id: 카카오 고유 id
			String kakaoID = jsonObject.get("id").getAsString();
			// properties: 사용자 프로필 정보
			JsonObject properties = jsonObject.getAsJsonObject("properties");
			// kakao_account: 사용자의 카카오 계정 정보
			JsonObject kakaoAccount = jsonObject.getAsJsonObject("kakao_account");
			
			String nickname = properties.get("nickname").getAsString();
			String email = kakaoAccount.get("email").getAsString();
			
			// kakao 고유 id, 프로필 정보(닉네임)와 이메일 추출 해 HashMap에 저장
			userInfo.put("id", kakaoID);
			userInfo.put("nickname", nickname);
			userInfo.put("email", email);
			
			br.close();
			
		} catch (MalformedURLException e) {
			System.out.println("UserInfo 반환 중 MURLE : " + e.getMessage());
		} catch (IOException e) {
			System.out.println("UserInfo 반환 중 IOE : " + e.getMessage());
		}
		return userInfo;
	}
	
	
	// 사용자 access token을 이용해 카카오 계정에서 로그아웃 처리 메서드
	public void kakaoLogout(String accessToken) {
		
		// Kakao 로그아웃 요청 URL 설정
		String reqUrl = "https://kapi.kakao.com/v1/user/logout";
		
		try {
			URL url = new URL(reqUrl);
			
			// HTTP 연결 객체 생성 및 설정
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			// Access Token을 이용해 인증 후 로그아웃 요청
			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			
			// 응답 처리
			int responseCode = conn.getResponseCode();
			log.info("[KakaoApi.kakaoLogout] responseCode : {}", responseCode);
			
			BufferedReader br;
			if(responseCode >= 200 && responseCode <= 300) {
				br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			} else {
				br = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
			}
			
			String line = "";
			StringBuilder responseSb = new StringBuilder();
			while((line = br.readLine()) != null) {
				responseSb.append(line);
			}
			String result = responseSb.toString();
			log.info("kakao logout - responseBody = {}", result);
			
		} catch (MalformedURLException e) {
			System.out.println("act 로그아웃 중 MURLE : " + e.getMessage());
		} catch (IOException e) {
			System.out.println("act 로그아웃 중 IOE : " + e.getMessage());
		}
	}
}
