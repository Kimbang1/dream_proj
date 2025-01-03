package com.sns.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface FilePostMapper {
	
	public int saveFileId(@Param("link_id")String link_id, @Param("file_id") String file_id);
	
	public int addPostId(@Param("link_id")String link_id, @Param("post_id")String post_id);
}
