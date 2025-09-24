import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">니</span>
              </div>
              <span className="text-xl font-bold">니맛내맛</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              상황·감정·테마별 맛집 플레이리스트를 공유하고 탐색하는 커뮤니티 플랫폼입니다.
              RAG 기반 챗봇으로 당신만의 특별한 맛집을 발견해보세요.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@nimatnaemat.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/places" className="text-gray-400 hover:text-white transition-colors">
                  맛집 둘러보기
                </Link>
              </li>
              <li>
                <Link to="/playlists" className="text-gray-400 hover:text-white transition-colors">
                  플레이리스트
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-gray-400 hover:text-white transition-colors">
                  맛집 추천 챗봇
                </Link>
              </li>
              <li>
                <Link to="/playlists/create" className="text-gray-400 hover:text-white transition-colors">
                  플레이리스트 만들기
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">지원</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  도움말
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  문의하기
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  이용약관
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 니맛내맛. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> by the team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
