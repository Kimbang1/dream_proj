package com.sns.jwt;

public enum JwtCode {
	ACCESS("ACCESS"),
	EXPIRED("EXPIRED"),
	DENIED("DENIED"),
	;

	private final String code;
	
	JwtCode(String code) {
		this.code = code;
	}

	public String getCode() {
		return code;
	}
}
