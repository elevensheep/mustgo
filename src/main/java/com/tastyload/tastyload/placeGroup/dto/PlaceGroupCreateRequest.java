package com.tastyload.tastyload.placeGroup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
@Schema(description = "장소 그룹 생성 요청")
public class PlaceGroupCreateRequest {
    
    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 100, message = "제목은 100자 이하여야 합니다")
    @Schema(description = "장소 그룹 제목", example = "서울 맛집 베스트")
    private String title;

    @NotBlank(message = "사용자 ID는 필수입니다")
    @Schema(description = "사용자 ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private String userId;
    
    @Size(max = 500, message = "설명은 500자 이하여야 합니다")
    @Schema(description = "장소 그룹 설명", example = "서울에서 꼭 가봐야 할 맛집들을 모았습니다")
    private String description;
    
    @Schema(description = "공개 여부", example = "true")
    private boolean visibility = true;
    
    @NotNull(message = "장소 목록은 필수입니다")
    @Size(min = 1, message = "최소 1개 이상의 장소가 필요합니다")
    @Schema(description = "포함할 장소 목록")
    private List<PlaceItem> places;
    
    @Schema(description = "태그 목록")
    private List<TagItem> tags;
    
    @Data
    @Schema(description = "장소 그룹에 포함될 장소 정보")
    public static class PlaceItem {
        
        @NotNull(message = "장소 ID는 필수입니다")
        @Schema(description = "장소 ID", example = "1")
        private Long placeId;
    }
    
    @Data
    @Schema(description = "장소 그룹에 포함될 태그 정보")
    public static class TagItem {
        
        @NotBlank(message = "태그는 필수입니다")
        @Size(max = 50, message = "태그는 50자 이하여야 합니다")
        @Schema(description = "태그명", example = "맛집")
        private String tag;
    }
}