"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import TopBanner from './top-banner/top-banner';
import { LeftNavigationBar } from './left-navigation-bar/left-navigation-bar';
import { RightNavigationBar } from './right-navigation-bar/right-navigation-bar';
import TopStatsGrid from './top-stats/stat-card';
import { CharacterContent } from './character-content/character-content';
import { HeadquartersContent } from './headquarters-content/headquarters-content';
import FamilyContent from './family-content/family-content';
import { BusinessContent } from './business-content/business-content';
import { TerritoryContent } from './territory-content/territory-content';
import { DefenseContent } from './defense-content/defense-content';
import { RouteProvider, useRoute, GameProvider } from '../lib/contexts';
import { ErrorBoundary } from '../components/ErrorBoundary';

/**
 * Dashboard Content Component
 * Responsive layout with mobile, tablet, and desktop support
 */
const DashboardContent: React.FC = () => {
    const { currentRoute } = useRoute();
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (currentRoute) {
            case '/character':
                return <CharacterContent />;
            case '/headquarters':
                return <HeadquartersContent />;
            case '/family':
                return <FamilyContent />;
            case '/business':
                return <BusinessContent />;
            case '/territory':
                return <TerritoryContent />;
            case '/defense':
                return <DefenseContent />;
            default:
                return <CharacterContent />;
        }
    };

    return (
        <div className="min-h-screen bg-nordic-bg flex flex-col">
            {/* Top Banner - Always visible */}
            <TopBanner />

            {/* Mobile Menu Button */}
            <button
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-nordic-accent rounded-lg text-nordic-text-primary hover:bg-nordic-accent-dark transition-colors"
                aria-label="Toggle navigation menu"
            >
                {leftSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Main Layout Container */}
            <div className="flex flex-1 relative">
                {/* Left Sidebar - Responsive */}
                <aside
                    className={`
                        fixed lg:static inset-y-0 left-0 z-40
                        transform transition-transform duration-300 ease-in-out
                        lg:transform-none
                        ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        mt-16 lg:mt-0
                    `}
                >
                    <LeftNavigationBar />
                </aside>

                {/* Mobile Overlay */}
                {leftSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setLeftSidebarOpen(false)}
                    />
                )}

                {/* Main Content Area - Responsive padding and width */}
                <main className="flex-1 p-4 sm:p-6 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden min-w-0">
                    <TopStatsGrid />
                    {renderContent()}
                </main>

                {/* Right Sidebar - Hidden on tablet and smaller, visible on large screens */}
                <aside className="hidden xl:block">
                    <RightNavigationBar />
                </aside>
            </div>

            {/* Bottom Navigation for Mobile/Tablet (< 1024px) */}
            <div className="lg:hidden">
                <LeftNavigationBar isMobileBottom />
            </div>
        </div>
    );
};

/**
 * Main Dashboard Component
 * Provides game state, routing context, and error boundary to the entire dashboard
 */
const MafiaDashboard: React.FC = () => {
    return (
        <ErrorBoundary>
            <GameProvider>
                <RouteProvider initialRoute="/character">
                    <DashboardContent />
                </RouteProvider>
            </GameProvider>
        </ErrorBoundary>
    );
};

export default MafiaDashboard;
