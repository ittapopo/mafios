"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Zap } from 'lucide-react';
import { useGameState } from '@/app/lib/contexts';

const TopBannerClient = () => {
    const router = useRouter();
    const { state } = useGameState();

    const handleLogout = () => {
        router.push('/');
    };

    // Count active events
    const activeEventsCount = state.randomEvents?.filter(
        event => event.triggered && !event.resolved
    ).length ?? 0;

    return (
        <div className="absolute top-4 right-4 flex items-center gap-4">
            {/* Event Notification Badge */}
            {activeEventsCount > 0 && (
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-2 animate-pulse">
                    <Zap size={16} className="text-red-400" />
                    <span className="text-red-300 font-semibold text-sm">
                        {activeEventsCount} {activeEventsCount === 1 ? 'Händelse' : 'Händelser'}
                    </span>
                </div>
            )}

            <button
                onClick={handleLogout}
                className="flex items-center text-[#D4C5B2] hover:text-white"
            >
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
        </div>
    );
};

export default TopBannerClient;