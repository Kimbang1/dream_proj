package com.sns.dao;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.UserDto;

@Mapper
public interface UserDao {
	public int mtdInsert(UserDto userDto);
	
	public Optional<UserDto> mtdFindByEmail(@Param("email") String email);
	
}
