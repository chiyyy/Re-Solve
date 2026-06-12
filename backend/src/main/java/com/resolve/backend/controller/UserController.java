package com.resolve.backend.controller;

import com.resolve.backend.domain.user.User;
import com.resolve.backend.domain.user.UserRepository;
import com.resolve.backend.dto.user.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    // 내 정보 가져오기 (문지기를 통과한 유저만 호출 가능)
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getMyInfo(@AuthenticationPrincipal String providerId) {
        if (providerId == null) {
            return ResponseEntity.status(401).build(); // 권한 없음
        }
        
        // 도장에 찍힌 고유 ID로 DB에서 유저 진짜 정보를 찾아옴
        User user = userRepository.findByProviderAndProviderId("GITHUB", providerId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
                
        return ResponseEntity.ok(new UserResponseDto(user));
    }
}
