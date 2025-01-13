package com.sns.ctr;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sns.dao.CommentMapper;
import com.sns.dao.FileListMapper;
import com.sns.dao.FilePostMapper;
import com.sns.dao.PostMapper;
import com.sns.dao.UserDao;
import com.sns.dto.CommentDto;
import com.sns.dto.FilePostDto;
import com.sns.dto.JoinFilePostDto;
import com.sns.dto.UserDto;
import com.sns.jwt.JwtProvider;
import com.sns.svc.FileService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/comment")
@Slf4j
@RequiredArgsConstructor
public class CommentController {
	
	private final JwtProvider jwtProvider;
	private final UserDao userDao;
	private final CommentMapper commentMapper;
	private final FilePostMapper filePostMapper;
	
	@RequestMapping("/list")
	public ResponseEntity<?> mtdCommentList(@RequestParam("linkId") String linkId) {
		log.info("/comment/list 까지 왔어");
		
		FilePostDto filePostDto = filePostMapper.selectOne(linkId);
		List<CommentDto> commentList = commentMapper.mtdSelectCommentOfPost(filePostDto.getPost_id());
		
		return ResponseEntity.ok(commentList);
	}
	
	@RequestMapping("/write")
	public ResponseEntity<?> mtdCommentWrite(@RequestBody HashMap<String, String> requestData, HttpServletRequest request) {
		log.info("/comment/write 까지 왔어");
		
		HashMap<String, Object> responseBody = new HashMap<>();
	    String linkId = requestData.get("linkId");
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
		
		CommentDto commentDto = new CommentDto();
		String comment_id = UUID.randomUUID().toString();
		commentDto.setComment_id(comment_id);
		commentDto.setUser_id(user.getUuid());
		commentDto.setUser_tag_id(user.getTag_id());
		commentDto.setContent(content);
		commentDto.setParent_post(filePostMapper.selectOnePost(linkId).getPost_id());
		
		commentMapper.mtdInsertComment(commentDto);
		
		responseBody.put("message", "댓글작성이 완료되었습니다.");
		responseBody.put("comment", commentDto);
		return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
	}
	
}
