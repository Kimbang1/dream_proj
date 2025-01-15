package com.sns.dao;

import org.apache.ibatis.annotations.Mapper;

import com.sns.dto.UserBlockListDto;

@Mapper
public interface UserBlockListMapper {
	
	// 회원 정지 처리
	public int mtdUserBlock(UserBlockListDto userBlockListDto);
	
}
