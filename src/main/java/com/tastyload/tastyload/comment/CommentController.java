package com.tastyload.tastyload.comment;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tastyload.tastyload.common.dto.ApiResponse;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/comments")
@Tag(name = "댓글 관리", description = "댓글 CRUD API")
public class CommentController {
    
    private final CommentService commentService;
    
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }
    
    @GetMapping("/{placeId}")
    public ResponseEntity<ApiResponse<List<CommentEntity>>> getPlaceComments(@PathVariable String placeId) {
        List<CommentEntity> comments = commentService.getPlaceComments(placeId);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }
}
