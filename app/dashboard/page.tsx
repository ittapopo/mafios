"use client";

import React from 'react';
import TopBanner from './top-banner/top-banner';
import { LeftNavigationBar } from './left-navigation-bar/left-navigation-bar';
import { RightNavigationBar } from './right-navigation-bar/right-navigation-bar';
import TopStatsGrid from './top-stats/stat-card';
import { CharacterContent } from './character-content/character-content';
import { HeadquartersContent } from './headquarters-content/headquarters-content';
import FamilyContent from './family-content/family-content';
import { BusinessContent } from './business-content/business-content';
import { TerritoryContent } from './territory-content/territory-content';
import { RouteProvider, useRoute } from '../lib/contexts';
import { ErrorBoundary } from '../components/ErrorBoundary';

/**
 * Dashboard Content Component
 * Separated to use the routing context
 */
const DashboardContent: React.FC = () => {
    const { currentRoute } = useRoute();

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
                // TODO: Implement defense content
                return (
                    <div className="bg-mafia-bg-dark p-6 rounded-lg border-2 border-mafia-border-light">
                        <h2 className="text-mafia-text-primary text-2xl mb-4">Defense</h2>
                        <p className="text-mafia-text-secondary">Defense systems coming soon...</p>
                    </div>
                );
            default:
                return <CharacterContent />;
        }
    };

    return (
        <div className="min-h-screen bg-mafia-bg flex flex-col">
            <TopBanner />
            <div className="flex flex-1">
                <LeftNavigationBar />
                <main className="flex-1 p-6 space-y-6">
                    <TopStatsGrid />
                    {renderContent()}
                </main>
                <RightNavigationBar />
            </div>
        </div>
    );
};

/**
 * Main Dashboard Component
 * Provides routing context and error boundary to the entire dashboard
 */
const MafiaDashboard: React.FC = () => {
    return (
        <ErrorBoundary>
            <RouteProvider initialRoute="/character">
                <DashboardContent />
            </RouteProvider>
        </ErrorBoundary>
    );
};

export default MafiaDashboard;
