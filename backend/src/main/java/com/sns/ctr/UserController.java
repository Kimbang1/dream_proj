package com.sns.ctr;

import java.io.IOException;
import java.util.HashMap;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sns.dao.FileListMapper;
import com.sns.dao.UserMapper;
import com.sns.dao.UserProfileMapper;
import com.sns.dto.FileListDto;
import com.sns.dto.UserDto;
import com.sns.dto.UserProfileDto;
import com.sns.jwt.JwtProvider;
import com.sns.svc.FileService;
import com.sns.svc.TakeOutATokenService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@Slf4j
public class UserController {
	
	private final UserMapper userMapper;
	private final JwtProvider jwtProvider;
	private final FileService fileService;
	private final FileListMapper fileListMapper;
	private final TakeOutATokenService takeOutATokenService;
	private final UserProfileMapper userProfileMapper;
	
	@GetMapping("/info")
	public ResponseEntity<?> mtdUserInfo(HttpServletRequest request) {
		
		HashMap<String, Object> responseBody = new HashMap<>();
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
		UserDto user = userMapper.mtdFindByEmailAndProvider(email, provider);
		
		FileListDto fileListDto = fileListMapper.selectFileData(userProfileMapper.mtdSelectFileId(user.getUuid()));
		
		responseBody.put("user", user);
		responseBody.put("profile_image", fileListDto.getUp_filename());
		
		return ResponseEntity.ok(responseBody);
	}
	
	@RequestMapping("/resign")
	public ResponseEntity<?> userResign(HttpServletRequest request) {
		log.info("/user/resign 도착");
		HashMap<String, String> responseBody = new HashMap<>();
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
		UserDto user = userMapper.mtdFindByEmailAndProvider(email, provider);
		
		userMapper.mtdUserResign(user.getUuid());
		
		log.info("탈퇴가 완료되었습니다.");
		responseBody.put("message", "탈퇴가 완료되었습니다.");
	    return new ResponseEntity<>(responseBody, HttpStatus.OK);
	}
	
	@RequestMapping("/profileUpdate")
	public ResponseEntity<?> mtdProfileUpdate(@RequestParam("profile_image") MultipartFile file, HttpServletRequest request) {
		String originalFileName = file.getOriginalFilename();
        String mimeType = file.getContentType();
        String linkId = null;
        System.out.println("original file name: " + originalFileName);
        System.out.println("mimeType: " + mimeType);
        
        HashMap<String, Object> responseBody = takeOutATokenService.takeOutAToken(request);
        UserDto userDto = (UserDto)responseBody.get("data");
        if (userDto == null) {
        	
        }
        responseBody.remove("data");
        
        try {
        	String filePath = fileService.saveFile(file, "profile");
        	FileListDto fileListDto = new FileListDto();
        	String file_id = UUID.randomUUID().toString();
        	
        	fileListDto.setFile_id(file_id);
        	fileListDto.setOri_filename(originalFileName);
        	fileListDto.setUp_filename(filePath.substring(filePath.lastIndexOf("\\")+1));
        	fileListDto.setFile_path(filePath);
        	fileListDto.setExtension(originalFileName.substring(originalFileName.lastIndexOf(".")));
        	fileListMapper.saveFileData(fileListDto);
        	
        	linkId = UUID.randomUUID().toString();
        	UserProfileDto userProfileDto = new UserProfileDto();
        	userProfileDto.setLink_id(linkId);
        	userProfileDto.setUser_id(userDto.getUuid());
        	userProfileDto.setFile_id(fileListDto.getFile_id());
        	
        	userProfileMapper.mtdInsert(userProfileDto);
        	
        	responseBody.put("linkId", linkId);
        	responseBody.put("message", "프로필 이미지가 성공적으로 업로드 되었습니다.");
        	responseBody.put("fileName", originalFileName);
        	responseBody.put("filePath", filePath);
            return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
        } catch (IOException e) {
        	responseBody.put("message", "프로필 이미지 업로드 중 오류가 발생했습니다.");
        	log.error("프로필 이미지 업로드 중 오류 발생: ", e);
        	return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }
	}
	
	@PutMapping("/update")
	public ResponseEntity<?> updateUserProfile(@RequestBody HashMap<String, String> requestBody, HttpServletRequest request) {
		log.info("tag_id: {}", requestBody.get("tag_id"));
		log.info("username: {}", requestBody.get("username"));
		log.info("link_id: {}", requestBody.get("link_id"));
		
		HashMap<String, Object> responseBody = takeOutATokenService.takeOutAToken(request);
		
		UserDto user = (UserDto) responseBody.get("data");
		
		
		if (user == null) {
			log.error("Access token이 존재하지 않습니다.");
		    responseBody.put("message", "로그인이 필요합니다.");
		    return new ResponseEntity<>(responseBody, HttpStatus.UNAUTHORIZED);
		}
		
		String tagId = requestBody.get("tag_id");
		
		// tag_id 중복 검사
		if(tagId != null && !(user.getTag_id().equals(tagId))) {
			boolean tagIdChk = userMapper.mtdTagIdCheck(tagId);
			if(tagIdChk) {
				log.info("이미 존재하는 tagid입니다.");
				responseBody.put("message", "이미 존재하는 tagid입니다.");
				return new ResponseEntity<>(responseBody, HttpStatus.UNAUTHORIZED);
			} else {
				log.info("변경 가능한 tagid입니다.");
			}
		}
		
		// UserDto 업데이트
		UserDto updatedUserDto = UserDto.builder()
				.uuid(user.getUuid())
				.tag_id(requestBody.get("tag_id"))
				.username(requestBody.get("username"))
				.phone(requestBody.get("phone"))
				.introduce(requestBody.get("introduce"))
				.build();
		
		// DB 업데이트 처리
		int userRes = userMapper.mtdUpdateUser(updatedUserDto);
		if(requestBody.get("link_id") != null) {
			userProfileMapper.mtdUsingStatusFalse(user.getUuid());
			userProfileMapper.mtdUsingStatusTrue(requestBody.get("link_id"));
		}
		if (userRes == 1) {
			log.info("변경이 완료되었습니다.");
			responseBody.put("message", "변경이 완료되었습니다.");
		    return new ResponseEntity<>(responseBody, HttpStatus.OK);
		} else {
			log.error("업데이트 실패");
		    responseBody.put("message", "업데이트에 실패했습니다.");
		    return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
		
	
}
