import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, Clock, Phone, Globe, Heart, Share2, MessageCircle, ArrowLeft } from 'lucide-react';
import { usePlacesStore } from '../stores/places.store';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import KakaoMap from '../components/map/KakaoMap';
import type { MapLocation } from '../types';

const PlaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedPlace, selectPlace, fetchAllPlaces } = usePlacesStore();
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (id) {
      // 실제로는 개별 맛집 조회 API를 호출해야 하지만, 
      // 현재는 전체 목록에서 찾는 방식으로 구현
      fetchAllPlaces().then(() => {
        const place = usePlacesStore.getState().places.find(p => p.id === parseInt(id));
        if (place) {
          selectPlace(place);
        } else {
          navigate('/places');
        }
      });
    }
  }, [id, navigate, selectPlace, fetchAllPlaces]);

  if (!selectedPlace) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedPlace.placeName,
        text: selectedPlace.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/places')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          맛집 목록으로 돌아가기
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
              {selectedPlace.imageUrl ? (
                <img
                  src={selectedPlace.imageUrl}
                  alt={selectedPlace.placeName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedPlace.placeName}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                    <span className="font-medium">4.5</span>
                    <span className="ml-2">(24개 리뷰)</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-lg transition-colors ${
                      isLiked 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {selectedPlace.description && (
                <p className="text-gray-700 mb-6">
                  {selectedPlace.description}
                </p>
              )}

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">위치</p>
                    <p className="text-sm">서울시 강남구</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">운영시간</p>
                    <p className="text-sm">11:00 - 22:00</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">전화번호</p>
                    <p className="text-sm">02-1234-5678</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">웹사이트</p>
                    <a href="#" className="text-sm text-primary-600 hover:underline">
                      웹사이트 방문
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Comments Section */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">리뷰</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  리뷰 작성
                </Button>
              </div>

              {showComments ? (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <textarea
                      placeholder="이 맛집에 대한 리뷰를 작성해주세요..."
                      className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                    <div className="flex justify-end mt-3">
                      <Button size="sm">리뷰 등록</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>아직 리뷰가 없습니다.</p>
                  <p className="text-sm">첫 번째 리뷰를 작성해보세요!</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">위치</h3>
              <div className="rounded-lg overflow-hidden">
                <KakaoMap
                  initialLocation={{
                    lat: selectedPlace.latitude,
                    lng: selectedPlace.longitude,
                    address: selectedPlace.address || selectedPlace.name
                  }}
                  height="400px"
                  showSearch={false}
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>위도: {selectedPlace.latitude}</p>
                <p>경도: {selectedPlace.longitude}</p>
                {selectedPlace.address && <p>주소: {selectedPlace.address}</p>}
              </div>
            </Card>

            {/* Related Playlists */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">관련 플레이리스트</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">데이트하기 좋은 카페</h4>
                  <p className="text-sm text-gray-600">5개 맛집</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">혼밥하기 좋은 곳</h4>
                  <p className="text-sm text-gray-600">8개 맛집</p>
                </div>
              </div>
              <Link to="/playlists" className="block mt-4 text-center text-primary-600 hover:underline">
                더 많은 플레이리스트 보기
              </Link>
            </Card>

            {/* Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">액션</h3>
              <div className="space-y-3">
                <Button className="w-full">
                  플레이리스트에 추가
                </Button>
                <Button variant="outline" className="w-full">
                  즐겨찾기
                </Button>
                <Button variant="outline" className="w-full">
                  공유하기
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;
