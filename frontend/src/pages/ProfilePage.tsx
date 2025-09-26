import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, LogOut, Settings, Heart, MapPin, Calendar } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { authService } from '../services/auth.service';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: user?.nickname || '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    setFormData({
      nickname: user.nickname || '',
    });
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await authService.updateProfile(user.uuid, formData);
      setIsEditing(false);
      // 사용자 정보 새로고침
      window.location.reload();
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-500 via-pastel-sky to-pastel-mint py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">프로필</h1>
          <p className="mt-2 text-gray-600">계정 정보를 관리하고 설정을 변경하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 프로필 정보 */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">기본 정보</h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    편집
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* 프로필 이미지 */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {isEditing ? (
                        <Input
                          name="nickname"
                          value={formData.nickname}
                          onChange={handleInputChange}
                          placeholder="닉네임을 입력하세요"
                          className="text-lg font-medium"
                        />
                      ) : (
                        user.nickname || '닉네임 없음'
                      )}
                    </h3>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* 사용자 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">사용자 ID</p>
                      <p className="text-sm font-medium text-gray-900">{user.uuid}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">가입일</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 편집 버튼들 */}
                {isEditing && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      size="sm"
                    >
                      {isLoading ? '저장 중...' : '저장'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ nickname: user.nickname || '' });
                      }}
                      size="sm"
                    >
                      취소
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 통계 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">활동 통계</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-gray-600">좋아요</span>
                  </div>
                  <span className="font-medium text-gray-900">0</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-600">등록한 맛집</span>
                  </div>
                  <span className="font-medium text-gray-900">0</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">플레이리스트</span>
                  </div>
                  <span className="font-medium text-gray-900">0</span>
                </div>
              </div>
            </Card>

            {/* 계정 관리 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 관리</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/playlists')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  내 플레이리스트
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/places')}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  내 맛집
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:border-red-300"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
