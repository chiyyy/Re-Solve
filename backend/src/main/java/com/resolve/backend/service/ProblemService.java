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

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final GithubSyncService githubSyncService;

    private User getUserByProviderId(String providerId) {
        return userRepository.findByProviderAndProviderId("GITHUB", providerId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    // 특정 유저의 전체 문제 목록 조회
    public List<ProblemResponseDto> getProblemsByProviderId(String providerId) {
        User user = getUserByProviderId(providerId);
        return problemRepository.findAllByUserIdOrderByIdDesc(user.getId())
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
    public Long createProblem(String providerId, ProblemCreateRequestDto requestDto) {
        User user = getUserByProviderId(providerId);
                
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
                
        problemRepository.save(problem);
        
        // 깃허브 푸시 로직 호출
        pushProblemToGithub(user, problem, "Add solved problem: " + problem.getTitle());
        
        return problem.getId();
    }
    
    // 문제 수정
    @Transactional
    public Long updateProblem(String providerId, Long problemId, ProblemUpdateRequestDto requestDto) {
        User user = getUserByProviderId(providerId);
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문제를 찾을 수 없습니다. ID=" + problemId));
                
        // 권한 체크: 자기 문제만 수정 가능
        if (!problem.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }
                
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
        
        // 깃허브 업데이트 로직 호출
        pushProblemToGithub(user, problem, "Update solved problem: " + problem.getTitle());
        
        return problemId;
    }
    
    // 문제 삭제
    @Transactional
    public void deleteProblem(String providerId, Long problemId) {
        User user = getUserByProviderId(providerId);
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문제를 찾을 수 없습니다. ID=" + problemId));
                
        if (!problem.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }
        
        problemRepository.delete(problem);
    }

    // 마크다운 생성 및 푸시 공통 메서드
    private void pushProblemToGithub(User user, Problem problem, String commitMessage) {
        String repoName = user.getGithubRepoName();
        if (repoName == null || repoName.isEmpty()) {
            repoName = "algorithm-practice"; // 유저가 레포 이름을 설정 안 했으면 임시로 사용
        }
        
        // 백준/Easy/두_수의_합.md 형식으로 저장
        String safeTitle = problem.getTitle().replaceAll("\\s+", "_");
        String path = problem.getPlatform().name() + "/" + problem.getDifficulty().name() + "/" + safeTitle + ".md";
        
        StringBuilder contentBuilder = new StringBuilder();
        contentBuilder.append("# ").append(problem.getTitle()).append("\n\n");
        contentBuilder.append("- Platform: ").append(problem.getPlatform().name()).append("\n");
        contentBuilder.append("- Difficulty: ").append(problem.getDifficulty().name()).append("\n");
        contentBuilder.append("- URL: ").append(problem.getUrl() != null ? problem.getUrl() : "").append("\n\n");
        contentBuilder.append("## Code\n```java\n").append(problem.getCode() != null ? problem.getCode() : "").append("\n```\n\n");
        contentBuilder.append("## Note\n").append(problem.getNote() != null ? problem.getNote() : "");

        try {
            githubSyncService.pushToGithub(user.getGithubToken(), user.getNickname(), repoName, path, contentBuilder.toString(), commitMessage);
            String githubUrl = "https://github.com/" + user.getNickname() + "/" + repoName + "/blob/main/" + path;
            problem.markAsPushed(githubUrl); // 상태 변경
        } catch (Exception e) {
            log.error("GitHub 푸시 실패", e);
            // 푸시 실패해도 문제 저장은 성공하도록 예외를 던지지 않고 무시하거나 비동기 처리 가능
        }
    }
}
