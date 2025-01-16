package com.sns.dao;

import org.apache.ibatis.annotations.Mapper;

import com.sns.dto.ContentDelListDto;

@Mapper
public interface ContentDelListMapper {
	public int mtdContentDel(ContentDelListDto contentDelListDto);
}
