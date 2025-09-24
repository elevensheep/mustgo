import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { usePlaylistsStore } from '../stores/playlists.store';
import { useAuthStore } from '../stores/auth.store';
import { usePlacesStore } from '../stores/places.store';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import type { CreatePlaceGroupDto } from '../types';

interface PlaylistFormData {
  name: string;
  description: string;
}

const PlaylistCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createPlaylist, isLoading } = usePlaylistsStore();
  const { places, fetchAllPlaces } = usePlacesStore();
  const [selectedPlaces, setSelectedPlaces] = useState<number[]>([]);
  const [showPlaceSelector, setShowPlaceSelector] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlaylistFormData>();

  React.useEffect(() => {
    fetchAllPlaces();
  }, [fetchAllPlaces]);

  const onSubmit = async (data: PlaylistFormData) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const playlistData: CreatePlaceGroupDto = {
        name: data.name,
        description: data.description,
        userId: user.uuid,
      };

      await createPlaylist(playlistData);
      navigate('/playlists');
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

  const handlePlaceToggle = (placeId: number) => {
    setSelectedPlaces(prev => 
      prev.includes(placeId) 
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId]
    );
  };

  const removePlace = (placeId: number) => {
    setSelectedPlaces(prev => prev.filter(id => id !== placeId));
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
          <div className="lg:col-span-2">
            <Card>
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
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    플레이리스트 만들기
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Places */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">선택된 맛집</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPlaceSelector(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  추가
                </Button>
              </div>

              {selectedPlaces.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">아직 선택된 맛집이 없습니다.</p>
                  <p className="text-xs mt-1">맛집을 추가해보세요!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedPlaces.map(placeId => {
                    const place = places.find(p => p.id === placeId);
                    if (!place) return null;
                    
                    return (
                      <div key={placeId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {place.placeName}
                          </p>
                          {place.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {place.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removePlace(placeId)}
                          className="ml-2 p-1 text-gray-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
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
                  {places.map(place => (
                    <div
                      key={place.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPlaces.includes(place.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePlaceToggle(place.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{place.placeName}</h4>
                          {place.description && (
                            <p className="text-sm text-gray-600 mt-1">{place.description}</p>
                          )}
                        </div>
                        {selectedPlaces.includes(place.id) && (
                          <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
