package com.sns.dao;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.UserDto;

@Mapper
public interface UserDao {
	public int mtdInsert(UserDto userDto);
	
	public UserDto mtdFindByUuid(@Param("uuid") String uuid);
	
	public UserDto mtdFindByEmailAndProvider(@Param("email") String email, @Param("provider") String provider);
	
}
