package com.sns;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sns.dao.SNSDao;
import com.sns.dto.SNSDto;

@RestController
public class MainController {
	
	@Autowired
	SNSDao snsDao;
	
	@GetMapping("/test")
	public List<String> hello() {
		List<String> test = new ArrayList<String>();
		test.add("seoul");
		test.add("incheon");
		test.add("bucheon");
		test.add("gumcheongucheong");
		return test;
	}
	
	@RequestMapping("/linkchk")
	public ResponseEntity<Map<String, String>> test(SNSDto snsDto) {
		System.out.println("username" + snsDto.getUsername());
		System.out.println("age" + snsDto.getAge());
		System.out.println("dazim" + snsDto.getDazim());
		snsDao.mtdInsert(snsDto);
		Map<String, String> response = new HashMap<>();
		response.put("redirectUrl", "/res");
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/select")
	public List<SNSDto> select() {
		List<SNSDto> list = snsDao.mtdSelect();
		return list;
	}
	
}
