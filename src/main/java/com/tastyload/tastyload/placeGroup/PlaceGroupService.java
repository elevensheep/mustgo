package com.tastyload.tastyload.placeGroup;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.tastyload.tastyload.placeGroup.dto.PlaceGroupCreateRequest;
import com.tastyload.tastyload.placeGroup.entity.PlaceGroupEntity;
import com.tastyload.tastyload.placeGroup.entity.PlaceGroupItemEntity;
import com.tastyload.tastyload.placeGroup.entity.TagsEntity;
import com.tastyload.tastyload.place.PlaceEntity;
import com.tastyload.tastyload.place.PlaceRepository;
import com.tastyload.tastyload.users.UserEntity;
import com.tastyload.tastyload.users.UserRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlaceGroupService {
    
    private final PlaceGroupRepository placeGroupRepository;
    private final UserRepository userRepository;
    private final PlaceRepository placeRepository;
    private final PlaceGroupItemRepository placeGroupItemRepository;
    private final TagsRepository tagsRepository;

    public PlaceGroupService(PlaceGroupRepository placeGroupRepository, UserRepository userRepository, 
                           PlaceRepository placeRepository, PlaceGroupItemRepository placeGroupItemRepository,
                           TagsRepository tagsRepository) {
        this.placeGroupRepository = placeGroupRepository;
        this.userRepository = userRepository;
        this.placeRepository = placeRepository;
        this.placeGroupItemRepository = placeGroupItemRepository;
        this.tagsRepository = tagsRepository;
    }

    public List<PlaceGroupEntity> getAllPlaceGroups() {
        return placeGroupRepository.findAll();
    }

    @Transactional
    public PlaceGroupEntity createPlaceGroup(PlaceGroupCreateRequest request) {
        // UserEntity 조회
        UserEntity user = userRepository.findById(UUID.fromString(request.getUserId()))
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + request.getUserId()));
        
        // PlaceGroupEntity 생성
        PlaceGroupEntity placeGroup = new PlaceGroupEntity();
        placeGroup.setTitle(request.getTitle());
        placeGroup.setDescription(request.getDescription());
        placeGroup.setVisibility(request.isVisibility());
        placeGroup.setUser(user);
        placeGroup.setCreatedAt(java.time.LocalDateTime.now());
        placeGroup.setUpdatedAt(java.time.LocalDateTime.now());
        
        PlaceGroupEntity savedPlaceGroup = placeGroupRepository.save(placeGroup);
        
        // PlaceGroupItemEntity 생성
        if (request.getPlaces() != null) {
            for (PlaceGroupCreateRequest.PlaceItem placeItem : request.getPlaces()) {
                PlaceEntity place = placeRepository.findById(placeItem.getPlaceId().intValue())
                        .orElseThrow(() -> new IllegalArgumentException("장소를 찾을 수 없습니다: " + placeItem.getPlaceId()));
                
                PlaceGroupItemEntity placeGroupItem = new PlaceGroupItemEntity();
                placeGroupItem.setPlaceGroup(savedPlaceGroup);
                placeGroupItem.setPlace(place);
                placeGroupItem.setCreatedAt(java.time.LocalDateTime.now());
                placeGroupItemRepository.save(placeGroupItem);
            }
        }
        
        // TagsEntity 생성
        if (request.getTags() != null) {
            for (PlaceGroupCreateRequest.TagItem tagItem : request.getTags()) {
                TagsEntity tag = new TagsEntity();
                tag.setPlaceGroup(savedPlaceGroup);
                tag.setTag(tagItem.getTag());
                tagsRepository.save(tag);
            }
        }
        
        return savedPlaceGroup;
    }
    
}
