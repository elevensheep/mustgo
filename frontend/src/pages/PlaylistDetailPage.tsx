import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Heart, Share2, MessageCircle, Users, Plus } from 'lucide-react';
import { usePlaylistsStore } from '../stores/playlists.store';
import { usePlacesStore } from '../stores/places.store';
import { useUserInfo } from '../hooks/useUserInfo';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PlaceCard from '../components/common/PlaceCard';
import KakaoMap from '../components/map/KakaoMap';
import type { PlaceGroup, Place, MapLocation } from '../types';

const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlaylistById } = usePlaylistsStore();
  const { places: allPlaces, fetchAllPlaces } = usePlacesStore();
  const [playlist, setPlaylist] = useState<PlaceGroup | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const { userInfo, isLoading: userLoading } = useUserInfo(playlist?.userId || '');

  // 지도에 표시할 위치 정보 계산
  const getMapLocation = (): MapLocation | null => {
    if (!playlist) return null;
    
    if (playlist.latitude && playlist.longitude) {
      return {
        lat: playlist.latitude,
        lng: playlist.longitude,
        address: playlist.address || playlist.name
      };
    }
    
    // 플레이리스트 위치가 없으면 첫 번째 맛집 위치 사용
    if (places.length > 0) {
      const firstPlace = places[0];
      return {
        lat: firstPlace.latitude,
        lng: firstPlace.longitude,
        address: firstPlace.address || firstPlace.name
      };
    }
    
    return null;
  };

  // 맛집들을 지도 마커용 데이터로 변환
  const getMapMarkers = () => {
    // 선택된 맛집이 있으면 해당 맛집만 표시, 없으면 플레이리스트에 포함된 맛집들 표시
    const placesToShow = selectedPlace ? [selectedPlace] : places;
    return placesToShow.map(place => ({
      lat: place.latitude,
      lng: place.longitude,
      title: place.name,
      address: place.address || place.roadAddress,
      category: place.category
    }));
  };

  // 모든 맛집을 지도 마커용 데이터로 변환 (전체 맛집 표시용)
  const getAllMapMarkers = () => {
    return allPlaces.map(place => ({
      lat: place.latitude,
      lng: place.longitude,
      title: place.name,
      address: place.address || place.roadAddress,
      category: place.category
    }));
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // 모든 맛집과 플레이리스트를 병렬로 가져오기
        const [playlistData] = await Promise.all([
          getPlaylistById(id),
          fetchAllPlaces()
        ]);
        
        setPlaylist(playlistData);
        
        // 플레이리스트에 포함된 맛집들 설정
        if (playlistData.items && playlistData.items.length > 0) {
          const placesData = playlistData.items.map(item => item.__place__ || item.place).filter(Boolean);
          setPlaces(placesData);
        } else {
          setPlaces([]);
        }
      } catch (err) {
        console.error('플레이리스트 조회 실패:', err);
        setError('플레이리스트를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [id, getPlaylistById, fetchAllPlaces]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: playlist?.name,
        text: playlist?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
  };

  const clearSelection = () => {
    setSelectedPlace(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">플레이리스트를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-6">{error || '요청하신 플레이리스트가 존재하지 않습니다.'}</p>
          <Button onClick={() => navigate('/playlists')}>
            플레이리스트 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/playlists')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-gray-600 mt-2">{playlist.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 플레이리스트 정보 */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">플레이리스트 정보</h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={isLiked ? 'text-red-600 border-red-600' : ''}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                      {isLiked ? '좋아요 취소' : '좋아요'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      공유
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>
                      {userLoading ? '로딩 중...' : userInfo?.nickname || '알 수 없는 사용자'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{new Date(playlist.createdAt).toLocaleDateString()}</span>
                  </div>
                  {playlist.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{playlist.location.address || '위치 정보'}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2" />
                    <span>평점 4.2</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 포함된 맛집들 */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    포함된 맛집 ({places.length}개)
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComments(!showComments)}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    댓글
                  </Button>
                </div>

                {places.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">아직 맛집이 없습니다</h3>
                    <p className="text-gray-600 mb-4">이 플레이리스트에는 아직 맛집이 추가되지 않았습니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {places.map((place) => (
                      <div
                        key={place.id || place.placeId}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedPlace?.id === place.id || selectedPlace?.placeId === place.placeId
                            ? 'ring-2 ring-primary-500 bg-primary-50'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handlePlaceClick(place)}
                      >
                        <PlaceCard
                          place={place}
                          viewMode="list"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* 지도 섹션 */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    맛집 위치 지도
                  </h2>
                  {selectedPlace && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                    >
                      전체 보기
                    </Button>
                  )}
                </div>
                <div className="rounded-lg overflow-hidden">
                  <KakaoMap
                    initialLocation={selectedPlace ? {
                      lat: selectedPlace.latitude,
                      lng: selectedPlace.longitude,
                      address: selectedPlace.address || selectedPlace.name
                    } : getMapLocation() || undefined}
                    height="500px"
                    showSearch={false}
                    markers={getMapMarkers()}
                  />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  {selectedPlace ? (
                    <div className="bg-primary-50 p-3 rounded-lg">
                      <p className="text-primary-700 font-medium">
                        선택된 맛집: {selectedPlace.name}
                      </p>
                      <p className="text-primary-600">
                        {selectedPlace.address || selectedPlace.roadAddress}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p>플레이리스트에 포함된 맛집: {places.length}개</p>
                      <p className="text-gray-500">맛집을 클릭하면 해당 위치를 지도에서 확인할 수 있습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* 통계 */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">통계</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">맛집 수</span>
                    <span className="font-medium">{places.length}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">좋아요</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">조회수</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">댓글</span>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 관련 플레이리스트 */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">관련 플레이리스트</h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-500">
                    관련 플레이리스트가 없습니다.
                  </div>
                </div>
              </div>
            </Card>

            {/* 액션 버튼들 */}
            <Card>
              <div className="p-6">
                <div className="space-y-3">
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    내 플레이리스트에 추가
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    댓글 작성
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
