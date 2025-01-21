package com.sns.ctr;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.joda.time.DateTime;
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
import com.sns.dao.PostLikeMapper;
import com.sns.dao.PostMapper;
import com.sns.dao.UserMapper;
import com.sns.dao.ViewListMapper;
import com.sns.dto.FileListDto;
import com.sns.dto.FilePostDto;
import com.sns.dto.JoinFilePostDto;
import com.sns.dto.PostDto;
import com.sns.dto.PostLikeDto;
import com.sns.dto.SearchResponseDto;
import com.sns.dto.UserDetailDto;
import com.sns.dto.UserDto;
import com.sns.dto.ViewListDto;
import com.sns.jwt.JwtProvider;
import com.sns.svc.FileService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/contents")
@Slf4j
@RequiredArgsConstructor
public class ContentController {
   
   private final FileService fileService;
   private final FileListMapper fileListMapper;
   private final JwtProvider jwtProvider;
   private final UserMapper userMapper;
   private final FilePostMapper filePostMapper;
   private final PostMapper postMapper;
   private final ViewListMapper viewListMapper;
   private final PostLikeMapper postLikeMapper;
   
   // 검색 결과 반환
   @RequestMapping("/search")
   public ResponseEntity<?> mtdSearch(@RequestParam("query") String keyword) {
      log.info("/contents/search 도착");
      List<JoinFilePostDto> joinFilePostList = filePostMapper.selectSearchList(keyword);
      List<UserDetailDto> userList = userMapper.mtdSearchUser(keyword);
      
      SearchResponseDto responseDto = new SearchResponseDto();
      responseDto.setFilePostList(joinFilePostList);
      responseDto.setUserList(userList);
      
      return ResponseEntity.ok(responseDto);
   }
   
   // 위도, 경도 게시글 정보 반환
   @RequestMapping("/mapLongLati")
   public ResponseEntity<?> mtdMapLongLati() {
	   
	   List<JoinFilePostDto> joinFilePostList = filePostMapper.selectTimePostList();
	   
	   return ResponseEntity.ok(joinFilePostList);
   }
   
   // 게시글 좋아요 클릭 시 반영
   @RequestMapping("/like")
   public ResponseEntity<?> mtdLikeCheck(@RequestParam("linkId")String linkId, HttpServletRequest request) {
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
	   
	   System.out.println("linkId: " + linkId);
	   
	   FilePostDto filePostDto = filePostMapper.selectOne(linkId);
	   
	   int isLike = postLikeMapper.mtdIsLike(user.getUuid(), filePostDto.getPost_id());
	   
	   System.out.println("isLike: " + isLike);
	   
	   if (isLike > 0) {
		   postLikeMapper.mtdDelete(user.getUuid(), filePostDto.getPost_id());
		   responseBody.put("heartClicked", false);
		   responseBody.put("message", "좋아요가 삭제되었습니다.");
	   } else {
		   postLikeMapper.mtdInsert(user.getUuid(), filePostDto.getPost_id());
		   responseBody.put("heartClicked", true);
		   responseBody.put("message", "좋아요가 등록되었습니다.");
	   }
	   
	   return new ResponseEntity<>(responseBody, HttpStatus.OK);
   }
   
   // 게시글 상세 보기
   @RequestMapping("/viewDetails")
   public ResponseEntity<?> mtdViewDetails(@RequestParam("linkId") String linkId, HttpServletRequest request) {
	   log.info("/viewDetails 도착");
	   JoinFilePostDto joinFilePostDto = filePostMapper.selectOnePost(linkId);
	   
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
	   
	   // 조회수 로직 처리
	   List<ViewListDto> viewList = viewListMapper.mtdSelectSearch(user.getUuid(), joinFilePostDto.getPost_id());
	   ViewListDto viewListDto = new ViewListDto();
	   
	   // 현재 날짜의 월 가져오기
       int currentMonth = LocalDate.now().getMonthValue();

       // 월요일 기준으로 분기 계산 (1~3: 1, 4~6: 2, 7~9: 3, 10~12: 4)
       int quarter = (currentMonth - 1) / 3 + 1;
       
	   if(viewList == null || viewList.isEmpty()) {
		   viewListDto.setPost_id(joinFilePostDto.getPost_id());
		   viewListDto.setUser_id(user.getUuid());
		   viewListDto.setQuarter(quarter);
		   viewListMapper.mtdInsert(viewListDto);
		   postMapper.addViewCnt(joinFilePostDto.getPost_id());
	   } else {
		   LocalDateTime threeDaysAgo = LocalDateTime.now().minusDays(3);
		   for(ViewListDto viewListItems : viewList) {
			   LocalDateTime checkDay = viewListItems.getCreate_at().toLocalDateTime();
			   if(checkDay.isBefore(threeDaysAgo)) {
				   viewListDto.setPost_id(joinFilePostDto.getPost_id());
				   viewListDto.setUser_id(user.getUuid());
				   viewListDto.setQuarter(quarter);
				   viewListMapper.mtdInsert(viewListDto);
				   postMapper.addViewCnt(joinFilePostDto.getPost_id());
			   }
		   }
	   }
	   
	   // 좋아요 상태(likeCheck) 확인
	   Boolean likeCheck = (postLikeMapper.mtdIsLike(user.getUuid(), joinFilePostDto.getPost_id()) != 0);
	   
	   // 좋아요 개수 확인
	   List<PostLikeDto> likeList = postLikeMapper.mtdUserLikeList(joinFilePostDto.getPost_id());
	   
	   responseBody.put("postDetails", joinFilePostDto);
	   responseBody.put("likeCheck", likeCheck);
	   responseBody.put("likeCount", likeList.size());
	   
	   return ResponseEntity.ok(responseBody);
   }
   
