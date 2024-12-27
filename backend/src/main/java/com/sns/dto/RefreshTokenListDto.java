package com.sns.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class RefreshTokenListDto {
	
	private String reToken;
	private String uuid;
	private String userAgent;
	private Timestamp createAt;
	private boolean isUsing;
	private Timestamp expiresIn;
	
}
