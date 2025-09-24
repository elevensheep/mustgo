import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const AuthErrorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || '알 수 없는 오류가 발생했습니다.';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            로그인 실패
          </h2>
          
          <p className="text-gray-600 mb-8">
            {message}
          </p>

          <div className="space-y-4">
            <Link to="/auth/login" className="block">
              <Button className="w-full">
                다시 로그인하기
              </Button>
            </Link>
            
            <Link to="/" className="block">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthErrorPage;
