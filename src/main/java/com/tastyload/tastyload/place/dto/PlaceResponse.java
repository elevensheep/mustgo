package com.tastyload.tastyload.place.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Schema(description = "장소 응답")
public class PlaceResponse {
    
    @Schema(description = "장소 고유 ID", example = "place_12345")
    private String placeId;
    
    @Schema(description = "장소 이름", example = "맛있는 식당")
    private String placeName;
    
    @Schema(description = "장소 설명", example = "정말 맛있는 한식당입니다")
    private String description;
    
    @Schema(description = "이미지 URL", example = "https://example.com/image.jpg")
    private String imageUrl;
    
    @Schema(description = "등록자 닉네임", example = "맛집러버")
    private String userNickname;
    
    @Schema(description = "위도", example = "37.5665")
    private Double latitude;
    
    @Schema(description = "경도", example = "126.9780")
    private Double longitude;
    
    @Schema(description = "등록 시간", example = "2024-01-01T12:00:00")
    private LocalDateTime createdAt;
}
