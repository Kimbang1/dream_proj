package com.sns.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.ViewListDto;

@Mapper
public interface ViewListMapper {
	
	// 조회 기록
	public int mtdInsert(ViewListDto viewListDto);
	
	// 조회 기록 찾기
	public List<ViewListDto> mtdSelectSearch(@Param("user_id") String user_id, @Param("post_id") String post_id);
}
