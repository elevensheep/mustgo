package com.tastyload.tastyload.placeGroup;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tastyload.tastyload.placeGroup.entity.TagsEntity;

@Repository
public interface TagsRepository extends JpaRepository<TagsEntity, Long> {
    
}
