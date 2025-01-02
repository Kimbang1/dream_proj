package com.sns.jwt;

public enum JwtCode {
	ACCESS("ACCESS", "토큰이 유효하고 접근이 허용됩니다."),
	EXPIRED("EXPIRED", "토큰이 만료되었습니다."),
	DENIED("DENIED", "토큰이 잘못되었거나 지원되지 않습니다."),
	;

	private final String code;
	private final String message;
	
	JwtCode(String code, String message) {
		this.code = code;
		this.message = message;
	}

	public String getCode() {
		return code;
	}
	
	public String getMessage() {
		return message;
	}
}
