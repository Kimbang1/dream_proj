package com.sns.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class UserDelListDto {
	private String del_id;
	private String del_user;
	private String manager;
	private String manager_id;
	private String reason;
	private Timestamp create_at;
}
