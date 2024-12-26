package com.sns.jwt;

import java.security.Key;
import java.util.ArrayList;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class TokenProvider {
	
	private final static String AUTHORITIES_KEY = "auth";
	private final String secret;
	private final long tokenValidityInMilliseconds;
	private Key key;
	
	public TokenProvider(
			@Value("${jwt.secret}") String secret,
			@Value("${jwt.token-validity-in-seconds}") long tokenValidityInSeconds
			) {
		this.secret = secret;
		this.tokenValidityInMilliseconds = tokenValidityInSeconds * 1000;
	}
	
	// JWT 생성
	public String createToken(Authentication authentication) {
		String username = authentication.getName();
		
		key = Keys.hmacShaKeyFor(secret.getBytes());
		
		return Jwts.builder()
				.setSubject(username)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + tokenValidityInMilliseconds))
				.signWith(key, SignatureAlgorithm.HS512)
				.compact();
	}
	
	// JWT 검중
	public boolean validateToken(String token) {
		try {
	        Jwts.parserBuilder()  // parser() 대신 parserBuilder() 사용
	            .setSigningKey(secret.getBytes())  // secret을 byte[]로 변환하여 사용
	            .build()  // parserBuilder()는 build() 호출이 필요
	            .parseClaimsJws(token);  // 토큰 파싱
	        return true;
	    } catch (Exception e) {
	        log.info("Invalid JWT token or signature error: " + e.getMessage());
	        return false;
	    }
    }
	
	// JWT에서 Authentication 객체 얻기
    public Authentication getAuthentication(String token) {
        // JWT에서 사용자 정보 추출 후 Authentication 객체 생성
        String username = Jwts.parserBuilder()  // parser() 대신 parserBuilder() 사용
                .setSigningKey(secret.getBytes())  // secret을 byte[]로 변환하여 사용
                .build()  // parserBuilder()는 build() 호출이 필요
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        
        // UsernamePasswordAuthenticationToken을 이용해 인증 객체 생성
        // 권한은 빈 리스트라도 넘겨주어야 함
        return new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
    }
	
	
}
