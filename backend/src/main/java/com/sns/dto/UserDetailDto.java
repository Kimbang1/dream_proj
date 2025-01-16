package com.sns.dto;

import java.sql.Date;
import java.sql.Timestamp;

import lombok.Data;

@Data
public class UserDetailDto {
	private String uuid;
	private String username;
	private String tag_id;
	private String email;
	private String phone;
	private Date birthday;
	private Boolean is_admin;
	private String provider;
	private Timestamp create_at;
	private Boolean is_using;
	private Timestamp delete_at;
	private Boolean is_delete;
	private int suspended_cnt;
	private String introduce;
	private String file_id;
	private String up_filename;
}
