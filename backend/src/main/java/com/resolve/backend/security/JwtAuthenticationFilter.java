package com.resolve.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = parseBearerToken(request);

        // 토큰이 존재하고 조작되지 않았다면
        if (token != null) {
            try {
                // 토큰에서 유저 고유 ID(providerId) 추출
                String providerId = jwtTokenProvider.getProviderIdFromToken(token);
                
                // 스프링 시큐리티 컨텍스트(서버의 메모리)에 이 사람은 인증된 유저라고 도장 쾅 찍어줌!
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        providerId, null, Collections.emptyList()
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                logger.error("유효하지 않은 JWT 토큰입니다.", e);
            }
        }

        // 다음 문지기(필터)로 넘김
        filterChain.doFilter(request, response);
    }

    private String parseBearerToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 글자 떼어내고 진짜 토큰만 추출
        }
        return null;
    }
}
