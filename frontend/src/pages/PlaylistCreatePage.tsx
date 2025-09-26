import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, X, Search, Navigation, MapPin } from 'lucide-react';
import { usePlaylistsStore } from '../stores/playlists.store';
import { useAuthStore } from '../stores/auth.store';
import { usePlacesStore } from '../stores/places.store';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import KakaoMap from '../components/map/KakaoMap';
import type { CreatePlaceGroupDto, Place } from '../types';
import type { MapLocation, RestaurantSearchResult } from '../types/kakao';
import { convertRestaurantToPlace } from '../utils/placeConverter';

interface PlaylistFormData {
  name: string;
  description: string;
}

const PlaylistCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { createPlaylist, isLoading } = usePlaylistsStore();
  const { places, fetchAllPlaces } = usePlacesStore();
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [showPlaceSelector, setShowPlaceSelector] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [mapMode, setMapMode] = useState<'location' | 'restaurant'>('restaurant');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlaylistFormData>();

  React.useEffect(() => {
    fetchAllPlaces();
    console.log('👤 현재 사용자:', user);
    console.log('🔐 인증 상태:', isAuthenticated);
  }, [fetchAllPlaces, user, isAuthenticated]);

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  // 인증 상태 확인 중이거나 인증되지 않은 경우 로딩 표시
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: PlaylistFormData) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!user.uuid) {
      alert('사용자 정보가 올바르지 않습니다. 다시 로그인해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const playlistData: CreatePlaceGroupDto = {
        name: data.name,
        description: data.description,
        userId: user.uuid,
        // 위치 정보 추가 (백엔드에서 지원하는 경우)
        ...(selectedLocation && {
          location: {
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
            address: selectedLocation.address || selectedLocation.name
          }
        }),
        // 선택된 맛집들 추가 (통합된 Place 타입 사용)
        places: selectedPlaces || []
      };

      console.log('📤 플레이리스트 생성 요청:', playlistData);
      console.log('👤 사용자 정보:', user);
      await createPlaylist(playlistData);
      console.log('✅ 플레이리스트 생성 성공');
      navigate('/playlists');
    } catch (error) {
      console.error('❌ 플레이리스트 생성 실패:', error);
      
      // 에러 메시지 표시
      if (error instanceof Error) {
        alert(`플레이리스트 생성에 실패했습니다: ${error.message}`);
      } else {
        alert('플레이리스트 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaceToggle = (place: Place) => {
    setSelectedPlaces(prev => {
      const exists = prev.find(p => p.id === place.id || p.placeId === place.placeId);
      if (exists) {
        return prev.filter(p => p.id !== place.id && p.placeId !== place.placeId);
      } else {
        return [...prev, place];
      }
    });
  };

  const removePlaceById = (placeId: string | number) => {
    setSelectedPlaces(prev => prev.filter(p => p.id !== placeId && p.placeId !== placeId));
  };

  // 위치 선택 핸들러
  const handleLocationSelect = (location: MapLocation, restaurant?: RestaurantSearchResult) => {
    setSelectedLocation(location);
    if (restaurant) {
      const place = convertRestaurantToPlace(restaurant);
      setSelectedPlaces(prev => {
        const exists = prev.find(p => p.placeId === place.placeId);
        if (!exists) {
          return [...prev, place];
        }
        return prev;
      });
    }
  };

  // 음식점 선택 핸들러
  const handleRestaurantSelect = (restaurant: RestaurantSearchResult) => {
    const place = convertRestaurantToPlace(restaurant);
    setSelectedPlaces(prev => {
      const exists = prev.find(p => p.placeId === place.placeId);
      if (!exists) {
        return [...prev, place];
      }
      return prev;
    });
  };




  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/playlists')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            돌아가기
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">새 플레이리스트 만들기</h1>
            <p className="text-gray-600 mt-1">
              나만의 테마별 맛집 플레이리스트를 만들어보세요
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* 위치 선택 */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex gap-2">
                    <Button
                      variant={mapMode === 'restaurant' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setMapMode('restaurant')}
                    >
                      <Search className="w-4 h-4 mr-1" />
                      음식점 검색
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // 현재 위치 모드로 전환하고 지도에서 현재 위치 가져오기
                        setMapMode('location');
                        // 지도 컴포넌트에서 현재 위치를 가져오도록 트리거
                        setTimeout(() => {
                          const mapElement = document.querySelector('[data-current-location-trigger]');
                          if (mapElement) {
                            mapElement.dispatchEvent(new CustomEvent('getCurrentLocation'));
                          }
                        }, 100);
                      }}
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      현재 위치
                    </Button>
                  </div>
                </div>
                
                <KakaoMap
                  onLocationSelect={handleLocationSelect}
                  onRestaurantSelect={handleRestaurantSelect}
                  initialLocation={selectedLocation || undefined}
                  height="300px"
                  showSearch={mapMode === 'restaurant'}
                />
                
                {selectedLocation && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-sm text-blue-700">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>
                        선택된 위치: {selectedLocation.address || selectedLocation.name || 
                        `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* 선택된 음식점 */}
            {selectedPlaces.length > 0 && (
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">선택된 맛집</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedPlaces.map(place => (
                      <div key={place.id || place.placeId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {place.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {place.roadAddress || place.address}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {place.category}
                          </p>
                        </div>
                        <button
                          onClick={() => removePlaceById(place.id || place.placeId || '')}
                          className="ml-2 p-1 text-gray-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* 플레이리스트 정보 폼 */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">플레이리스트 정보</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Input
                    label="플레이리스트 이름"
                    placeholder="예: 데이트하기 좋은 조용한 카페"
                    {...register('name', {
                      required: '플레이리스트 이름을 입력해주세요',
                      minLength: {
                        value: 2,
                        message: '이름은 최소 2자 이상이어야 합니다',
                      },
                      maxLength: {
                        value: 50,
                        message: '이름은 최대 50자까지 가능합니다',
                      },
                    })}
                    error={errors.name?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설명
                  </label>
                  <textarea
                    placeholder="이 플레이리스트에 대한 설명을 작성해주세요..."
                    rows={4}
                    {...register('description', {
                      maxLength: {
                        value: 500,
                        message: '설명은 최대 500자까지 가능합니다',
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/playlists')}
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      loading={isSubmitting || isLoading}
                      disabled={isSubmitting || isLoading}
                    >
                      {isSubmitting ? '생성 중...' : '플레이리스트 만들기'}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Selected Places (기존 맛집 데이터) */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">기존 맛집</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPlaceSelector(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    추가
                  </Button>
                </div>

                {selectedPlaces.filter(p => p.id).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">아직 선택된 맛집이 없습니다.</p>
                    <p className="text-xs mt-1">맛집을 추가해보세요!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedPlaces
                      .filter(place => place.id) // DB에서 가져온 맛집만 표시
                      .map(place => (
                        <div key={place.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {place.name}
                            </p>
                            {place.description && (
                              <p className="text-xs text-gray-500 truncate">
                                {place.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removePlaceById(place.id || '')}
                            className="ml-2 p-1 text-gray-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Tips */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">팁</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>명확하고 구체적인 이름을 사용하세요</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>테마나 상황을 잘 나타내는 설명을 작성하세요</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>관련된 맛집들을 추가해보세요</p>
                </div>
              </div>
            </Card>
          </div>
        </div>


        {/* Place Selector Modal */}
        {showPlaceSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">맛집 선택</h3>
                  <button
                    onClick={() => setShowPlaceSelector(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {places.map(place => {
                    const isSelected = selectedPlaces.some(p => p.id === place.id);
                    return (
                      <div
                        key={place.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePlaceToggle(place)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{place.name}</h4>
                            {place.description && (
                              <p className="text-sm text-gray-600 mt-1">{place.description}</p>
                            )}
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPlaceSelector(false)}
                >
                  취소
                </Button>
                <Button onClick={() => setShowPlaceSelector(false)}>
                  완료
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistCreatePage;
