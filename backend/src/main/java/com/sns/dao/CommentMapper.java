package com.sns.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.CommentDto;

@Mapper
public interface CommentMapper {
	
	// 댓글 등록
	public int mtdInsertComment(CommentDto commentDto);
	
	// 댓글 목록
	public List<CommentDto> mtdSelectCommentOfPost(@Param("post_id") String post_id);
	
}
