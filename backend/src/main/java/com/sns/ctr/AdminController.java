package com.sns.ctr;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sns.dao.ContentDelListMapper;
import com.sns.dao.FileListMapper;
import com.sns.dao.FilePostMapper;
import com.sns.dao.PostMapper;
import com.sns.dao.RefreshTokenMapper;
import com.sns.dao.UserBlockListMapper;
import com.sns.dao.UserDao;
import com.sns.dao.UserDelListMapper;
import com.sns.dto.ContentDelListDto;
import com.sns.dto.FilePostDto;
import com.sns.dto.JoinFilePostDto;
import com.sns.dto.UserBlockListDto;
import com.sns.dto.UserDelListDto;
import com.sns.dto.UserDetailDto;
import com.sns.dto.UserDto;
import com.sns.jwt.JwtProvider;
import com.sns.svc.TakeOutATokenService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {
	
	private final UserDao userDao;
	private final FilePostMapper filePostMapper;
	private final FileListMapper fileListMapper;
	private final PostMapper postMapper;
	private final JwtProvider jwtProvider;
	private final UserDelListMapper userDelListMapper;
	private final UserBlockListMapper userBlockListMapper;
	private final TakeOutATokenService takeOutATokenService;
	private final ContentDelListMapper contentDelListMapper;
	
	// 관리자 등록
	@RequestMapping("/regAdmin")
	public ResponseEntity<?> mtdRegAdmin() {
		HashMap<String, String> responseBody = new HashMap<>();
		String uuid = "";
		if(userDao.mtdRegAdmin(uuid) == 1) {
			responseBody.put("message", "관리자 등록이 완료되었습니다.");
			return ResponseEntity.ok(responseBody);
		} else {
			responseBody.put("message", "관리자 등록이 실패했습니다.");
			return new ResponseEntity(responseBody, HttpStatus.BAD_REQUEST);
		}
	}
	
	// 관리자 등록 해제
	@RequestMapping("/clearAdmin")
	public ResponseEntity<?> mtdClearAdmin() {
		HashMap<String, String> responseBody = new HashMap<>();
		String uuid = "";
		if(userDao.mtdClearAdmin(uuid) == 1) {
			responseBody.put("message", "관리자 해제가 완료되었습니다.");
			return ResponseEntity.ok(responseBody);
		} else {
			responseBody.put("message", "관리자 해제에 실패했습니다.");
			return new ResponseEntity(responseBody, HttpStatus.BAD_REQUEST);
		}
	}
	
	// 관리자용 회원 검색
	@RequestMapping("/userSearch")
	public ResponseEntity<?> mtdUserSearch(@RequestParam("query") String keyword) {
		List<UserDetailDto> userList = userDao.mtdSearchUser(keyword);
		return ResponseEntity.ok(userList);
	}
	
	// 관리자용 관리자 목록
	@RequestMapping("/adminList")
	public ResponseEntity<?> mtdAdminList() {
		List<UserDetailDto> adminList = userDao.mtdSelectAllAdmin();
		return ResponseEntity.ok(adminList);
	}
	
	// 관리자용 회원 목록
	@RequestMapping("/userList")
	public ResponseEntity<?> mtdUserList(HttpServletRequest request) {
		log.info("/admin/userList 도착");
		List<UserDetailDto> userList = userDao.mtdUserDetailList();
		HashMap<String, String> userData = new HashMap<>();
		
		HashMap<String, Object> responseBody = takeOutATokenService.takeOutAToken(request);
		UserDto user = (UserDto)responseBody.get("data");
		
		if(user == null) {
			return new ResponseEntity<>(responseBody, HttpStatus.UNAUTHORIZED);
		}
		  
		responseBody.put("managerTagId", user.getTag_id());
		responseBody.put("managerUuid", user.getUuid());
		responseBody.put("userList", userList);
		
		return ResponseEntity.ok(responseBody);
	}
	
	// 관리자용 게시글 목록
	@RequestMapping("/contentList")
	public ResponseEntity<?> mtdContentList(HttpServletRequest request) {
		List<JoinFilePostDto> joinFilePostList = filePostMapper.selectAllPost();
		
		HashMap<String, Object> responseBody = takeOutATokenService.takeOutAToken(request);
		UserDto user = (UserDto)responseBody.get("data");
		
		if(user == null) {
			return new ResponseEntity<>(responseBody, HttpStatus.UNAUTHORIZED);
		}
		
		responseBody.put("managerTagId", user.getTag_id());
		responseBody.put("managerUuid", user.getUuid());
		responseBody.put("contentList", joinFilePostList);
		responseBody.remove("data");
		
		return ResponseEntity.ok(responseBody);
	}
	
	// 회원 정지 / 탈퇴 처리
	@RequestMapping("/userProc")
	public ResponseEntity<?> mtdUserResign(@RequestBody HashMap<String, String> requestData) {
		Map<String, String> responseBody = new HashMap<>();
		
		String id = UUID.randomUUID().toString();
		String procType = requestData.get("procType");
		String managerTagId = requestData.get("managerTagId");
		String userId = requestData.get("userId");
		String reason = requestData.get("reason");
		String manager = requestData.get("manager");
		String managerId = requestData.get("managerUuid");
		
		if(procType.equals("block")) {
			UserBlockListDto userBlockListDto = new UserBlockListDto();
			userBlockListDto.setBlock_id(id);
			userBlockListDto.setBlock_user(userId);
			userBlockListDto.setManager(manager);
			userBlockListDto.setManager_id(managerId);
			userBlockListDto.setReason(reason);
			
			userDao.mtdUsingStatusFalse(userId);
			userBlockListMapper.mtdUserBlock(userBlockListDto);
			responseBody.put("message", "회원 정지 처리 완료");
		} else if(procType.equals("resign")) {
			UserDelListDto userDelListDto = new UserDelListDto();
			userDelListDto.setDel_id(id);
			userDelListDto.setDel_user(userId);
			userDelListDto.setManager(manager);
			userDelListDto.setManager_id(managerId);
			userDelListDto.setReason(reason);
			
			userDao.mtdUserResign(userId);
			userDelListMapper.mtdUserResign(userDelListDto);
			responseBody.put("message", "회원 탈퇴 처리 완료");
		} else {
			responseBody.put("message", "존재하지 않는 처리 타입입니다.");
			return new ResponseEntity<>(responseBody, HttpStatus.FORBIDDEN);
		}
		
		return ResponseEntity.ok(responseBody);
	}
	
	// 게시글 삭제 처리
	@RequestMapping("/contentDelete")
	public ResponseEntity<?> mtdContentDelete(@RequestBody HashMap<String, String> requestData){
		Map<String, String> responseBody = new HashMap<>();
		
		String managerTagId = requestData.get("managerTagId");
		String linkId = requestData.get("linkId");
		
		ContentDelListDto contentDelListDto = new ContentDelListDto();
		contentDelListDto.setDel_id(UUID.randomUUID().toString());
		contentDelListDto.setContent_id(linkId);
		contentDelListDto.setManager(requestData.get("manager"));
		contentDelListDto.setManager_id(requestData.get("managerUuid"));
		contentDelListDto.setReason(requestData.get("reason"));
		
		contentDelListMapper.mtdContentDel(contentDelListDto);
		
		FilePostDto filePostDto = filePostMapper.selectOne(linkId);
		filePostMapper.mtdUsingStatusFalse(linkId);
		fileListMapper.mtdUsingStatusFalse(filePostDto.getFile_id());
		postMapper.mtdUsingStatusFalse(filePostDto.getPost_id());
		
		responseBody.put("message", "게시글 삭제 처리 완료");
		
		return ResponseEntity.ok(responseBody);
	}
}
