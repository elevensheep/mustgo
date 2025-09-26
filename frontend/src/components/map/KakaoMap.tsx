import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Search, X, Navigation } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { MapLocation, RestaurantSearchResult } from '../../types/kakao';

interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  address?: string;
  category?: string;
}

interface KakaoMapProps {
  onLocationSelect?: (location: MapLocation, restaurant?: RestaurantSearchResult) => void;
  onRestaurantSelect?: (restaurant: RestaurantSearchResult) => void;
  initialLocation?: MapLocation;
  height?: string;
  showSearch?: boolean;
  markers?: MapMarker[];
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  onLocationSelect,
  onRestaurantSelect,
  initialLocation,
  height = '400px',
  showSearch = false,
  markers = []
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const clustererRef = useRef<any>(null);
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<RestaurantSearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<MapLocation | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // 카카오 지도 API 로드 확인
  const ensureKakaoMapLoaded = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve();
        return;
      }

      // API가 로드될 때까지 대기
      let attempts = 0;
      const maxAttempts = 50;
      
      const checkAPI = () => {
        attempts++;
        
        if (window.kakao && window.kakao.maps) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('카카오 지도 API 로드에 실패했습니다.'));
        } else {
          setTimeout(checkAPI, 100);
        }
      };
      
      setTimeout(checkAPI, 100);
    });
  };

  // 지도 초기화
  const initMap = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      await ensureKakaoMapLoaded();
      
      const defaultLocation = initialLocation || { lat: 37.5665, lng: 126.9780 }; // 서울시청
      const center = new window.kakao.maps.LatLng(defaultLocation.lat, defaultLocation.lng);
      
      const options = {
        center: center,
        level: 3
      };

      mapInstance.current = new window.kakao.maps.Map(mapRef.current, options);
      
      // 클러스터러 초기화
      clustererRef.current = new window.kakao.maps.MarkerClusterer({
        map: mapInstance.current,
        averageCenter: true,
        minLevel: 10
      });

      // 지도 클릭 이벤트
      window.kakao.maps.event.addListener(mapInstance.current, 'click', (mouseEvent: any) => {
        const latlng = mouseEvent.latLng;
        const location: MapLocation = {
          lat: latlng.getLat(),
          lng: latlng.getLng()
        };
        
        setCurrentLocation(location);
        onLocationSelect?.(location);
        
        // 마커 추가
        addMarker(location);
      });

      // 초기 위치가 있으면 마커 추가
      if (initialLocation) {
        addMarker(initialLocation);
        setCurrentLocation(initialLocation);
      }

    } catch (error) {
      console.error('지도 초기화 실패:', error);
    }
  }, [initialLocation, onLocationSelect]);

  // markers prop이 변경될 때 마커 업데이트
  useEffect(() => {
    if (mapInstance.current && markers.length > 0) {
      addMarkers(markers);
    }
  }, [markers]);

  // 마커 추가
  const addMarker = (location: MapLocation) => {
    if (!mapInstance.current) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker: any) => marker.setMap(null));
    markersRef.current = [];

    const position = new window.kakao.maps.LatLng(location.lat, location.lng);
    const marker = new window.kakao.maps.Marker({
      position: position,
      title: location.name || '선택된 위치'
    });

    marker.setMap(mapInstance.current);
    markersRef.current.push(marker);

    // 지도 중심 이동
    mapInstance.current.setCenter(position);
  };

  // 여러 마커 추가 (플레이리스트 상세 페이지용)
  const addMarkers = (markerData: MapMarker[]) => {
    if (!mapInstance.current || !window.kakao?.maps) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker: any) => marker.setMap(null));
    markersRef.current = [];

    if (markerData.length === 0) return;

    // 마커들 생성
    markerData.forEach((markerInfo) => {
      const position = new window.kakao.maps.LatLng(markerInfo.lat, markerInfo.lng);
      const marker = new window.kakao.maps.Marker({
        position: position,
        title: markerInfo.title
      });

      // 인포윈도우 생성
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-size: 12px; min-width: 150px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${markerInfo.title}</div>
            ${markerInfo.address ? `<div style="color: #666;">${markerInfo.address}</div>` : ''}
            ${markerInfo.category ? `<div style="color: #999; font-size: 11px;">${markerInfo.category}</div>` : ''}
          </div>
        `
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(mapInstance.current, marker);
      });

      marker.setMap(mapInstance.current);
      markersRef.current.push(marker);
    });

    // 지도 중심을 모든 마커의 중심으로 이동
    if (markerData.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      markerData.forEach((markerInfo) => {
        bounds.extend(new window.kakao.maps.LatLng(markerInfo.lat, markerInfo.lng));
      });
      mapInstance.current.setBounds(bounds);
    }
  };

  // 음식점 검색
  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchRestaurants(searchKeyword, currentLocation || undefined);
      setSearchResults(results);
      setShowSearchResults(true);

      if (mapInstance.current && results.length > 0) {
        // 기존 검색 마커 제거
        markersRef.current.forEach((marker: any) => marker.setMap(null));
        markersRef.current = [];

        if (clustererRef.current) {
          clustererRef.current.clear();
        }

        const markers: any[] = [];
        results.forEach((restaurant, index) => {
          const location: MapLocation = {
            lat: restaurant.lat,
            lng: restaurant.lng,
            address: restaurant.address,
            name: restaurant.name
          };

          if (index === 0) {
            const moveLatLon = new window.kakao.maps.LatLng(restaurant.lat, restaurant.lng);
            mapInstance.current.setCenter(moveLatLon);
          }

          const position = new window.kakao.maps.LatLng(location.lat, location.lng);
          const marker = new window.kakao.maps.Marker({
            position: position,
            title: restaurant.name,
            clickable: true
          });

          markers.push(marker);
          markersRef.current.push(marker);

          window.kakao.maps.event.addListener(marker, 'click', () => {
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding: 5px; font-size: 12px;">${restaurant.name}</div>`
            });
            infowindow.open(mapInstance.current, marker);
          });
        });
        
        clustererRef.current.addMarkers(markers);
      }
    } catch (error) {
      console.error('음식점 검색 실패:', error);
      alert('음식점 검색에 실패했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  // 음식점 검색 함수
  const searchRestaurants = async (keyword: string, location?: MapLocation): Promise<RestaurantSearchResult[]> => {
    return new Promise((resolve, reject) => {
      const places = new window.kakao.maps.services.Places();
      
      const searchOptions: any = {
        keyword: keyword,
        category_group_code: 'FD6', // 음식점 카테고리
        page: 1,
        size: 15
      };

      if (location) {
        // 거리 제한 없이 검색
        searchOptions['x'] = location.lng.toString();
        searchOptions['y'] = location.lat.toString();
      }

      places.keywordSearch(keyword, (data: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const results: RestaurantSearchResult[] = data.map((place: any) => ({
            id: place.id,
            name: place.place_name,
            address: place.address_name,
            roadAddress: place.road_address_name,
            category: place.category_name,
            phone: place.phone,
            url: place.place_url,
            lat: parseFloat(place.y),
            lng: parseFloat(place.x),
            distance: place.distance ? parseInt(place.distance) : undefined
          }));
          resolve(results);
        } else {
          reject(new Error('검색에 실패했습니다.'));
        }
      }, searchOptions);
    });
  };

  // 검색 결과 선택
  const handleRestaurantSelect = (restaurant: RestaurantSearchResult) => {
    const location: MapLocation = {
      lat: restaurant.lat,
      lng: restaurant.lng,
      address: restaurant.address,
      name: restaurant.name
    };
    
    setCurrentLocation(location);
    onLocationSelect?.(location, restaurant);
    onRestaurantSelect?.(restaurant);
    
    // 마커 추가
    addMarker(location);
    
    // 검색 결과 숨기기
    setShowSearchResults(false);
  };

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('이 브라우저에서는 위치 서비스를 지원하지 않습니다.');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: MapLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setCurrentLocation(location);
        onLocationSelect?.(location);
        
        // 마커 추가
        addMarker(location);
        
        // 지도 중심 이동
        if (mapInstance.current) {
          const center = new window.kakao.maps.LatLng(location.lat, location.lng);
          mapInstance.current.setCenter(center);
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('위치 정보를 가져올 수 없습니다:', error);
        let message = '위치 정보를 가져올 수 없습니다.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = '위치 접근이 거부되었습니다. 브라우저 설정에서 위치 접근을 허용해주세요.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            message = '위치 요청이 시간 초과되었습니다.';
            break;
        }
        
        alert(message);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // 검색 결과 초기화
  const clearSearchResults = () => {
    setSearchResults([]);
    setShowSearchResults(false);
    
    if (clustererRef.current) {
      clustererRef.current.clear();
    }
    
    markersRef.current.forEach((marker: any) => marker.setMap(null));
    markersRef.current = [];
  };

  useEffect(() => {
    initMap();
  }, [initMap]);

  // 외부에서 현재 위치 가져오기 이벤트 리스너
  useEffect(() => {
    const handleGetCurrentLocation = () => {
      getCurrentLocation();
    };

    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.setAttribute('data-current-location-trigger', 'true');
      mapElement.addEventListener('getCurrentLocation', handleGetCurrentLocation);
    }

    return () => {
      if (mapElement) {
        mapElement.removeEventListener('getCurrentLocation', handleGetCurrentLocation);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* 검색 UI */}
      {showSearch && (
        <div className="mb-4 space-y-2">
          <div className="flex gap-2">
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="음식점 이름을 입력하세요"
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              size="sm"
            >
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
            {showSearchResults && (
              <Button
                onClick={clearSearchResults}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {/* 검색 결과 */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="max-h-48 overflow-y-auto border rounded-lg bg-white shadow-lg">
              {searchResults.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => handleRestaurantSelect(restaurant)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                >
                  <div className="font-medium text-sm">{restaurant.name}</div>
                  <div className="text-xs text-gray-500">{restaurant.roadAddress || restaurant.address}</div>
                  <div className="text-xs text-gray-400">{restaurant.category}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 지도 컨테이너 */}
      <div className="relative">
        <div
          ref={mapRef}
          style={{ height }}
          className="w-full rounded-lg border"
        />
        
        {/* 현재 위치 버튼 */}
        <Button
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="absolute top-4 right-4 z-10"
          size="sm"
          variant="outline"
        >
          {isGettingLocation ? (
            <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      {/* 현재 위치 표시 */}
      {currentLocation && (
        <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
          <MapPin className="w-4 h-4 inline mr-1" />
          {currentLocation.address || currentLocation.name || 
           `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`}
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
