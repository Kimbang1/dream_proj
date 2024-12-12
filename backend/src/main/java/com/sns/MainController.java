package com.sns;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {
	
	@GetMapping("/test")
	public List<String> hello() {
		List<String> test = new ArrayList<String>();
		test.add("seoul");
		test.add("incheon");
		test.add("bucheon");
		test.add("gumcheongucheong");
		return test;
	}
	
	@GetMapping("/tester")
	public String test() {
		return "plz...";
	}
	
}
