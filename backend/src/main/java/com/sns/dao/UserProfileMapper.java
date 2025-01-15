package com.sns.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.UserProfileDto;

@Mapper
public interface UserProfileMapper {
	// 파일 id, user id 저장
	public int mtdInsert(UserProfileDto userProfileDto);
	
	// 프로필 사용 활성화 하기
	public int mtdUsingStatusTrue(@Param("link_id")String linkId);
	
	// 프로필 사용 비활성화 하기
	public int mtdUsingStatusFalse(@Param("user_id")String userId);
	
	// 프로필 파일 id 조회하기
	public String mtdSelectFileId(@Param("user_id")String userId);
}
