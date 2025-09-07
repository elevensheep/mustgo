package com.tastyload.tastyload.place;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tastyload.tastyload.common.dto.ApiResponse;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequestMapping("/api/places")
@Tag(name = "맛집 관리", description = "맛집 CRUD API")
public class PlaceController {
    
    private final PlaceService placeService;

    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }
    
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PlaceEntity>>> getAllPlaces() {
        List<PlaceEntity> places = placeService.getAllPlaces();
        ApiResponse<List<PlaceEntity>> response = ApiResponse.success("모든 맛집을 조회했습니다", places);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{placeName}")
    public ResponseEntity<ApiResponse<List<PlaceEntity>>> getPlaceByName(@PathVariable String placeName) {
        List<PlaceEntity> places = placeService.searchPlacesByName(placeName);
        
        if (places.isEmpty()) {
            ApiResponse<List<PlaceEntity>> response = ApiResponse.error("검색 결과가 없습니다", "PLACE_NOT_FOUND");
            return ResponseEntity.ok(response);
        }
        
        ApiResponse<List<PlaceEntity>> response = ApiResponse.success("맛집 검색이 완료되었습니다", places);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PlaceEntity>> createPlace(@RequestBody PlaceEntity place) {
        PlaceEntity result = placeService.createPlace(place);
        
        if(result == null) {
            // 중복된 장소가 삭제된 경우
            ApiResponse<PlaceEntity> response = ApiResponse.success("중복된 맛집이 삭제되었습니다", null);
            return ResponseEntity.ok(response);
        } else {
            // 새로운 장소가 생성된 경우
            ApiResponse<PlaceEntity> response = ApiResponse.success("맛집이 성공적으로 생성되었습니다", result);
            return ResponseEntity.ok(response);
        }
    }
}
