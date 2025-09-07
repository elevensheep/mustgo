package com.tastyload.tastyload.comment;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {
    
    List<CommentEntity> findByPlaceId(String placeId);
}
