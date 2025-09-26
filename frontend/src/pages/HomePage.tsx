import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import PlaylistsSection from '../components/sections/PlaylistsSection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-500 via-pastel-lavender to-pastel-mint">
      <HeroSection />
      <FeaturesSection />
      <PlaylistsSection />
    </div>
  );
};

export default HomePage;
