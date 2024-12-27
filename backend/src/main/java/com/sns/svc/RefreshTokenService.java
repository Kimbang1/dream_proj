package com.sns.svc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sns.dao.RefreshTokenMapper;

@Service
public class RefreshTokenService {
	
	private final RefreshTokenMapper refreshTokenMapper;
	
	@Autowired
	public RefreshTokenService(RefreshTokenMapper refreshTokenMapper) {
		this.refreshTokenMapper = refreshTokenMapper;
	}
	
}
