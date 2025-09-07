package com.tastyload.tastyload.place;

import com.tastyload.tastyload.users.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<PlaceEntity, Integer> {


    List<PlaceEntity> findByPlaceNameContainingIgnoreCase(String placeName);
    boolean existsByPlaceName(String placeName);
    boolean existsByPlaceIdAndUser(String placeId, UserEntity user);
    PlaceEntity findByPlaceIdAndUser(String placeId, UserEntity user);
}

