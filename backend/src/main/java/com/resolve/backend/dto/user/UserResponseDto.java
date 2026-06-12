package com.resolve.backend.dto.user;

import com.resolve.backend.domain.user.User;
import lombok.Getter;

@Getter
public class UserResponseDto {
    private Long id;
    private String email;
    private String nickname;
    private String githubRepoName;

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.githubRepoName = user.getGithubRepoName();
    }
}
