package com.tastyload.tastyload.config;

import com.tastyload.tastyload.auth.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                // Swagger UI 및 API 문서 경로는 인증 없이 접근 가능
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/api-docs/**",
                    "/v3/api-docs/**",
                    "/swagger-resources/**",
                    "/webjars/**"
                ).permitAll()
                // 인증 관련 엔드포인트는 인증 없이 접근 가능
                .requestMatchers(
                    "/api/auth/signup",
                    "/api/auth/signin",
                    "/api/auth/kakao",
                    "/api/auth/callback"
                ).permitAll()
                // 사용자 조회 엔드포인트는 인증 없이 접근 가능 (개발/테스트용)
                .requestMatchers(
                    "/api/users/all",
                    "/api/users/check-email"
                ).permitAll()
                // 기타 모든 요청은 인증 필요
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable()) // CSRF 비활성화 (개발 환경용)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // JWT 사용으로 세션 비활성화
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // JWT 필터 추가

        return http.build();
    }
}
