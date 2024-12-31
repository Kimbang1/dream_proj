package com.sns.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class FilePostDto {
	private String linkId;
	private String fileId;
	private String postId;
	private Timestamp createAt;
	private boolean isUsing;
}
