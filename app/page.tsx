import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, LogIn } from 'lucide-react';

const MafiaLanding = () => {
  return (
    <div className="min-h-screen bg-[#2A241D] flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-[#1A150F] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-[#D4C5B2] text-2xl font-bold">Mafios</h1>
          <div className="space-x-4">
            <Button
              variant="ghost"
              className="bg-[#8B7355] hover:bg-[#6B563D] text-[#D4C5B2]"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Button>
            <Button
              variant="ghost"
              className="bg-[#8B7355] hover:bg-[#6B563D] text-[#D4C5B2]"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto flex flex-col md:flex-row items-center justify-between py-16 px-4">
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h2 className="text-5xl font-bold text-[#D4C5B2] leading-tight">
            Welcome to the Family
          </h2>
          <p className="text-xl text-[#B8A99A]">
            Rise through the ranks, build your empire, and become the most powerful Don in the city.
          </p>
          <div className="space-x-4">
            <Button
              className="bg-[#8B7355] hover:bg-[#6B563D] text-[#D4C5B2] text-lg px-8 py-6"
            >
              Start Your Empire
            </Button>
          </div>
        </div>

        {/* Right Side - Decorative Elements */}
        <div className="md:w-1/2 mt-8 md:mt-0 relative">
          <div className="w-64 h-64 md:w-96 md:h-96 bg-[#8B7355] rounded-full opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="relative z-10">
            {/* Placeholder for mafia-themed image */}

            <div className="w-64 h-64 md:w-96 md:h-96 bg-[#4A3F32] rounded-lg shadow-2xl flex items-center justify-center">
              <img
                src="mafia.png"
                alt="Mafia Theme"
                className="rounded-lg opacity-80"
              />
            </div>
          </div>
        </div>
      </main>

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