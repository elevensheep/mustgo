package com.tastyload.tastyload.users.dto;

import com.tastyload.tastyload.users.UserEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Schema(description = "사용자 정보 응답")
public class UserResponse {
    
    @Schema(description = "사용자 UUID", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID uuid;
    
    @Schema(description = "사용자 이메일", example = "user@example.com")
    private String email;
    
    @Schema(description = "사용자 닉네임", example = "맛집러버")
    private String nickname;
    
    @Schema(description = "계정 생성일시", example = "2024-01-01T12:00:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "계정 수정일시", example = "2024-01-01T12:00:00")
    private LocalDateTime updatedAt;
    
    /**
     * UserEntity를 UserResponse로 변환하는 정적 팩토리 메서드
     */
    public static UserResponse from(UserEntity user) {
        UserResponse response = new UserResponse();
        response.setUuid(user.getUuid());
        response.setEmail(user.getEmail());
        response.setNickname(user.getNickname());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}
