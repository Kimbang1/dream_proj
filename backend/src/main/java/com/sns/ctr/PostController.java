package com.sns.ctr;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sns.dao.FileListMapper;
import com.sns.dto.FileListDto;
import com.sns.svc.FileService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/post")
@Slf4j
@RequiredArgsConstructor
public class PostController {
	
	private final FileService fileService;
	private final FileListMapper fileListMapper;
	
	@PostMapping("/fileUpload")
	public ResponseEntity<HashMap<String, String>> mtdFilePost(
			@RequestParam("file") MultipartFile file,
			@RequestParam("latitude") String latitude,
			@RequestParam("longitude") String longitude,
			@RequestParam("content") String content,
			@RequestParam("time") String time
			) {
		// 파일 이름과 MIME 타입 확인
        String originalFileName = file.getOriginalFilename();
        String mimeType = file.getContentType();
        System.out.println("original file name: " + originalFileName);
        System.out.println("mimeType: " + mimeType);

        System.out.println("time: " + time);
        
        Timestamp timestamp = Timestamp.from(Instant.parse(time));
        System.out.println("timestamp: " + timestamp);

        // 파일이 정상적으로 업로드되었는지 확인
        if (file.isEmpty()) {
            HashMap<String, String> response = new HashMap<>();
            response.put("message", "파일이 비어 있습니다.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST); // 400 Bad Request 반환
        }

        try {
        	// 1. 파일 로컬에 저장
            String filePath = fileService.saveFile(file);
            
            // 2. DB에 파일 정보 저장
            FileListDto fileListDto = new FileListDto();
//            fileListMapper.저장메서드()
            
            // 파일 업로드 성공 메시지 반환
            HashMap<String, String> response = new HashMap<>();
            response.put("message", "파일이 성공적으로 업로드되었습니다.");
            response.put("fileName", originalFileName); // 업로드된 파일 이름 반환
            response.put("filePath", filePath);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            // 오류 처리
            HashMap<String, String> response = new HashMap<>();
            response.put("message", "파일 업로드 중 오류가 발생했습니다.");
            log.error("파일 업로드 중 오류 발생: ", e);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error 반환
        }
	}
	
	
	
}
