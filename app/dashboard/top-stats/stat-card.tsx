"use client";

import React, { ReactNode } from 'react';
import { Users, Shield, Map, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { useGameState } from '@/app/lib/hooks';

interface StatCardProps {
    title: string;
    children: ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, children }) => (
    <div className="bg-nordic-bg-dark p-6 rounded-lg">
        <h3 className="text-nordic-text-primary text-xl mb-4">{title}</h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

// Character Stats Card - Now connected to GameContext
export const CharacterStatsCard = () => {
    const { state } = useGameState();

    return (
        <StatCard title="Player Stats">
            <div className="flex justify-between text-nordic-text-secondary">
                <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Respect
                </span>
                <span className="text-nordic-text-primary font-semibold">{state.player.respekt}/100</span>
            </div>
            <div className="flex justify-between text-nordic-text-secondary">
                <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Influence
                </span>
                <span className="text-nordic-text-primary font-semibold">{state.player.inflytande}/500</span>
            </div>
            <div className="flex justify-between text-nordic-text-secondary">
                <span className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Cash
                </span>
                <span className="text-nordic-text-primary font-semibold">{state.player.kontanter.toLocaleString()} SEK</span>
            </div>
            <div className="flex justify-between text-nordic-text-secondary">
                <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Police Heat
                </span>
                <span className={`font-semibold ${
                    state.player.polisbevakning > 70 ? 'text-nordic-status-danger' :
                    state.player.polisbevakning > 40 ? 'text-nordic-status-warning' :
                    'text-nordic-status-success'
                }`}>
                    {state.player.polisbevakning}/100
                </span>
            </div>
        </StatCard>
    );
};

// Chapter Members Card - Now connected to GameContext
export const ChapterMembersCard = () => {
    const { state } = useGameState();

    // Count members by role
    const totalMembers = state.chapter.members.length;
    const enforcers = state.chapter.members.filter(m => m.role === 'Enforcer').length;
    const roadCaptains = state.chapter.members.filter(m => m.role === 'Road Captain').length;

    return (
        <StatCard title="Chapter Members">
            <div className="flex items-center justify-between text-nordic-text-secondary">
                <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Members
                </span>
                <span className="text-nordic-text-primary font-semibold">{totalMembers}</span>
            </div>
            <div className="flex items-center justify-between text-nordic-text-secondary">
                <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Enforcers
                </span>
                <span className="text-nordic-text-primary font-semibold">{enforcers}</span>
            </div>
            <div className="flex items-center justify-between text-nordic-text-secondary">
                <span className="flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    Road Captains
                </span>
                <span className="text-nordic-text-primary font-semibold">{roadCaptains}</span>
            </div>
        </StatCard>
    );
};

// Territory Control Card - Now connected to GameContext
export const TerritoryControlCard = () => {
    const { state } = useGameState();
    const stats = state.territoryStats;

    return (
        <StatCard title="Territory Control">
            <div className="flex items-center justify-between text-nordic-text-secondary">
                <span className="flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    Controlled
                </span>
                <span className="text-nordic-text-primary font-semibold">{stats.controlledTerritories}/{stats.totalTerritories}</span>
            </div>
            <div className="flex items-center justify-between text-nordic-text-secondary">
                <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Contested
                </span>
                <span className="text-nordic-status-warning font-semibold">{stats.contestedTerritories}</span>
            </div>
            <div className="flex items-center justify-between text-nordic-text-secondary">
                <span className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Income
                </span>
                <span className="text-nordic-text-primary font-semibold">{stats.totalIncome.toLocaleString()} SEK/h</span>
            </div>
        </StatCard>
    );
};

// Stats Grid Container
export const TopStatsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CharacterStatsCard />
        <ChapterMembersCard />
        <TerritoryControlCard />
    </div>
);

export default TopStatsGrid;