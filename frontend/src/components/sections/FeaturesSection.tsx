import React from 'react';
import { MessageCircle, Users, MapPin } from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'AI 맛집 추천',
    description: '"데이트하기 좋은 조용한 카페" 같은 자연어로 원하는 맛집을 찾아보세요'
  },
  {
    icon: Users,
    title: '커뮤니티 플레이리스트',
    description: '다른 사용자들이 만든 테마별 맛집 플레이리스트를 탐색하고 공유하세요'
  },
  {
    icon: MapPin,
    title: '발견의 즐거움',
    description: '새로운 맛집을 발견하고 나만의 특별한 플레이리스트를 만들어보세요'
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            왜 니맛내맛일까요?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            기존의 가게 단위 검색을 넘어서, 상황과 감정에 맞는 맛집을 발견하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
