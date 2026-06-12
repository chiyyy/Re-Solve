package com.resolve.backend.service;

import com.resolve.backend.domain.problem.Problem;
import com.resolve.backend.domain.problem.ProblemRepository;
import com.resolve.backend.domain.user.User;
import com.resolve.backend.domain.user.UserRepository;
import com.resolve.backend.dto.problem.ProblemCreateRequestDto;
import com.resolve.backend.dto.problem.ProblemResponseDto;
import com.resolve.backend.dto.problem.ProblemUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    // 특정 유저의 전체 문제 목록 조회
    public List<ProblemResponseDto> getProblemsByUserId(Long userId) {
        return problemRepository.findAllByUserIdOrderByIdDesc(userId)
                .stream()
                .map(ProblemResponseDto::new)
                .collect(Collectors.toList());
    }
    
    // 문제 상세 조회
    public ProblemResponseDto getProblemDetail(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문제를 찾을 수 없습니다. ID=" + problemId));
        return new ProblemResponseDto(problem);
    }
    
    // 문제 등록
    @Transactional
    public Long createProblem(Long userId, ProblemCreateRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다. ID=" + userId));
                
        Problem problem = Problem.builder()
                .user(user)
                .title(requestDto.getTitle())
                .url(requestDto.getUrl())
                .platform(requestDto.getPlatform())
                .difficulty(requestDto.getDifficulty())
                .algorithmType(requestDto.getAlgorithmType())
                .status(requestDto.getStatus())
                .code(requestDto.getCode())
                .note(requestDto.getNote())
                .build();
                
        return problemRepository.save(problem).getId();
    }
    
    // 문제 수정
    @Transactional
    public Long updateProblem(Long problemId, ProblemUpdateRequestDto requestDto) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문제를 찾을 수 없습니다. ID=" + problemId));
                
        problem.update(
            requestDto.getTitle(),
            requestDto.getUrl(),
            requestDto.getPlatform(),
            requestDto.getDifficulty(),
            requestDto.getAlgorithmType(),
            requestDto.getStatus(),
            requestDto.getCode(),
            requestDto.getNote()
        );
        
        return problemId;
    }
    
    // 문제 삭제
    @Transactional
    public void deleteProblem(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문제를 찾을 수 없습니다. ID=" + problemId));
        problemRepository.delete(problem);
    }
}
