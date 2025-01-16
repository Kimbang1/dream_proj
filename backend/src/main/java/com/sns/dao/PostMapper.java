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
	public PostDto selectPost(@Param("post_id")String post_id);
	
	// 게시글 조회 수 올리기
	public int addViewCnt(@Param("post_id")String post_id);
	
	// 게시글 비활성화
	public int mtdUsingStatusFalse(@Param("post_id") String postId);
		
	// 게시글 활성화
	public int mtdUsingStatusTrue(@Param("post_id") String postId);
}
