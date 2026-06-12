package com.resolve.backend.service;

import com.resolve.backend.domain.user.User;
import com.resolve.backend.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    // 회원 조회
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다. ID=" + userId));
    }
    
    // TODO: 소셜 로그인 회원가입/로그인 처리 로직 추가 예정
}
