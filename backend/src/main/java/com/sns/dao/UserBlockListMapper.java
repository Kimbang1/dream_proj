package com.sns.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.UserBlockListDto;

@Mapper
public interface UserBlockListMapper {
	
	// 회원 정지 처리
	public int mtdUserBlock(UserBlockListDto userBlockListDto);
	
	// 회원 정지 내역 조회
	public UserBlockListDto mtdSearchUser(@Param("block_user")String blockUser);
}
