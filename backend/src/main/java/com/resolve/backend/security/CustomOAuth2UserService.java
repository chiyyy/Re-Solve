package com.resolve.backend.security;

import com.resolve.backend.domain.user.Role;
import com.resolve.backend.domain.user.User;
import com.resolve.backend.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // 깃허브가 발급해준 레포지토리 푸시 권한이 담긴 토큰 가로채기
        String githubToken = userRequest.getAccessToken().getTokenValue();
        
        // 유저 정보 파싱
        String providerId = oAuth2User.getAttribute("id").toString();
        String email = oAuth2User.getAttribute("email");
        String nickname = oAuth2User.getAttribute("login"); // 깃허브 아이디(username)

        // 깃허브에서 이메일 비공개 설정한 유저 예외 처리
        if (email == null) {
            email = nickname + "@github.com";
        }

        // DB에 없으면 회원가입, 있으면 토큰 최신화
        saveOrUpdate(providerId, email, nickname, githubToken);

        return new DefaultOAuth2User(
                Collections.emptyList(),
                oAuth2User.getAttributes(),
                "id"
        );
    }

    private void saveOrUpdate(String providerId, String email, String nickname, String githubToken) {
        User user = userRepository.findByProviderAndProviderId("GITHUB", providerId)
                .map(entity -> {
                    entity.updateGithubToken(githubToken);
                    return entity;
                })
                .orElse(User.builder()
                        .email(email)
                        .nickname(nickname)
                        .provider("GITHUB")
                        .providerId(providerId)
                        .githubToken(githubToken)
                        .role(Role.USER)
                        .build());
        userRepository.save(user);
    }
}
