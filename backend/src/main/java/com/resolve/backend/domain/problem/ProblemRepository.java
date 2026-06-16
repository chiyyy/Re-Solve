package com.resolve.backend.domain.problem;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    // 특정 유저(작성자)가 등록한 모든 문제 목록 조회
    List<Problem> findAllByUserId(Long userId);
    
    // 유저의 문제를 최신순(내림차순)으로 조회
    List<Problem> findAllByUserIdOrderByIdDesc(Long userId);
    
    // 복습이 필요한 문제 찾기 (status = REVIEW, nextReviewDate <= 주어진 날짜, isTodayReview = false)
    List<Problem> findByStatusAndNextReviewDateLessThanEqualAndIsTodayReviewFalse(ProblemStatus status, java.time.LocalDate date);
}
