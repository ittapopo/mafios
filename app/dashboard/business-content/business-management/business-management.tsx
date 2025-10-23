"use client";

import { BusinessItem } from "../business-item/business-item";
import { useGameState } from "@/app/lib/contexts/GameContext";
import { Building2, TrendingUp, Briefcase } from "lucide-react";

export const BusinessManagement = () => {
    const { state } = useGameState();

    // Group businesses by status
    const ownedBusinesses = state.businesses.filter(b => b.status === 'owned');
    const availableBusinesses = state.businesses.filter(b => b.status === 'available');
    const lockedBusinesses = state.businesses.filter(b => b.status === 'locked');

    return (
        <div className="bg-nordic-bg p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-nordic-text-primary text-2xl font-bold mb-2 flex items-center gap-3">
                    <Briefcase className="text-nordic-accent" size={28} />
                    Business Management
                </h2>
                <p className="text-nordic-text-secondary">
                    Expand your criminal empire through legitimate business fronts
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-nordic-card border border-nordic-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="text-nordic-accent" size={20} />
                        <p className="text-nordic-text-muted text-sm">Owned</p>
                    </div>
                    <p className="text-nordic-text-primary text-2xl font-bold">
                        {state.businessStats.ownedBusinesses}/{state.businessStats.totalBusinesses}
                    </p>
                </div>

                <div className="bg-nordic-card border border-nordic-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="text-green-400" size={20} />
                        <p className="text-nordic-text-muted text-sm">Total Income</p>
                    </div>
                    <p className="text-green-400 text-2xl font-bold">
                        {state.businessStats.totalIncome.toLocaleString()} kr/tick
                    </p>
                </div>

                <div className="bg-nordic-card border border-nordic-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="text-blue-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-nordic-text-muted text-sm">Laundering</p>
                    </div>
                    <p className="text-blue-400 text-2xl font-bold">
                        {state.businessStats.totalLaunderingCapacity.toLocaleString()} kr/tick
                    </p>
                </div>

                <div className="bg-nordic-card border border-nordic-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="text-amber-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-nordic-text-muted text-sm">Available Funds</p>
                    </div>
                    <p className="text-amber-400 text-2xl font-bold">
                        {state.player.kontanter.toLocaleString()} kr
                    </p>
                </div>
            </div>

            {/* Owned Businesses */}
            {ownedBusinesses.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-nordic-text-primary text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-nordic-accent">●</span> Your Businesses
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {ownedBusinesses.map((business) => (
                            <BusinessItem key={business.id} business={business} />
                        ))}
                    </div>
                </div>
            )}

            {/* Available Businesses */}
            {availableBusinesses.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-nordic-text-primary text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-green-400">●</span> Available Businesses
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {availableBusinesses.map((business) => (
                            <BusinessItem key={business.id} business={business} />
                        ))}
                    </div>
                </div>
            )}

            {/* Locked Businesses */}
            {lockedBusinesses.length > 0 && (
                <div>
                    <h3 className="text-nordic-text-primary text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-nordic-text-muted">●</span> Locked Businesses
                    </h3>
                    <p className="text-nordic-text-secondary text-sm mb-4">
                        These premium businesses require specific achievements to unlock
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {lockedBusinesses.map((business) => (
                            <BusinessItem key={business.id} business={business} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
