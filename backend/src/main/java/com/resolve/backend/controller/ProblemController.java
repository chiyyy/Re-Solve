package com.resolve.backend.controller;

import com.resolve.backend.dto.problem.ProblemCreateRequestDto;
import com.resolve.backend.dto.problem.ProblemResponseDto;
import com.resolve.backend.dto.problem.ProblemUpdateRequestDto;
import com.resolve.backend.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    // 문제 등록
    @PostMapping
    public ResponseEntity<Long> createProblem(
            @RequestParam(defaultValue = "1") Long userId, // TODO: 인증 구현 후 SecurityContext에서 가져오기
            @Valid @RequestBody ProblemCreateRequestDto requestDto) {
        return ResponseEntity.ok(problemService.createProblem(userId, requestDto));
    }

    // 특정 유저의 문제 목록 조회
    @GetMapping
    public ResponseEntity<List<ProblemResponseDto>> getProblems(
            @RequestParam(defaultValue = "1") Long userId) { // TODO: 인증 구현 후 SecurityContext에서 가져오기
        return ResponseEntity.ok(problemService.getProblemsByUserId(userId));
    }

    // 문제 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<ProblemResponseDto> getProblemDetail(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.getProblemDetail(id));
    }

    // 문제 수정
    @PutMapping("/{id}")
    public ResponseEntity<Long> updateProblem(
            @PathVariable Long id,
            @Valid @RequestBody ProblemUpdateRequestDto requestDto) {
        return ResponseEntity.ok(problemService.updateProblem(id, requestDto));
    }

    // 문제 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.ok().build();
    }
}
