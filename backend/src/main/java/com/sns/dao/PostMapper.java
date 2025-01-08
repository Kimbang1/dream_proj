package com.sns.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.PostDto;

@Mapper
public interface PostMapper {
	
	// 게시글 저장
	public int savePost(PostDto postDto);
	
	// 특정 게시글 불러오기
	public PostDto selectAllPost(@Param("post_id")String post_id);
}
