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

    public void pushToGithub(String githubToken, String owner, String repoName, String path, String content, String commitMessage) {
        String sha = getFileSha(githubToken, owner, repoName, path);
        
        String url = String.format("%s/repos/%s/%s/contents/%s", GITHUB_API_URL, owner, repoName, path);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(githubToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/vnd.github.v3+json");
        
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

    private String getFileSha(String githubToken, String owner, String repoName, String path) {
        String url = String.format("%s/repos/%s/%s/contents/%s", GITHUB_API_URL, owner, repoName, path);
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(githubToken);
        headers.set("Accept", "application/vnd.github.v3+json");
        
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
}
