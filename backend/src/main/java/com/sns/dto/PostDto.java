package com.sns.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class PostDto {
	private String post_id;
	private String write_user;
	private String content;
	private Timestamp create_at;
	private boolean is_using;
	private Timestamp update_at;
	private boolean is_update;
	private Timestamp delete_at;
	private boolean is_delete;
	private int view_cnt;
}
