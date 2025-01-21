package com.sns.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class UserBlockListDto {
	private String block_id;
	private String block_user;
	private String manager;
	private String manager_id;
	private String reason;
	private int duration;
	private Timestamp create_at;
}
