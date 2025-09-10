package com.tastyload.tastyload.placeGroup;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tastyload.tastyload.placeGroup.entity.PlaceGroupItemEntity;

@Repository
public interface PlaceGroupItemRepository extends JpaRepository<PlaceGroupItemEntity, Long> {
    
}
