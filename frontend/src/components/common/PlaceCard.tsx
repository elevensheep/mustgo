import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import Card from '../ui/Card';
import type { Place } from '../../types';

interface PlaceCardProps {
  place: Place;
  viewMode?: 'grid' | 'list';
}

const PlaceCard: React.FC<PlaceCardProps> = memo(({ place, viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <Card hover className="overflow-hidden">
        <Link to={`/places/${place.id}`} className="flex">
          <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            {place.imageUrl ? (
              <img
                src={place.imageUrl}
                alt={place.placeName}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            ) : (
              <MapPin className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="ml-4 flex-1">
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
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card hover className="overflow-hidden">
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
  );
});

PlaceCard.displayName = 'PlaceCard';

export default PlaceCard;
