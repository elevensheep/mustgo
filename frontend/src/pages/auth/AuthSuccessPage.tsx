import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const AuthSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // 토큰을 저장하고 프로필 정보를 가져옴
      localStorage.setItem('access_token', token);
      
      // 프로필 정보 가져오기
      fetch('http://localhost:8000/api/auth/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setUser(data.data);
            localStorage.setItem('user', JSON.stringify(data.data));
          }
        })
        .catch(error => {
          console.error('Failed to fetch profile:', error);
        });
    }
  }, [token, setUser]);

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="text-center">
          <div className="flex justify-center mb-6">
            {token ? (
              <CheckCircle className="w-16 h-16 text-green-500" />
            ) : (
              <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {token ? '로그인 성공!' : '로그인 처리 중...'}
          </h2>
          
          <p className="text-gray-600 mb-8">
            {token 
              ? '성공적으로 로그인되었습니다. 이제 니맛내맛의 모든 기능을 이용하실 수 있습니다.'
              : '잠시만 기다려주세요. 로그인을 처리하고 있습니다.'
            }
          </p>

          {token && (
            <Button onClick={handleContinue} className="w-full">
              시작하기
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthSuccessPage;
