import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { usePlacesStore } from '../../stores/places.store';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const PlacesSection: React.FC = () => {
  const { popularPlaces, isLoading, fetchPopularPlaces } = usePlacesStore();

  React.useEffect(() => {
    if (popularPlaces.length === 0) {
      fetchPopularPlaces();
    }
  }, [popularPlaces.length, fetchPopularPlaces]);

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" text="인기 맛집을 불러오는 중..." />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              인기 맛집
            </h2>
            <p className="text-gray-600">
              많은 사람들이 사랑하는 맛집들을 만나보세요
            </p>
          </div>
          <Link to="/places">
            <Button variant="outline">
              전체 보기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {popularPlaces.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="인기 맛집이 없습니다"
            description="아직 등록된 맛집이 없습니다. 첫 번째 맛집을 등록해보세요!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularPlaces.slice(0, 6).map((place) => (
              <Card key={place.id} hover className="overflow-hidden">
                <Link to={`/places/${place.id}`}>
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    {place.imageUrl ? (
                      <img
                        src={place.imageUrl}
                        alt={place.placeName}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    ) : (
                      <MapPin className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {place.placeName}
                  </h3>
                  {place.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {place.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>위치 정보</span>
                    </div>
                    <div className="flex items-center text-sm text-yellow-600">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span>4.5</span>
                    </div>
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

export default PlacesSection;
