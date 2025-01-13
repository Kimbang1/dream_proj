package com.sns.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class ViewListDto {
	private int num;
	private String user_id;
	private String post_id;
	private Timestamp create_at;
	private int quarter;
}
