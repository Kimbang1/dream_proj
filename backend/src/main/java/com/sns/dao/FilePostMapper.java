package com.sns.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.FilePostDto;
import com.sns.dto.JoinFilePostDto;

@Mapper
public interface FilePostMapper {
	
	public int saveFileId(@Param("link_id")String link_id, @Param("file_id") String file_id);
	
	public int addPostId(@Param("link_id")String link_id, @Param("post_id")String post_id);
	
	public List<FilePostDto> selectAllList();
	
	public List<JoinFilePostDto> selectChoiceList(@Param("uuid") String uuid);
}
