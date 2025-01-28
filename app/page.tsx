import React from 'react';
import { MainContent } from './homepage-main-content/main-content';
import { HomepageNavBar } from './homepage-nav-bar/homepage-nav-bar';

const MafiaLanding = () => {
  return (
    <div className="min-h-screen bg-[#2A241D] flex flex-col">
      {/* Navigation Bar */}
      <HomepageNavBar />

      {/* Main Content */}
      <MainContent />

      {/* Footer */}
      <footer className="bg-[#1A150F] text-[#8B7355] py-6">
        <div className="container mx-auto text-center">
          <p>© 2025 Stian Inc - All rights reserved</p>
        </div>
      </footer>

    </div>
  );
};

export default MafiaLanding;