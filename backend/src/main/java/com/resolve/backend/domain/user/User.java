package com.resolve.backend.domain.user;

import com.resolve.backend.domain.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users") // user는 데이터베이스 예약어일 수 있으므로 users로 설정
public class User extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String nickname;

    // 소셜 로그인 제공자 (예: GITHUB)
    private String provider;
    
    // 소셜 로그인 고유 ID
    private String providerId;

    // GitHub 연동 후 코드를 푸시하기 위한 접근 토큰
    private String githubToken;

    // 코드가 자동으로 푸시될 레포지토리 이름 (예: resolve-algorithm-notes)
    private String githubRepoName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder
    public User(String email, String nickname, String provider, String providerId, String githubToken, Role role) {
        this.email = email;
        this.nickname = nickname;
        this.provider = provider;
        this.providerId = providerId;
        this.githubToken = githubToken;
        this.role = role;
    }

    public void updateGithubToken(String githubToken) {
        this.githubToken = githubToken;
    }

    public void updateGithubRepoName(String githubRepoName) {
        this.githubRepoName = githubRepoName;
    }
}
