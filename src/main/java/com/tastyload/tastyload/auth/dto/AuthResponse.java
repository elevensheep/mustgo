package com.tastyload.tastyload.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "인증 응답 DTO")
public class AuthResponse {
    
    @Schema(description = "액세스 토큰", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;
    
    @Schema(description = "리프레시 토큰", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String refreshToken;
    
    @Schema(description = "토큰 타입", example = "Bearer")
    private String tokenType = "Bearer";
    
    @Schema(description = "토큰 만료 시간(초)", example = "3600")
    private Long expiresIn;
    
    @Schema(description = "사용자 정보")
    private UserInfo user;
    
    @Data
    @Schema(description = "사용자 정보")
    public static class UserInfo {
        @Schema(description = "사용자 ID", example = "123e4567-e89b-12d3-a456-426614174000")
        private String id;
        
        @Schema(description = "이메일", example = "user@example.com")
        private String email;
        
        @Schema(description = "사용자명", example = "홍길동")
        private String name;
        
        @Schema(description = "프로필 이미지 URL", example = "https://example.com/profile.jpg")
        private String avatarUrl;
        
        @Schema(description = "이메일 인증 여부", example = "true")
        private Boolean emailVerified;
    }
}
