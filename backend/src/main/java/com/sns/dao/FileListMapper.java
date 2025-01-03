package com.sns.dao;

import org.apache.ibatis.annotations.Mapper;

import com.sns.dto.FileListDto;

@Mapper
public interface FileListMapper {
	
	// 업로드 할 파일 정보 저장
	public int saveFileData(FileListDto fileListDto);
	
	
}
