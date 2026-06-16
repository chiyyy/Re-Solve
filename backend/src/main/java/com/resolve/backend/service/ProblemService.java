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

        // 깃허브 동기화 삭제
        if (problem.isPushed()) {
            String repoName = user.getGithubRepoName();
            if (repoName == null || repoName.isEmpty()) {
                repoName = "resolve-algorithm-records";
            }
            String safeTitle = problem.getTitle().replaceAll("\\s+", "_");
            String path = problem.getPlatform().name() + "/" + problem.getDifficulty().name() + "/" + safeTitle + ".md";
            
            try {
                githubSyncService.deleteFromGithub(user.getGithubToken(), user.getNickname(), repoName, path, "Delete solved problem: " + problem.getTitle());
            } catch (Exception e) {
                log.error("GitHub 파일 삭제 실패", e);
            }
        }
    }

    // 복습 완료 처리
    @Transactional
    public void completeReview(String providerId, Long problemId) {
        User user = getUserByProviderId(providerId);
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("해당 문제를 찾을 수 없습니다. ID=" + problemId));

        if (!problem.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        problem.completeReview();
    }

    // 테스트용 모의 데이터 주입 (오답 노트 테스트용)
    @Transactional
    public void insertMockData(String providerId) {
        User user = getUserByProviderId(providerId);

        // 1. 1일차 복습 대기 중인 문제 (어제 틀린 문제)
        Problem p1 = Problem.builder()
                .user(user)
                .title("[Mock] Two Sum (어제 틀린 문제)")
                .url("https://leetcode.com/problems/two-sum/")
                .platform(com.resolve.backend.domain.problem.Platform.LEETCODE)
                .difficulty(com.resolve.backend.domain.problem.Difficulty.EASY)
                .algorithmType("Hash")
                .status(com.resolve.backend.domain.problem.ProblemStatus.REVIEW)
                .code("class Solution { ... }")
                .note("어제 틀린 문제 테스트용")
                .build();
        // 꼼수: nextReviewDate를 어제나 오늘로 맞춰서 스케줄러가 잡아가게 함
        p1.update(p1.getTitle(), p1.getUrl(), p1.getPlatform(), p1.getDifficulty(), p1.getAlgorithmType(), p1.getStatus(), p1.getCode(), p1.getNote());
        
        // 2. 3일차 복습 대기 중인 문제 (1차 복습 완료 상태)
        Problem p2 = Problem.builder()
                .user(user)
                .title("[Mock] Merge Intervals (3일차 복습 대기)")
                .url("https://leetcode.com/problems/merge-intervals/")
                .platform(com.resolve.backend.domain.problem.Platform.LEETCODE)
                .difficulty(com.resolve.backend.domain.problem.Difficulty.MEDIUM)
                .algorithmType("Array")
                .status(com.resolve.backend.domain.problem.ProblemStatus.REVIEW)
                .code("class Solution { ... }")
                .note("3일차 복습 테스트용")
                .build();
        p2.completeReview(); // 강제로 1회 완료 -> 다음 3일 뒤로 세팅됨
        
        // 3. 7일차 복습 대기 중인 문제
        Problem p3 = Problem.builder()
                .user(user)
                .title("[Mock] Course Schedule (7일차 복습 대기)")
                .url("https://leetcode.com/problems/course-schedule/")
                .platform(com.resolve.backend.domain.problem.Platform.LEETCODE)
                .difficulty(com.resolve.backend.domain.problem.Difficulty.MEDIUM)
                .algorithmType("Graph")
                .status(com.resolve.backend.domain.problem.ProblemStatus.REVIEW)
                .code("class Solution { ... }")
                .note("7일차 복습 테스트용")
                .build();
        p3.completeReview(); // 1차 완료
        p3.activateTodayReview(); 
        p3.completeReview(); // 2차 완료 -> 다음 7일 뒤로 세팅됨

        problemRepository.save(p1);
        problemRepository.save(p2);
        problemRepository.save(p3);
        
        // DB에 강제로 nextReviewDate를 "오늘"로 바꿔서 1분 뒤 스케줄러가 잡게 함
        problemRepository.flush();
        problemRepository.findAll().forEach(p -> {
            if (p.getTitle().startsWith("[Mock]")) {
                // EntityManager나 쿼리 없이 그냥 필드 리플렉션이나 setter가 없으므로 update 호출 후 다시 덮어씌움
                // 하지만 Problem 엔티티에 nextReviewDate setter가 없으므로...
                // JpaRepository update 쿼리를 쓰거나 native query를 써야 하지만,
                // 가장 쉬운 방법: Reflection 사용
                try {
                    java.lang.reflect.Field field = Problem.class.getDeclaredField("nextReviewDate");
                    field.setAccessible(true);
                    field.set(p, java.time.LocalDate.now());
                } catch (Exception e) {}
            }
        });
    }

    // 마크다운 생성 및 푸시 공통 메서드
    private void pushProblemToGithub(User user, Problem problem, String commitMessage) {
        String repoName = user.getGithubRepoName();
        if (repoName == null || repoName.isEmpty()) {
            repoName = "resolve-algorithm-records"; // 유저가 레포 이름을 설정 안 했으면 임시로 사용
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
