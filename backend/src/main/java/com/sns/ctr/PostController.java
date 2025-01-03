package com.sns.ctr;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sns.dao.FileListMapper;
import com.sns.dao.FilePostMapper;
import com.sns.dao.PostMapper;
import com.sns.dao.UserDao;
import com.sns.dto.FileListDto;
import com.sns.dto.PostDto;
import com.sns.dto.UserDto;
import com.sns.jwt.JwtProvider;
import com.sns.svc.FileService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/post")
@Slf4j
@RequiredArgsConstructor
public class PostController {
	
	private final FileService fileService;
	private final FileListMapper fileListMapper;
	private final JwtProvider jwtProvider;
	private final UserDao userDao;
	private final FilePostMapper filePostMapper;
	private final PostMapper postMapper;
	
	@PostMapping("/fileUpload")
	public ResponseEntity<HashMap<String, String>> mtdFileUpload(
			@RequestParam("file") MultipartFile file,
			@RequestParam("latitude") String latitude,
			@RequestParam("longitude") String longitude,
			@RequestParam("captured_at") String captured_at,
			HttpServletRequest request
			) {
		// 파일 이름과 MIME 타입 확인
        String originalFileName = file.getOriginalFilename();
        String mimeType = file.getContentType();
        System.out.println("original file name: " + originalFileName);
        System.out.println("mimeType: " + mimeType);

        System.out.println("captured_at: " + captured_at);
        
        Timestamp timestamp = Timestamp.from(Instant.parse(captured_at));
        System.out.println("timestamp: " + timestamp);
        
        HashMap<String, String> responseBody = new HashMap<>();
        
        // AccessToken 추출
        String accessToken = null;
 		Cookie[] cookies = request.getCookies();
 		if (cookies != null) {
 			for (Cookie cookie : cookies) {
 				if ("accessToken".equals(cookie.getName())) {
 					accessToken = cookie.getValue();
 					break;
 				}
 			}
 		}
 		
 		if (accessToken == null) {
 		    log.error("Access token이 존재하지 않습니다.");
 		    responseBody.put("message", "로그인이 필요합니다.");
 		    return new ResponseEntity<>(responseBody, HttpStatus.UNAUTHORIZED);
 		}
 		
 		// AccessToken에서 사용자 정보 추출
 		String email = jwtProvider.getEmailFromToken(accessToken);
 		String provider = jwtProvider.getProviderFromToken(accessToken);
 		UserDto user = userDao.mtdFindByEmailAndProvider(email, provider);

        // 파일이 정상적으로 업로드되었는지 확인
        if (file.isEmpty()) {
            responseBody.put("message", "파일이 비어 있습니다.");
            return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST); // 400 Bad Request 반환
        }
        
        Double doubleLong = 0.0;
        Double doubleLati = 0.0;
        if (longitude != null && !longitude.equals("null")) {
        	doubleLong = Double.valueOf(longitude);
        } else {
            // 적절한 기본값을 할당하거나, 예외를 처리하세요
        	doubleLong = 0.0; // 기본값 0.0으로 처리
        }
        if (latitude != null && !latitude.equals("null")) {
        	doubleLati = Double.valueOf(latitude);
        } else {
        	// 적절한 기본값을 할당하거나, 예외를 처리하세요
        	doubleLati = 0.0; // 기본값 0.0으로 처리
        }

        try {
        	// 1. 파일 로컬에 저장
        	
            String filePath = fileService.saveFile(file);
            
            // 2. DB에 파일 정보 저장
            FileListDto fileListDto = new FileListDto();
            String file_id = UUID.randomUUID().toString();
            fileListDto.setFile_id(file_id);
            fileListDto.setOri_filename(originalFileName);
            fileListDto.setUp_filename(filePath.substring(filePath.lastIndexOf("\\") + 1));
            fileListDto.setFile_path(filePath);
            fileListDto.setExtension(originalFileName.substring(originalFileName.lastIndexOf(".")));
            fileListDto.setLatitude(doubleLati);
            fileListDto.setLongitude(doubleLong);
            fileListDto.setCaptured_at(timestamp);
            
            log.info("file_id: " + fileListDto.getFile_id());
            log.info("ori_filename" + fileListDto.getOri_filename());
            log.info("up_filename" + fileListDto.getUp_filename());
            log.info("file_path" + fileListDto.getFile_path());
            log.info("extension: " + fileListDto.getExtension());
            log.info("latitude: " + fileListDto.getLatitude());
            log.info("logitude: " + fileListDto.getLongitude());
            log.info("captured_at: " + fileListDto.getCaptured_at());
            
            
            fileListMapper.saveFileData(fileListDto);
            
            // file_post 테이블 저장
            String link_id = UUID.randomUUID().toString();
            filePostMapper.saveFileId(link_id, file_id);
            
            // 파일 업로드 성공 메시지 반환
            HashMap<String, String> response = new HashMap<>();
            response.put("link_id", link_id);
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
	
	@PostMapping("/postUpload")
	public ResponseEntity<HashMap<String, String>> mtdPostUpload(@RequestBody HashMap<String, String> requestData, HttpServletRequest request) {
		HashMap<String, String> responseBody = new HashMap<>();
		String linkId = requestData.get("link_id");
		String content = requestData.get("content");
		
		System.out.println("link_id: " + linkId);
		System.out.println("content: " + content);
		
		String accessToken = null;
		
		// AccessToken 추출
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if ("accessToken".equals(cookie.getName())) {
					accessToken = cookie.getValue();
					break;
				}
			}
		}
		
		if (accessToken == null) {
		    log.error("Access token이 존재하지 않습니다.");
		    responseBody.put("message", "로그인이 필요합니다.");
		    return new ResponseEntity<>(responseBody, HttpStatus.UNAUTHORIZED);
		}
		
		// AccessToken에서 사용자 정보 추출
		String email = jwtProvider.getEmailFromToken(accessToken);
		String provider = jwtProvider.getProviderFromToken(accessToken);
		UserDto user = userDao.mtdFindByEmailAndProvider(email, provider);
		
		PostDto postDto = new PostDto();
		String post_id = UUID.randomUUID().toString();
		postDto.setPost_id(post_id);
		postDto.setWrite_user(user.getUuid());
		postDto.setContent(content);
		postMapper.savePost(postDto);
		
		filePostMapper.addPostId(linkId, post_id);
		
		return null;
	}
	
	
	
}
