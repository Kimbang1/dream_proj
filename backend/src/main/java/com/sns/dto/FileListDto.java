package com.sns.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class FileListDto {
	private String fileId;
	private String oriFilename;
	private String upFilename;
	private String fileUrl;
	private Timestamp insert_at;
	private boolean isUsing;
	private String extension;
	private Timestamp captured_at;
	private double latitude;
	private double longitude;
}
