package com.sns.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LocalLoginDto {
	private String email;
	private String password;
}
