package com.sns.ctr;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/post")
@Slf4j
public class PostController {
	
	@PostMapping("/upload")
	public ResponseEntity<HashMap<String, String>> mtdFilePost(@RequestParam("file") MultipartFile file, @RequestParam("content") String content) {
		// 파일 이름과 MIME 타입 확인
        String originalFileName = file.getOriginalFilename();
        String mimeType = file.getContentType();
        System.out.println("original file name: " + originalFileName);
        System.out.println("mimeType: " + mimeType);
        System.out.println("content: " + content);

        // 파일이 정상적으로 업로드되었는지 확인
        if (file.isEmpty()) {
            HashMap<String, String> response = new HashMap<>();
            response.put("message", "파일이 비어 있습니다.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST); // 400 Bad Request 반환
        }

        try {
            // 파일 처리 로직 (파일 저장, DB에 기록 등)
            // 예: 저장된 파일의 경로나 ID 반환
            HashMap<String, String> response = new HashMap<>();
            response.put("message", "파일이 성공적으로 업로드되었습니다.");
            response.put("fileName", originalFileName); // 예시: 업로드된 파일 이름 반환

            return new ResponseEntity<>(response, HttpStatus.CREATED); // 201 Created 반환
        } catch (Exception e) {
            // 오류 처리
            HashMap<String, String> response = new HashMap<>();
            response.put("message", "파일 업로드 중 오류가 발생했습니다.");
            log.error("파일 업로드 중 오류 발생: ", e);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error 반환
        }
	}
	
	
	
}
