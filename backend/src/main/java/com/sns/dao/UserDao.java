package com.sns.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.UserDto;

@Mapper
public interface UserDao {
	// 회원가입 처리
	public int mtdInsert(UserDto userDto);
	
	// 회원탈퇴 처리
	public int mtdUserResign(@Param("uuid")String uuid);
	
	// 소셜 회원가입 사용자 정보 추가
	public int mtdSocialJoin(UserDto userDto);
	
	// 전체 회원 목록 반환
	public List<UserDto> mtdSelectAllUser();
	
	// uuid로 회원 찾기
	public UserDto mtdFindByUuid(@Param("uuid") String uuid);
	
	// tag_id로 회원 찾기
	public UserDto mtdFindByTagId(@Param("tag_id") String tag_id);
	
	// email과 provider로 회원 찾기
	public UserDto mtdFindByEmailAndProvider(@Param("email") String email, @Param("provider") String provider);
	
	// 회원 정보 수정
	public int mtdUpdateUser(UserDto userDto);
	
	// tag_id 중복 확인
	public boolean mtdTagIdCheck(@Param("tag_id") String tag_id);
	
	// 회원 비활성화 처리
	public int mtdUsingStatusFalse(@Param("uuid") String uuid);
	
	// 회원 활성화 처리
	public int mtdUsingStatusTrue(@Param("uuid") String uuid);
	
	// 회원 활성화 상태
	public boolean mtdIsUsingUser(@Param("uuid") String uuid);
	
	// uuid로 tag_id 가져오기
	public String mtdSelectTagId(@Param("uuid") String uuid);
	
	// username, tag_id, introduce로 회원 찾기
	public List<UserDto> mtdSearchUser(@Param("keyword") String keyword);
	
}
