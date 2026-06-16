package com.resolve.backend.dto.problem;

import com.resolve.backend.domain.problem.Difficulty;
import com.resolve.backend.domain.problem.Platform;
import com.resolve.backend.domain.problem.Problem;
import com.resolve.backend.domain.problem.ProblemStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ProblemResponseDto {
    private Long id;
    private String title;
    private String url;
    private Platform platform;
    private Difficulty difficulty;
    private String algorithmType;
    private ProblemStatus status;
    private String code;
    private String note;
    private boolean isPushed;
    private String commitUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 에빙하우스 복습 필드
    private Integer reviewStep;
    private java.time.LocalDate nextReviewDate;
    
    @com.fasterxml.jackson.annotation.JsonProperty("isTodayReview")
    private boolean isTodayReview;

    public ProblemResponseDto(Problem entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.url = entity.getUrl();
        this.platform = entity.getPlatform();
        this.difficulty = entity.getDifficulty();
        this.algorithmType = entity.getAlgorithmType();
        this.status = entity.getStatus();
        this.code = entity.getCode();
        this.note = entity.getNote();
        this.isPushed = entity.isPushed();
        this.commitUrl = entity.getCommitUrl();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
        this.reviewStep = entity.getReviewStep();
        this.nextReviewDate = entity.getNextReviewDate();
        this.isTodayReview = entity.isTodayReview();
    }
}
