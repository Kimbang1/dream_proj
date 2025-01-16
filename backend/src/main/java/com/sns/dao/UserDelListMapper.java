package com.sns.dao;

import org.apache.ibatis.annotations.Mapper;

import com.sns.dto.UserDelListDto;

@Mapper
public interface UserDelListMapper {
	
	// 회원 탈퇴 처리
	public int mtdUserResign(UserDelListDto userDelListDto);
}
