package com.sns.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class FileListDto {
	private String file_id;
	private String ori_filename;
	private String up_filename;
	private String file_path;
	private Timestamp insert_at;
	private boolean is_using;
	private String extension;
	private Timestamp captured_at;
	private double latitude;
	private double longitude;
}
