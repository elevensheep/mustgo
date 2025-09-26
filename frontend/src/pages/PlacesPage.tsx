import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MapPin, Filter } from 'lucide-react';
import { usePlacesStore } from '../stores/places.store';
import Button from '../components/ui/Button';
import SearchBar from '../components/common/SearchBar';
import ViewToggle from '../components/common/ViewToggle';
import FilterPanel from '../components/common/FilterPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import PlaceCard from '../components/common/PlaceCard';
import useDebounce from '../hooks/useDebounce';

const PlacesPage: React.FC = () => {
  const { 
    places, 
    searchResults, 
    searchQuery, 
    isLoading, 
    error,
    fetchAllPlaces, 
    searchPlaces, 
    setSearchQuery,
    clearSearchResults 
  } = usePlacesStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    region: '',
    category: '',
    sort: 'recent'
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchAllPlaces();
  }, [fetchAllPlaces]);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      searchPlaces(debouncedSearchQuery);
    } else {
      clearSearchResults();
    }
  }, [debouncedSearchQuery, searchPlaces, clearSearchResults]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  }, []);

  const displayPlaces = useMemo(() => {
    let result = searchQuery ? searchResults : places;
    
    // Apply filters
    if (filters.region) {
      result = result.filter(() => 
        // This would need actual region data from the place object
        true // Placeholder
      );
    }
    
    if (filters.category) {
      result = result.filter(() => 
        // This would need actual category data from the place object
        true // Placeholder
      );
    }
    
    // Apply sorting
    switch (filters.sort) {
      case 'popular':
        result = [...result].sort((a, b) => b.id - a.id); // Placeholder
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.id - a.id); // Placeholder
        break;
      default:
        result = [...result].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    
    return result;
  }, [searchQuery, searchResults, places, filters]);

  const filterConfigs = useMemo(() => [
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
      label: '카테고리',
      options: [
        { value: '', label: '전체' },
        { value: 'korean', label: '한식' },
        { value: 'chinese', label: '중식' },
        { value: 'japanese', label: '일식' },
        { value: 'western', label: '양식' },
        { value: 'cafe', label: '카페' }
      ],
      value: filters.category,
      onChange: (value: string) => handleFilterChange('category', value)
    },
    {
      label: '정렬',
      options: [
        { value: 'recent', label: '최신순' },
        { value: 'popular', label: '인기순' },
        { value: 'rating', label: '평점순' }
      ],
      value: filters.sort,
      onChange: (value: string) => handleFilterChange('sort', value)
    }
  ], [filters, handleFilterChange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-500 via-pastel-peach to-pastel-rose">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">맛집 둘러보기</h1>
          <p className="text-gray-600">
            다양한 맛집을 탐색하고 새로운 맛집을 발견해보세요
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="맛집 이름으로 검색해보세요..."
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

        {/* Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner size="lg" text="맛집을 불러오는 중..." />
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {searchQuery ? (
                  <>
                    <span className="font-medium">{displayPlaces.length}</span>개의 검색 결과
                    <span className="text-primary-600"> "{searchQuery}"</span>
                  </>
                ) : (
                  <>
                    총 <span className="font-medium">{displayPlaces.length}</span>개의 맛집
                  </>
                )}
              </p>
            </div>

            {/* Places Grid/List */}
            {displayPlaces.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title={searchQuery ? '검색 결과가 없습니다' : '등록된 맛집이 없습니다'}
                description={searchQuery 
                  ? '다른 검색어로 시도해보세요' 
                  : '첫 번째 맛집을 등록해보세요'
                }
              />
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {displayPlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
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

export default PlacesPage;
