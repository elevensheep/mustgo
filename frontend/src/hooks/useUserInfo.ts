import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import type { User } from '../types';

interface UserInfoCache {
  [userId: string]: User;
}

const userInfoCache: UserInfoCache = {};

export const useUserInfo = (userId: string) => {
  const [userInfo, setUserInfo] = useState<User | null>(userInfoCache[userId] || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    // 캐시에 있으면 바로 반환
    if (userInfoCache[userId]) {
      setUserInfo(userInfoCache[userId]);
      return;
    }

    // 캐시에 없으면 API 호출
    setIsLoading(true);
    setError(null);
    
    authService.getUserById(userId)
      .then((user) => {
        userInfoCache[userId] = user;
        setUserInfo(user);
      })
      .catch((err) => {
        console.error('사용자 정보 조회 실패:', err);
        setError('사용자 정보를 불러올 수 없습니다.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId]);

  return { userInfo, isLoading, error };
};
