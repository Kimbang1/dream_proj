package com.sns.dao;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.RefreshTokenListDto;

@Mapper
public interface RefreshTokenMapper {
	
	// 새 Refresh Token 저장
	public void saveRefreshToken(
			@Param("uuid") String uuid,
			@Param("reToken") String reToken,
			@Param("createAt") Timestamp createAt,
			@Param("expiresIn") Timestamp expiresIn,
			@Param("userAgent") String userAgent
			);
	
	// 특정 사용자의 모든 Refresh Token 조회 (여러 디바이스에서 발급된 토큰 포함)
	public List<RefreshTokenListDto> findByUserId(@Param("uuid") String uuid);
	
	// 특정 사용자의 특정 Refresh Token 조회
	public RefreshTokenListDto findByRefreshToken(@Param("reToken") String refreshToken);
	
	// 특정 사용자의 모든 토큰 삭제 (로그아웃)
	public int deleteAllByUserId(@Param("uuid") String uuid);
	
	// 특정 사용자의 특정 디바이스의 Refresh Token 삭제
	public int deleteByRefreshToken(@Param("reToken") String reToken);
}
