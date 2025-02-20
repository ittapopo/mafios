"use client";

import React, { useState } from 'react';
import TopBanner from './top-banner/top-banner';
import { LeftNavigationBar } from './left-navigation-bar/left-navigation-bar';
import { RightNavigationBar } from './right-navigation-bar/right-navigation-bar';
import TopStatsGrid from './top-stats/stat-card';
import { CharacterContent } from './character-content/character-content';
import { HeadquartersContent } from './headquarters-content/headquarters-content';
import { Route } from '../lib/types';
import FamilyContent from './family-content/family-content';
import { BusinessContent } from './business-content/business-content';
import { TerritoryContent } from './territory-content/territory-content';

const MafiaDashboard: React.FC = () => {
    const [currentRoute, setCurrentRoute] = useState<Route>('/character');

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

            default:
                return <CharacterContent />;
        }
    };

    const handleRouteChange = (route: Route) => {
        setCurrentRoute(route);
    };

    return (
        <div className="min-h-screen bg-[#2A241D] flex flex-col">
            <TopBanner />
            <div className="flex flex-1">
                <LeftNavigationBar onRouteChange={handleRouteChange} currentRoute={currentRoute} />
                <main className="flex-1 p-6 space-y-6">
                    <TopStatsGrid />
                    {renderContent()}
                </main>
                <RightNavigationBar />
            </div>
        </div>
    );
};

export default MafiaDashboard;
