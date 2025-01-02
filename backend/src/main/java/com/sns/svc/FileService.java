package com.sns.svc;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import io.jsonwebtoken.io.IOException;

@Service
public class FileService {
	
	// 로컬 저장 경로 설정
	@Value("${file.upload-dir}")
	private String uploadDir;
	
	public String saveFile(MultipartFile file) throws IOException {
		// 파일 이름과 저장 경로
		String oriFileName = file.getOriginalFilename();
		String upFileName = System.currentTimeMillis() + "_" + oriFileName;
		
		Path path = Paths.get(uploadDir + File.separator + upFileName);
		
		// 파일 저장
		try {
			file.transferTo(path.toFile());
		} catch (IllegalStateException e) {
			System.out.println("FileService, ISE: " + e.getMessage());
		} catch (java.io.IOException e) {
			System.out.println("FileServie, IOE: " + e.getMessage());
		}
		
		// 저장된 파일 경로 반환
		return path.toString();
	}
	
}
