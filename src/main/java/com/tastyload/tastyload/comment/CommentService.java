package com.tastyload.tastyload.comment;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }
    
    public List<CommentEntity> getPlaceComments(String placeId) {
        return commentRepository.findByPlaceId(placeId);
    }
    
}
