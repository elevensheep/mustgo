import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import PlacesSection from '../components/sections/PlacesSection';
import PlaylistsSection from '../components/sections/PlaylistsSection';
import CTASection from '../components/sections/CTASection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <FeaturesSection />
      <PlacesSection />
      <PlaylistsSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
