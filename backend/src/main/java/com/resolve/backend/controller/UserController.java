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

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(@AuthenticationPrincipal String providerId) {
        if (providerId == null || providerId.equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }
        
        User user = userRepository.findByProviderAndProviderId("GITHUB", providerId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
                
        return ResponseEntity.ok(new UserResponseDto(user));
    }
}
