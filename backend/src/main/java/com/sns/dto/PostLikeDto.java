package com.sns.dto;

import lombok.Data;

@Data
public class PostLikeDto {
	private int num;
	private String user_id;
	private String post_id;
}
