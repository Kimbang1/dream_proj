package com.sns.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class JoinFilePostDto {
	private String link_id;
	private String post_id;
    private String content;
    private LocalDateTime create_at;
    private String file_id;
    private String up_filename;
    private String file_path;
	private String tag_id;
	private String write_user;
	private double latitude;
	private double longitude;
}
