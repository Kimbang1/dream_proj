package com.sns.dto;

import java.sql.Date;
import java.sql.Timestamp;

import lombok.Data;

@Data
public class UserDto {
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
	private Timestamp update_at;
	private Boolean is_update;
	private Timestamp delete_at;
	private Boolean is_delete;
	private String pwd;
	private String social_key;
	private int suspended_cnt;
}
