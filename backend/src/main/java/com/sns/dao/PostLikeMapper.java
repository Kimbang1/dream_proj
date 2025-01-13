package com.sns.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.PostLikeDto;

@Mapper
public interface PostLikeMapper {
	// 좋아요 생성
	public int mtdInsert(@Param("user_id")String user_id, @Param("post_id")String post_id);

	// 좋아요 삭제
	public int mtdDelete(@Param("user_id")String user_id, @Param("post_id")String post_id);
	
	// 특정 게시물에 좋아요 눌렀는지
	public int mtdIsLike(@Param("user_id")String user_id, @Param("post_id")String post_id);
	
	// 내가 좋아요 누른 게시물 목록
	public List<PostLikeDto> mtdPostLikeList(@Param("user_id")String user_id);
	
	// 특정 게시물에 좋아요 누른 사람 목록
	public List<PostLikeDto> mtdUserLikeList(@Param("post_id")String post_id);
}
