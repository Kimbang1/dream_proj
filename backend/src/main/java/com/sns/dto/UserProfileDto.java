package com.sns.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class UserProfileDto {
	private String link_id;
	private String user_id;
	private String file_id;
	private Timestamp create_at;
	private Boolean is_using;
}
