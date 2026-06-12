package com.resolve.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GithubSyncService {

    private final RestTemplate restTemplate;
    private static final String GITHUB_API_URL = "https://api.github.com";

    private HttpHeaders createHeaders(String githubToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(githubToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/vnd.github.v3+json");
        headers.set("User-Agent", "Re-Solve-App"); // 깃허브 API 필수 규정
        return headers;
    }

    public void pushToGithub(String githubToken, String owner, String repoName, String path, String content, String commitMessage) {
        createRepoIfNotExist(githubToken, repoName);
        
        String sha = getFileSha(githubToken, owner, repoName, path);
        
        String url = String.format("%s/repos/%s/%s/contents/%s", GITHUB_API_URL, owner, repoName, path);
        
        HttpHeaders headers = createHeaders(githubToken);
        
        String encodedContent = Base64.getEncoder().encodeToString(content.getBytes());
        
        Map<String, Object> body = new HashMap<>();
        body.put("message", commitMessage);
        body.put("content", encodedContent);
        if (sha != null) {
            body.put("sha", sha);
        }

        try {
            restTemplate.exchange(url, HttpMethod.PUT, new HttpEntity<>(body, headers), String.class);
            log.info("Successfully pushed [{}] to [{}/{}]", path, owner, repoName);
        } catch (Exception e) {
            log.error("Failed to push file to GitHub", e);
            throw new RuntimeException("GitHub 푸시 중 오류가 발생했습니다.");
        }
    }

    public void deleteFromGithub(String githubToken, String owner, String repoName, String path, String commitMessage) {
        String sha = getFileSha(githubToken, owner, repoName, path);
        if (sha == null) {
            log.warn("File [{}] not found in GitHub. Cannot delete.", path);
            return;
        }

        String url = String.format("%s/repos/%s/%s/contents/%s", GITHUB_API_URL, owner, repoName, path);
        HttpHeaders headers = createHeaders(githubToken);

        Map<String, Object> body = new HashMap<>();
        body.put("message", commitMessage);
        body.put("sha", sha);

        try {
            restTemplate.exchange(url, HttpMethod.DELETE, new HttpEntity<>(body, headers), String.class);
            log.info("Successfully deleted [{}] from [{}/{}]", path, owner, repoName);
        } catch (Exception e) {
            log.error("Failed to delete file from GitHub", e);
            throw new RuntimeException("GitHub 삭제 중 오류가 발생했습니다.");
        }
    }

    private String getFileSha(String githubToken, String owner, String repoName, String path) {
        String url = String.format("%s/repos/%s/%s/contents/%s", GITHUB_API_URL, owner, repoName, path);
        HttpHeaders headers = createHeaders(githubToken);
        
        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), Map.class);
            return (String) response.getBody().get("sha");
        } catch (HttpClientErrorException.NotFound e) {
            return null;
        } catch (Exception e) {
            log.warn("Could not fetch SHA for file [{}]. It might be a new file.", path);
            return null;
        }
    }

    private void createRepoIfNotExist(String githubToken, String repoName) {
        String url = GITHUB_API_URL + "/user/repos";
        HttpHeaders headers = createHeaders(githubToken);
        
        Map<String, Object> body = new HashMap<>();
        body.put("name", repoName);
        body.put("private", false);
        body.put("description", "Re:Solve에서 자동 생성된 알고리즘 풀이 기록입니다.");
        
        try {
            restTemplate.postForEntity(url, new HttpEntity<>(body, headers), String.class);
            log.info("GitHub Repository [{}] created.", repoName);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNPROCESSABLE_ENTITY) {
                // 이미 존재하는 경우 조용히 넘어감
            } else {
                log.warn("레포지토리 생성 실패 (HttpClientErrorException): {}", e.getMessage());
            }
        } catch (Exception e) {
            log.warn("레포지토리 생성 중 알 수 없는 예외: {}", e.getMessage());
        }
    }
}
