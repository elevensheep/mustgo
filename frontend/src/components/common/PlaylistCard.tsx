import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Star } from 'lucide-react';
import Card from '../ui/Card';
import { useAuthStore } from '../../stores/auth.store';
import { useUserInfo } from '../../hooks/useUserInfo';
import type { PlaceGroup } from '../../types';

interface PlaylistCardProps {
  playlist: PlaceGroup;
  viewMode?: 'grid' | 'list';
}

const PlaylistCard: React.FC<PlaylistCardProps> = memo(({ playlist, viewMode = 'grid' }) => {
  const { user } = useAuthStore();
  const { userInfo, isLoading } = useUserInfo(playlist.userId);
  const isMyPlaylist = user?.uuid === playlist.userId;
  
  if (viewMode === 'list') {
    return (
      <Card hover className="overflow-hidden">
        <Link to={`/playlists/${playlist.id}`} className="flex">
          <div className="w-32 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-8 h-8 text-primary-600" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {playlist.name}
            </h3>
            {playlist.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {playlist.description}
              </p>
            )}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>
                  {isMyPlaylist 
                    ? '내 플레이리스트' 
                    : isLoading 
                      ? '로딩 중...' 
                      : userInfo?.nickname || '알 수 없는 사용자'
                  }
                </span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                <span>4.2</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              {new Date(playlist.createdAt).toLocaleDateString()}
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card hover className="overflow-hidden">
      <Link to={`/playlists/${playlist.id}`}>
        <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
          <Users className="w-12 h-12 text-primary-600" />
        </div>
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {playlist.name}
        </h3>
        {playlist.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {playlist.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>
              {isMyPlaylist 
                ? '내 플레이리스트' 
                : isLoading 
                  ? '로딩 중...' 
                  : userInfo?.nickname || '알 수 없는 사용자'
              }
            </span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            <span>4.2</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          {new Date(playlist.createdAt).toLocaleDateString()}
        </div>
      </Link>
    </Card>
  );
});

PlaylistCard.displayName = 'PlaylistCard';

export default PlaylistCard;



