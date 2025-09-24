import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Users } from 'lucide-react';
import Button from '../ui/Button';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            니맛내맛
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            상황·감정·테마별 맛집 플레이리스트를 공유하고 탐색하는 커뮤니티 플랫폼
          </p>
          <p className="text-lg mb-12 text-primary-200 max-w-2xl mx-auto">
            RAG 기반 챗봇이 당신의 자연어 질의에 맞는 완벽한 맛집을 추천해드립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                <MessageCircle className="w-5 h-5 mr-2" />
                맛집 추천 받기
              </Button>
            </Link>
            <Link to="/playlists">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                <Users className="w-5 h-5 mr-2" />
                플레이리스트 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
