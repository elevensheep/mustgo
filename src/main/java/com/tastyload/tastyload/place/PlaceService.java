package com.tastyload.tastyload.place;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlaceService {
    
    private final PlaceRepository placeRepository;
    
    public PlaceService(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }
    
    public List<PlaceEntity> getAllPlaces() {
        return placeRepository.findAll();
    }
    
    public PlaceEntity getPlaceById(Integer id) {
        return placeRepository.findById(id).orElse(null);
    }
    
    // PlaceName으로 부분 검색 (포함 검색) - 정확도 높은 순으로 정렬
    public List<PlaceEntity> searchPlacesByName(String placeName) {
        List<PlaceEntity> places = placeRepository.findByPlaceNameContainingIgnoreCase(placeName);
        
        // 정확도 높은 순으로 정렬
        places.sort((p1, p2) -> {
            String name1 = p1.getPlaceName().toLowerCase();
            String name2 = p2.getPlaceName().toLowerCase();
            String searchTerm = placeName.toLowerCase();
            
            // 1. 정확히 일치하는 것 우선
            if (name1.equals(searchTerm) && !name2.equals(searchTerm)) return -1;
            if (!name1.equals(searchTerm) && name2.equals(searchTerm)) return 1;
            
            // 2. 시작하는 것 우선
            if (name1.startsWith(searchTerm) && !name2.startsWith(searchTerm)) return -1;
            if (!name1.startsWith(searchTerm) && name2.startsWith(searchTerm)) return 1;
            
            // 3. 길이가 짧은 것 우선 (더 정확할 가능성)
            if (name1.length() != name2.length()) {
                return Integer.compare(name1.length(), name2.length());
            }
            
            // 4. 알파벳 순
            return name1.compareTo(name2);
        });
        
        return places;
    }

    public PlaceEntity createPlace(PlaceEntity place) {
        // 같은 사용자가 같은 장소 이름으로 등록했는지 중복 체크
        if(place.getUser() != null && placeRepository.existsByPlaceIdAndUser(place.getPlaceId(), place.getUser())) {
            // 중복된 장소가 있으면 삭제
            PlaceEntity existingPlace = placeRepository.findByPlaceIdAndUser(place.getPlaceId(), place.getUser());
            if(existingPlace != null) {
                placeRepository.delete(existingPlace);
                return null; 
            }
        }
        // 중복이 없으면 저장
        return placeRepository.save(place);
    }
    
}
