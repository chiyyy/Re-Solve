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

    // 에빙하우스 복습 관련 필드
    private Integer reviewStep;
    private java.time.LocalDate nextReviewDate;
    private boolean isTodayReview;

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
        
        // 복습 상태로 등록되면 1일 뒤 첫 복습 설정
        if (status == ProblemStatus.REVIEW) {
            this.reviewStep = 0;
            this.nextReviewDate = java.time.LocalDate.now().plusDays(1);
        } else {
            this.reviewStep = 0;
            this.nextReviewDate = null;
        }
        this.isTodayReview = false;
    }

    // 정보 수정 메서드
    public void update(String title, String url, Platform platform, Difficulty difficulty, String algorithmType, ProblemStatus status, String code, String note) {
        this.title = title;
        this.url = url;
        this.platform = platform;
        this.difficulty = difficulty;
        this.algorithmType = algorithmType;
        this.code = code;
        this.note = note;

        // 상태가 변경되었을 때 에빙하우스 로직 초기화
        if (this.status != status) {
            this.status = status;
            if (status == ProblemStatus.REVIEW) {
                this.reviewStep = 0;
                this.nextReviewDate = java.time.LocalDate.now().plusDays(1);
                this.isTodayReview = false;
            } else {
                this.reviewStep = 0;
                this.nextReviewDate = null;
                this.isTodayReview = false;
            }
        }
    }
    
    // 복습 스케줄러가 오늘 복습할 문제로 지정
    public void activateTodayReview() {
        this.isTodayReview = true;
    }

    // 복습 완료 처리 (1일 -> 3일 -> 7일 -> 완료)
    public void completeReview() {
        if (!this.isTodayReview || this.status != ProblemStatus.REVIEW) return;

        this.isTodayReview = false;
        if (this.reviewStep == null) this.reviewStep = 0;
        this.reviewStep++;

        if (this.reviewStep == 1) {
            this.nextReviewDate = java.time.LocalDate.now().plusDays(3);
        } else if (this.reviewStep == 2) {
            this.nextReviewDate = java.time.LocalDate.now().plusDays(7);
        } else {
            // 3회차 복습(7일 뒤)까지 완료하면 완벽히 익힌 것으로 간주하여 상태 변경
            this.nextReviewDate = null;
            this.status = ProblemStatus.SOLVED;
        }
    }

    // 푸시 성공 시 상태를 업데이트하는 메서드
    public void markAsPushed(String commitUrl) {
        this.isPushed = true;
        this.commitUrl = commitUrl;
    }
}
