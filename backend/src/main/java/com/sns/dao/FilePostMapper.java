package com.sns.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.FilePostDto;
import com.sns.dto.JoinFilePostDto;

@Mapper
public interface FilePostMapper {
	// 파일 id 저장
	public int saveFileId(@Param("link_id")String link_id, @Param("file_id") String file_id);
	
	// post id 저장
	public int addPostId(@Param("link_id")String link_id, @Param("post_id")String post_id);
	
	// 모든 게시글 리스트 확인
	public List<FilePostDto> selectAllList();
	
	// link_id로 게시글 검색
	public FilePostDto selectOne(@Param("link_id") String linkId);
	
	// 모든 게시물의 상세 정보 목록 반환
	public List<JoinFilePostDto> selectAllPost();
	
	// link_id로 게시글 검색, Join해서 file_list, post 정보 함께 가져오기
	public JoinFilePostDto selectOnePost(@Param("link_id") String linkId);
	
	// uuid로 게시글 검색, Join해서 file_list, post 정보 함께 가져오기
	public List<JoinFilePostDto> selectChoiceList(@Param("uuid") String uuid);
	
	// content 내용으로 게시글 검색, Join해서 file_list, post 정보 함께 가져오기
	public List<JoinFilePostDto> selectSearchList(@Param("keyword") String keyword);
}
