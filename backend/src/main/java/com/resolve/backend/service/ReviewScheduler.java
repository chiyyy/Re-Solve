package com.resolve.backend.service;

import com.resolve.backend.domain.problem.Problem;
import com.resolve.backend.domain.problem.ProblemRepository;
import com.resolve.backend.domain.problem.ProblemStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewScheduler {

    private final ProblemRepository problemRepository;

    // 로컬 환경에서도 테스트하기 쉽도록 매 1분마다 스케줄러 실행 (원래는 0 0 0 * * * 자정)
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void updateTodayReviewProblems() {
        log.info("에빙하우스 복습 스케줄러 실행: 오늘의 복습 문제 업데이트 시작");
        LocalDate today = LocalDate.now();

        // status가 REVIEW이고, nextReviewDate가 오늘 이전이면서, 아직 isTodayReview가 아닌 문제들을 찾는다.
        List<Problem> problemsDue = problemRepository.findByStatusAndNextReviewDateLessThanEqualAndIsTodayReviewFalse(
                ProblemStatus.REVIEW, today
        );

        for (Problem problem : problemsDue) {
            problem.activateTodayReview();
        }

        log.info("오늘의 복습 문제 {}개 업데이트 완료", problemsDue.size());
    }
}
