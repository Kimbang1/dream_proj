package com.sns.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class PostDto {
	private String postId;
	private String writeUser;
	private String content;
	private Timestamp createAt;
	private boolean isUsing;
	private Timestamp updateAt;
	private boolean isUpdate;
	private Timestamp deleteAt;
	private boolean isDelete;
	private int viewCnt;
	private String introduce;
	private String profile_path;
}
