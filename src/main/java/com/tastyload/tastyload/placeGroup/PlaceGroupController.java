package com.tastyload.tastyload.placeGroup;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tastyload.tastyload.common.dto.ApiResponse;
import com.tastyload.tastyload.placeGroup.dto.PlaceGroupCreateRequest;
import com.tastyload.tastyload.placeGroup.entity.PlaceGroupEntity;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/place-groups")
@Tag(name = "Place Group", description = "Place Group API")
public class PlaceGroupController {
     
    private final PlaceGroupService placeGroupService;

    public PlaceGroupController(PlaceGroupService placeGroupService) {
        this.placeGroupService = placeGroupService;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PlaceGroupEntity>>> getAllPlaceGroups() {
        List<PlaceGroupEntity> placeGroups = placeGroupService.getAllPlaceGroups();
        return ResponseEntity.ok(ApiResponse.success(placeGroups));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PlaceGroupEntity>> createPlaceGroup(@RequestBody PlaceGroupCreateRequest request) {
        PlaceGroupEntity placeGroup = placeGroupService.createPlaceGroup(request);
        return ResponseEntity.ok(ApiResponse.success(placeGroup));
    }
}
