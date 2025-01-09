package com.sns.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sns.dto.FileListDto;

@Mapper
public interface FileListMapper {
	
	// 업로드 할 파일 정보 저장
	public int saveFileData(FileListDto fileListDto);
	
	// 파일 아이디로 업로드 한 파일 정보 가져오기
	public FileListDto selectFileData(@Param("file_id") String fileId);
	
	
}
