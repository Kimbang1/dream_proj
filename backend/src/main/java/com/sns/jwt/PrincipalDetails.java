package com.sns.jwt;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.sns.dto.UserDto;

import lombok.Data;

@Data
public class PrincipalDetails implements UserDetails {
	private UserDto userDto;
	
	// UserDto를 받도록 생성자 수정
	public PrincipalDetails(UserDto userDto) {
		this.userDto = userDto;
	}
	
	@Override
	// UserDto에서 비밀번호 가져오기
	public String getPassword() {
		return userDto.getPwd();
	}
	
	@Override
	// UserDto에서 사용자명 가져오기
	public String getUsername() {
		return userDto.getUsername();
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> authorities = new ArrayList<>();
		
		// is_admin 값이 true면 관리자 권한 부여, false면 사용자 권한 부여
//		if (userDto.getIs_admin() != null && userDto.getIs_admin()) {
		if (Boolean.TRUE.equals(userDto.getIs_admin())) {
			authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
		} else {
			authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
		}
		return authorities;
	}
	
	@Override
	// 계정 만료 여부, 기본적으로 true로 설정
    public boolean isAccountNonExpired() {
        return true;  
    }

    @Override
    // 계정 잠금 여부, 기본적으로 true로 설정
    public boolean isAccountNonLocked() {
        return true;  
    }

    @Override
    // 패스워드 만료 여부, 기본적으로 true로 설정
    public boolean isCredentialsNonExpired() {
        return true;  
    }

    @Override
    // 계정 사용 가능 여부, 기본적으로 true로 설정
    public boolean isEnabled() {
//        return userDto.getIs_using() != null && userDto.getIs_using(); 
    	return Boolean.TRUE.equals(userDto.getIs_using());
    }
    
    
    // 추가적인 getter 메소드
    public String getEmail() {
        return userDto.getEmail();  // 이메일 가져오기
    }

    public String getUserId() {
        return userDto.getUuid();  // 사용자 ID 가져오기
    }
    
    public String getTagId() {
    	return userDto.getTag_id();  // 사용자 tag ID 가져오기
    }
}
