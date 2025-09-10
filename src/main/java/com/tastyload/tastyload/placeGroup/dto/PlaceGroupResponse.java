package com.tastyload.tastyload.placeGroup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Schema(description = "장소 그룹 응답")
public class PlaceGroupResponse {
    
    @Schema(description = "장소 그룹 ID", example = "1")
    private Long id;
    
    @Schema(description = "사용자 ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private String userId;
    
    @Schema(description = "장소 그룹 제목", example = "서울 맛집 베스트")
    private String title;
    
    @Schema(description = "장소 그룹 설명", example = "서울에서 꼭 가봐야 할 맛집들을 모았습니다")
    private String description;
    
    @Schema(description = "좋아요 수", example = "42")
    private int likeCount;
    
    @Schema(description = "공개 여부", example = "true")
    private boolean visibility;
    
    @Schema(description = "생성일시")
    private LocalDateTime createdAt;
    
    @Schema(description = "수정일시")
    private LocalDateTime updatedAt;
    
    @Schema(description = "포함된 장소 목록")
    private List<PlaceItemResponse> places;
    
    @Schema(description = "태그 목록")
    private List<TagItemResponse> tags;
    
    @Data
    @Schema(description = "장소 그룹에 포함된 장소 정보")
    public static class PlaceItemResponse {
        
        @Schema(description = "장소 ID", example = "1")
        private Long placeId;
        
        @Schema(description = "장소명", example = "맛있는 치킨집")
        private String placeName;
        
        @Schema(description = "장소 주소", example = "서울시 강남구 테헤란로 123")
        private String placeAddress;
        
        @Schema(description = "장소 그룹에 추가된 일시")
        private LocalDateTime addedAt;
    }
    
    @Data
    @Schema(description = "장소 그룹에 포함된 태그 정보")
    public static class TagItemResponse {
        
        @Schema(description = "태그 ID", example = "1")
        private Long id;
        
        @Schema(description = "태그명", example = "맛집")
        private String tag;
    }
}
