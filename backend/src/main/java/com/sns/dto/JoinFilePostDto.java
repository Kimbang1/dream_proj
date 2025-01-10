package com.sns.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class JoinFilePostDto {
	
	private String post_id;
    private String write_user;
    private String content;
    private LocalDateTime create_at;
    private String file_id;
    private String fileName;
    private String fileUrl;
	
}
