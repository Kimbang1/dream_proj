package com.sns.dao;

import org.apache.ibatis.annotations.Mapper;

import com.sns.dto.UserDto;

@Mapper
public interface UserDao {
	public int mtdInsert(UserDto userDto);
	
}
