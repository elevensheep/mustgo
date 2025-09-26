import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Users, Filter, Plus } from 'lucide-react';
import { usePlaylistsStore } from '../stores/playlists.store';
import { useAuthStore } from '../stores/auth.store';
import Button from '../components/ui/Button';
import SearchBar from '../components/common/SearchBar';
import ViewToggle from '../components/common/ViewToggle';
import FilterPanel from '../components/common/FilterPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import PlaylistCard from '../components/common/PlaylistCard';
import useDebounce from '../hooks/useDebounce';

const PlaylistsPage: React.FC = () => {
  const { 
    playlists, 
    popularPlaylists, 
    recentPlaylists,
    isLoading, 
    error,
    fetchAllPlaylists,
    fetchPopularPlaylists,
    fetchRecentPlaylists
  } = usePlaylistsStore();
  
  const { isAuthenticated } = useAuthStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'recent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    theme: '',
    region: '',
    sort: 'recent'
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchAllPlaylists();
    fetchPopularPlaylists();
    fetchRecentPlaylists();
  }, [fetchAllPlaylists, fetchPopularPlaylists, fetchRecentPlaylists]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  }, []);

  const getBasePlaylists = useCallback(() => {
    switch (activeTab) {
      case 'popular':
        return popularPlaylists;
      case 'recent':
        return recentPlaylists;
      default:
        return playlists;
    }
  }, [activeTab, playlists, popularPlaylists, recentPlaylists]);

  const displayPlaylists = useMemo(() => {
    let result = getBasePlaylists();

    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      result = result.filter(playlist =>
        playlist.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (playlist.description && playlist.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
      );
    }

    // Apply other filters
    if (filters.theme) {
      result = result.filter(() => 
        // This would need actual theme data from the playlist object
        true // Placeholder
      );
    }
    
    if (filters.region) {
      result = result.filter(() => 
        // This would need actual region data from the playlist object
        true // Placeholder
      );
    }
    
    // Apply sorting
    switch (filters.sort) {
      case 'popular':
        result = [...result].sort((a, b) => b.id - a.id); // Placeholder
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result = [...result].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    
    return result;
  }, [getBasePlaylists, debouncedSearchQuery, filters]);

  const filterConfigs = useMemo(() => [
    {
      label: '테마',
      options: [
        { value: '', label: '전체' },
        { value: 'date', label: '데이트' },
        { value: 'family', label: '가족' },
        { value: 'business', label: '비즈니스' },
        { value: 'solo', label: '혼밥' }
      ],
      value: filters.theme,
      onChange: (value: string) => handleFilterChange('theme', value)
    },
    {
      label: '지역',
      options: [
        { value: '', label: '전체' },
        { value: 'seoul', label: '서울' },
        { value: 'busan', label: '부산' },
        { value: 'daegu', label: '대구' }
      ],
      value: filters.region,
      onChange: (value: string) => handleFilterChange('region', value)
    },
    {
      label: '정렬',
      options: [
        { value: 'recent', label: '최신순' },
        { value: 'popular', label: '인기순' },
        { value: 'name', label: '이름순' }
      ],
      value: filters.sort,
      onChange: (value: string) => handleFilterChange('sort', value)
    }
  ], [filters, handleFilterChange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-500 via-pastel-purple to-pastel-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">플레이리스트</h1>
            <p className="text-gray-600">
              테마별로 정리된 맛집 플레이리스트를 탐색해보세요
            </p>
          </div>
          {isAuthenticated && (
            <Link to="/playlists/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                새 플레이리스트
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="플레이리스트 이름으로 검색해보세요..."
              className="flex-1"
            />
            
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              필터
            </Button>
          </div>

          <FilterPanel
            filters={filterConfigs}
            isOpen={showFilters}
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            전체 ({playlists.length})
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'popular'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            인기 ({popularPlaylists.length})
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'recent'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            최신 ({recentPlaylists.length})
          </button>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner size="lg" text="플레이리스트를 불러오는 중..." />
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {searchQuery ? (
                  <>
                    <span className="font-medium">{displayPlaylists.length}</span>개의 검색 결과
                    <span className="text-primary-600"> "{searchQuery}"</span>
                  </>
                ) : (
                  <>
                    총 <span className="font-medium">{displayPlaylists.length}</span>개의 플레이리스트
                  </>
                )}
              </p>
            </div>

            {/* Playlists Grid/List */}
            {displayPlaylists.length === 0 ? (
              <EmptyState
                icon={Users}
                title={searchQuery ? '검색 결과가 없습니다' : '등록된 플레이리스트가 없습니다'}
                description={searchQuery 
                  ? '다른 검색어로 시도해보세요' 
                  : '첫 번째 플레이리스트를 만들어보세요'
                }
                action={isAuthenticated && !searchQuery ? (
                  <Link to="/playlists/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      플레이리스트 만들기
                    </Button>
                  </Link>
                ) : undefined}
              />
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {displayPlaylists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PlaylistsPage;
