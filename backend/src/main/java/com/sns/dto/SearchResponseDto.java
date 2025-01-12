package com.sns.dto;

import java.util.List;

import lombok.Data;

@Data
public class SearchResponseDto {
	private List<UserDto> userList;
	private List<JoinFilePostDto> filePostList;
}
