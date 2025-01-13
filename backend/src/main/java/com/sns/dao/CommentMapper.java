package com.sns.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.CommentDto;

@Mapper
public interface CommentMapper {
	
	// 댓글 등록
	public int mtdInsertComment(CommentDto commentDto);
	
}
