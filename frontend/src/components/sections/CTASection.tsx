import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-primary-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          지금 시작해보세요
        </h2>
        <p className="text-xl mb-8 text-primary-100">
          나만의 맛집 플레이리스트를 만들고, AI 챗봇과 함께 새로운 맛집을 발견해보세요
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth/register">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              무료로 시작하기
            </Button>
          </Link>
          <Link to="/chat">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
              챗봇 체험하기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
