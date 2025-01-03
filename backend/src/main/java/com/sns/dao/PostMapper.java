package com.sns.dao;

import org.apache.ibatis.annotations.Mapper;

import com.sns.dto.PostDto;

@Mapper
public interface PostMapper {
	
	public int savePost(PostDto postDto);
}
