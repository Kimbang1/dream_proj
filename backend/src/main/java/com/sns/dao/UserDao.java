package com.sns.dao;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.UserDto;

@Mapper
public interface UserDao {
	// 회원가입 처리
	public int mtdInsert(UserDto userDto);
	
	// uuid로 회원 찾기
	public UserDto mtdFindByUuid(@Param("uuid") String uuid);
	
	// email과 provider로 회원 찾기
	public UserDto mtdFindByEmailAndProvider(@Param("email") String email, @Param("provider") String provider);
	
}
