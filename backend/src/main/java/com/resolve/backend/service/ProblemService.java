package com.resolve.backend.service;

import com.resolve.backend.domain.problem.Problem;
import com.resolve.backend.domain.problem.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProblemService {

    private final ProblemRepository problemRepository;

    // 특정 유저의 전체 문제 목록 조회
    public List<Problem> getProblemsByUserId(Long userId) {
        return problemRepository.findAllByUserIdOrderByIdDesc(userId);
    }
    
    // 문제 상세 조회
    public Problem getProblemDetail(Long problemId) {
        return problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문제를 찾을 수 없습니다. ID=" + problemId));
    }
    
    // TODO: 문제 등록(@Transactional), 수정, 삭제 로직 및 GitHub API 연동 로직 추가 예정
}
