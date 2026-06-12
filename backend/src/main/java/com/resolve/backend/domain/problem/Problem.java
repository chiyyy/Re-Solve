package com.resolve.backend.domain.problem;

import com.resolve.backend.domain.BaseTimeEntity;
import com.resolve.backend.domain.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Problem extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String url;

    @Enumerated(EnumType.STRING)
    private Platform platform;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    private String algorithmType;

    @Enumerated(EnumType.STRING)
    private ProblemStatus status;

    @Column(columnDefinition = "TEXT")
    private String code;

    @Column(columnDefinition = "TEXT")
    private String note;

    // 깃허브에 코드가 자동으로 푸시되었는지 여부
    private boolean isPushed;

    // 실제 깃허브에 올라간 커밋의 링크
    private String commitUrl;

    @Builder
    public Problem(User user, String title, String url, Platform platform, Difficulty difficulty, String algorithmType, ProblemStatus status, String code, String note) {
        this.user = user;
        this.title = title;
        this.url = url;
        this.platform = platform;
        this.difficulty = difficulty;
        this.algorithmType = algorithmType;
        this.status = status;
        this.code = code;
        this.note = note;
        this.isPushed = false;
    }

    // 정보 수정 메서드
    public void update(String title, String url, Platform platform, Difficulty difficulty, String algorithmType, ProblemStatus status, String code, String note) {
        this.title = title;
        this.url = url;
        this.platform = platform;
        this.difficulty = difficulty;
        this.algorithmType = algorithmType;
        this.status = status;
        this.code = code;
        this.note = note;
    }
    
    // 푸시 성공 시 상태를 업데이트하는 메서드
    public void markAsPushed(String commitUrl) {
        this.isPushed = true;
        this.commitUrl = commitUrl;
    }
}
