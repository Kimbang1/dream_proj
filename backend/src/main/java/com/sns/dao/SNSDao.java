package com.sns.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sns.dto.SNSDto;

@Mapper
public interface SNSDao {
	
	public List<SNSDto> mtdSelect();
	
	public void mtdInsert(SNSDto dto);
	
}
