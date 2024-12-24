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

// Spring의 Bean으로 등록하기 위한 어노테이션
@Component

// 
@Slf4j
public class KakaoApi {
	
	// application-private.properties에서 설정된 값을 읽어들이는 어노테이션
	@Value("${kakao.api_key}")
	private String kakaoApiKey;
	
	@Value("${kakao.redirect_uri}")
	private String kakaoRedirectUri;
	
	
	// 인가 코드를 받아서 accessToken을 반환하는 메서드
	public String getAccessToken(String code) {
		String accessToken = "";
		String refreshToken = "";
		String reqUrl = "https://kauth.kakao.com/oauth/token";
		
		try {
			URL url = new URL(reqUrl);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			
			// 필수 헤더 세팅
			conn.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
			// OutputStream으로 POST 데이터를 넘겨주겠다는 옵션
			conn.setDoOutput(true);
			
			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
			StringBuilder sb = new StringBuilder();
			
			// 필수 쿼리 파라미터 세팅
			sb.append("grant_type=authorization_code");
			sb.append("&client_id=").append(kakaoApiKey);
			sb.append("&redirect_uri=").append(kakaoRedirectUri);
			sb.append("&code=").append(code);
			
			bw.write(sb.toString());
			bw.flush();
			
			int responseCode = conn.getResponseCode();
			log.info("[KakaoApi.getAccessToken] responseCode = {}", responseCode);
			
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
	
	// accessToken을 받아서 UserInfo 반환
	public HashMap<String, Object> getUserInfo(String accessToken) {
		HashMap<String, Object> userInfo = new HashMap<>();
		String reqUrl = "https://kapi.kakao.com/v2/user/me";
		
		try {
			URL url = new URL(reqUrl);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
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
			
			JsonObject jsonObject = JsonParser.parseString(result).getAsJsonObject();
			JsonObject properties = jsonObject.getAsJsonObject("properties");
			JsonObject kakaoAccount = jsonObject.getAsJsonObject("kakao_account");
			
			String nickname = properties.get("nickname").getAsString();
			String email = kakaoAccount.get("email").getAsString();
			
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
	
	// accessToken을 받아서 로그아웃 시키는 메서드
	public void kakaoLogout(String accessToken) {
		String reqUrl = "https://kapi.kakao.com/v1/user/logout";
		
		try {
			URL url = new URL(reqUrl);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			
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
