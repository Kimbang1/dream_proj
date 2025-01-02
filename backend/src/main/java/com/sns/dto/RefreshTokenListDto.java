package com.sns.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class RefreshTokenListDto {
	
	private String re_token;
	private String uuid;
	private String user_agent;
	private Timestamp create_at;
	private boolean is_using;
	private Timestamp expires_in;
	
}
