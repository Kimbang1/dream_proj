package com.sns.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class CommentDto {
	private String comment_id;
	private String user_id;
	private String user_tag_id;
	private String parent_post;
	private String content;
	private Timestamp create_at;
	private Boolean is_using;
	private Timestamp update_at;
	private Boolean is_update;
	private Timestamp delete_at;
	private Boolean is_delete;
}
