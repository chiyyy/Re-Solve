package com.resolve.backend.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // 이메일로 유저 찾기 (로그인 등)
    Optional<User> findByEmail(String email);
    
    // 소셜 로그인 프로바이더(GitHub)와 고유 ID로 유저 찾기
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
}
