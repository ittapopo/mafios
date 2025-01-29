import React from 'react';
import TopBanner from './top-banner/top-banner';
import { LeftNavigationBar } from './left-navigation-bar/left-navigation-bar';
import { RightNavigationBar } from './right-navigation-bar/right-navigation-bar';
import TopStatsGrid from './top-stats/stat-card';
import { CharacterContent } from './character-content/character-content';

const MafiaDashboard = () => {

    return (
        <div className="min-h-screen bg-[#2A241D] flex flex-col">
            <TopBanner />
            <div className="flex flex-1">
                <LeftNavigationBar />
                <main className="flex-1 p-6 space-y-6">
                    <TopStatsGrid />
                    <CharacterContent />
                </main>
                <RightNavigationBar />

            </div>
        </div>
    );
};

export default MafiaDashboard;