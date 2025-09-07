package com.tastyload.tastyload.place.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "장소 생성/수정 요청")
public class PlaceRequest {
    
    @NotBlank(message = "장소 ID는 필수입니다")
    @Schema(description = "장소 고유 ID", example = "place_12345", required = true)
    private String placeId;
    
    @NotBlank(message = "장소 이름은 필수입니다")
    @Size(min = 1, max = 100, message = "장소 이름은 1-100자 사이여야 합니다")
    @Schema(description = "장소 이름", example = "맛있는 식당", required = true, minLength = 1, maxLength = 100)
    private String placeName;
    
    @Size(max = 500, message = "설명은 500자를 초과할 수 없습니다")
    @Schema(description = "장소 설명", example = "정말 맛있는 한식당입니다", maxLength = 500)
    private String description;
    
    @Schema(description = "이미지 URL", example = "https://example.com/image.jpg")
    private String imageUrl;
    
    @NotBlank(message = "사용자 UUID는 필수입니다")
    @Schema(description = "사용자 UUID", example = "123e4567-e89b-12d3-a456-426614174000", required = true)
    private String userUuid;
    
    @NotNull(message = "위도는 필수입니다")
    @Schema(description = "위도", example = "37.5665", required = true)
    private Double latitude;
    
    @NotNull(message = "경도는 필수입니다")
    @Schema(description = "경도", example = "126.9780", required = true)
    private Double longitude;
}
