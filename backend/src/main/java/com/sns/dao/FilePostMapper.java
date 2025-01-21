package com.sns.dao;

import java.sql.Timestamp;
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
	
	// 모든 게시글 리스트 확인(file_post)
	public List<FilePostDto> selectAllList();
	
	// 특정 게시물 하나의 FilePost 데이터 반환
	public FilePostDto selectOne(@Param("link_id") String linkId);
	
	// 모든 게시물의 상세 정보 목록 반환
	public List<JoinFilePostDto> selectAllPost();
	
	// 업로드 한 지 2시간 전까지의 게시물 상세 정보 목록 반환
	public List<JoinFilePostDto> selectTimePostList();
	
	// 특정 게시물 상세 정보 반환
	public JoinFilePostDto selectOnePost(@Param("link_id") String linkId);
	
	// 특정 사용자의 게시글 목록 갯수 반환
	public int selectUserUpCount(@Param("uuid") String uuid);
	
	// 특정 사용자의 게시글 목록 반환
	public List<JoinFilePostDto> selectChoiceList(@Param("uuid") String uuid);
	
	// 특정 단어가 들어간 게시글 목록 반환
	public List<JoinFilePostDto> selectSearchList(@Param("keyword") String keyword);
	
	// 게시글 비활성화
	public int mtdUsingStatusFalse(@Param("link_id") String linkId);
	
	// 게시글 활성화
	public int mtdUsingStatusTrue(@Param("link_id") String linkId);
}