   // 회원페이지에서 게시물 목록 보기
   @RequestMapping("/userView")
   public ResponseEntity<?> mtdUserGalleryView(HttpServletRequest request, @RequestParam("uuid") String uuid) {
	   log.info("/userView까지 왔어");
	   log.info("uuid의 값은: {}", uuid);
	   
	   HashMap<String, String> responseBody = new HashMap<>();
	  
	   UserDto user = userMapper.mtdFindByUuid(uuid);
	   
	   List<JoinFilePostDto> filePostList = filePostMapper.selectChoiceList(user.getUuid());
	   
	   List<Map<String, String>> responseList = new ArrayList<>();
	   
	   for (JoinFilePostDto joinFilePostDto : filePostList) {
		   Map<String, String> responseItem = new HashMap<>();
		   int likeCheck = postLikeMapper.mtdIsLike(user.getUuid(), joinFilePostDto.getPost_id());
		   responseItem.put("linkId", joinFilePostDto.getLink_id());
		   responseItem.put("postId", joinFilePostDto.getPost_id());
		   responseItem.put("content", joinFilePostDto.getContent());
		   responseItem.put("createAt", joinFilePostDto.getCreate_at().toString());
		   responseItem.put("fileId", joinFilePostDto.getFile_id());
		   responseItem.put("upFileName", joinFilePostDto.getUp_filename());
		   responseItem.put("filePath", joinFilePostDto.getFile_path());
		   responseItem.put("tagId", joinFilePostDto.getTag_id());
           responseItem.put("likeCheck", likeCheck == 1 ? "true" : "false");
		   
		   responseList.add(responseItem);
	   }
	   
	   return ResponseEntity.ok(responseList);
   }
   
   // MainView에서 갤러리 식으로 게시물 보기
   @RequestMapping("/galleryView")
   public ResponseEntity<List<Map<String, String>>> mtdGalleryView() {
      log.info("/galleryView까지는 왔어");
      // 1. FilePostDto 리스트 가져오기
      List<FilePostDto> filePostList = filePostMapper.selectAllList();
      
      // 2. 반환할 데이터 생성
      List<Map<String, String>> responseList = new ArrayList<>();
      
      for (FilePostDto filePost : filePostList) {
         // file_id로 FileListDto 가져오기
         FileListDto fileData = fileListMapper.selectFileData(filePost.getFile_id());
         
         if(fileData != null) {
            // file_path와 uuid를 조합 해 반환할 데이터 생성
            Map<String, String> responseItem = new HashMap<>();
            responseItem.put("linkId", filePost.getLink_id());
            responseItem.put("fileName", fileData.getUp_filename());
            responseItem.put("filePath", fileData.getFile_path());
            
            responseList.add(responseItem);
         }
      }
      return ResponseEntity.ok(responseList);
   }
   
   // MainView에서 post 식으로 게시물 보기
   @RequestMapping("/postView")
   public ResponseEntity<?> mtdPostView(HttpServletRequest request) {
      log.info("/postView까지는 왔어");
      
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
      
      // 1. filePost 목록 가져오기
      List<FilePostDto> filePostList = filePostMapper.selectAllList();
      
      // 2. 반환할 데이터 생성
      List<Map<String, Object>> responseList = new ArrayList<>();
      
      for (FilePostDto filePost : filePostList) {
         // post와 file 정보 가져오기
         FileListDto fileData = fileListMapper.selectFileData(filePost.getFile_id());
         PostDto postData = postMapper.selectPost(filePost.getPost_id());
         
         if(fileData != null && postData != null) {
            Map<String, Object> responseItem = new HashMap<>();
            responseItem.put("linkId", filePost.getLink_id());
            responseItem.put("uuid", postData.getWrite_user());
            responseItem.put("tagId", userMapper.mtdSelectTagId(postData.getWrite_user()));
            responseItem.put("filePath", fileData.getFile_path());
            responseItem.put("upFileName", fileData.getUp_filename());
            responseItem.put("content", postData.getContent());
            responseItem.put("createAt", postData.getCreate_at().toString());
            responseItem.put("likeCheck", postLikeMapper.mtdIsLike(user.getUuid(), postData.getPost_id()) != 0);
            
            responseList.add(responseItem);
         }
      }
      return ResponseEntity.ok(responseList);
   }
   
   // 파일 업로드
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
       UserDto user = userMapper.mtdFindByEmailAndProvider(email, provider);

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
           
            String filePath = fileService.saveFile(file, "content");
            
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
            log.info("ori_filename: " + fileListDto.getOri_filename());
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
   
   // 게시글 업로드
   @PostMapping("/postUpload")
   public ResponseEntity<HashMap<String, String>> mtdPostUpload(@RequestBody HashMap<String, String> requestData, HttpServletRequest request) {
      HashMap<String, String> responseBody = new HashMap<>();
      String linkId = requestData.get("link_id");
      String content = requestData.get("content").replace("\n", "<br>");
      
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
      UserDto user = userMapper.mtdFindByEmailAndProvider(email, provider);
      
      PostDto postDto = new PostDto();
      String post_id = UUID.randomUUID().toString();
      postDto.setPost_id(post_id);
      postDto.setWrite_user(user.getUuid());
      postDto.setContent(content);
      postMapper.savePost(postDto);
      
      FilePostDto filePostDto = filePostMapper.selectOne(linkId);
      
      fileListMapper.mtdUsingStatusTrue(filePostDto.getFile_id());
      filePostMapper.addPostId(linkId, post_id);
      
      responseBody.put("message", "게시글 작성이 완료되었습니다.");
      responseBody.put("uuid", user.getUuid());
      return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
   }
   
};
