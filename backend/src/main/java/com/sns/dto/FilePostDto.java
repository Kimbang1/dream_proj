package com.sns.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class FilePostDto {
	private String link_id;
	private String file_id;
	private String post_id;
	private Timestamp create_at;
	private boolean is_using;
}
