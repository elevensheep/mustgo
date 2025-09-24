import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import { usePlaylistsStore } from '../../stores/playlists.store';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const PlaylistsSection: React.FC = () => {
  const { popularPlaylists, isLoading, fetchPopularPlaylists } = usePlaylistsStore();

  React.useEffect(() => {
    if (popularPlaylists.length === 0) {
      fetchPopularPlaylists();
    }
  }, [popularPlaylists.length, fetchPopularPlaylists]);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" text="인기 플레이리스트를 불러오는 중..." />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              인기 플레이리스트
            </h2>
            <p className="text-gray-600">
              테마별로 정리된 맛집 플레이리스트를 탐색해보세요
            </p>
          </div>
          <Link to="/playlists">
            <Button variant="outline">
              전체 보기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {popularPlaylists.length === 0 ? (
          <EmptyState
            icon={Users}
            title="인기 플레이리스트가 없습니다"
            description="아직 등록된 플레이리스트가 없습니다. 첫 번째 플레이리스트를 만들어보세요!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularPlaylists.slice(0, 6).map((playlist) => (
              <Card key={playlist.id} hover className="overflow-hidden">
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
                    <span>플레이리스트</span>
                    <span>{new Date(playlist.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PlaylistsSection;
