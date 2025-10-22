"use client";

import { useState } from "react";
import { useGameState } from "@/app/lib/hooks";
import { Territory } from "@/app/lib/types";

export const TerritoryContent = () => {
    const { state } = useGameState();
    const territories = state.territories;
    const territoryStats = state.territoryStats;

    const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);

    const selectTerritory = (territory: Territory) => {
        setSelectedTerritory(territory);
    };

    const getStatusColor = (status: Territory['status']) => {
        switch (status) {
            case 'Controlled': return 'bg-nordic-status-success';
            case 'Contested': return 'bg-nordic-status-warning';
            case 'Enemy': return 'bg-nordic-status-danger';
            case 'Neutral': return 'bg-nordic-border';
            default: return 'bg-nordic-border';
        }
    };

    return (
        <div className="w-full h-full bg-nordic-bg p-6">
            <div className="mb-6">
                <h2 className="text-nordic-text-primary text-2xl font-bold mb-4">Territory Control</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-nordic-bg-dark p-4 rounded-lg">
                        <p className="text-nordic-text-muted text-sm">Total Territories</p>
                        <p className="text-nordic-text-primary text-2xl font-bold">{territoryStats.totalTerritories}</p>
                    </div>
                    <div className="bg-nordic-bg-dark p-4 rounded-lg">
                        <p className="text-nordic-text-muted text-sm">Controlled</p>
                        <p className="text-nordic-status-success text-2xl font-bold">{territoryStats.controlledTerritories}</p>
                    </div>
                    <div className="bg-nordic-bg-dark p-4 rounded-lg">
                        <p className="text-nordic-text-muted text-sm">Contested</p>
                        <p className="text-nordic-status-warning text-2xl font-bold">{territoryStats.contestedTerritories}</p>
                    </div>
                    <div className="bg-nordic-bg-dark p-4 rounded-lg">
                        <p className="text-nordic-text-muted text-sm">Total Income</p>
                        <p className="text-nordic-text-primary text-2xl font-bold">{territoryStats.totalIncome.toLocaleString()} SEK</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {territories.map((territory) => (
                    <div
                        key={territory.id}
                        onClick={() => selectTerritory(territory)}
                        className="bg-nordic-bg-dark p-4 rounded-lg border-2 border-nordic-border cursor-pointer hover:border-nordic-accent transition-colors"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-nordic-text-primary font-bold">{territory.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(territory.status)} text-white`}>
                                {territory.status}
                            </span>
                        </div>
                        <p className="text-nordic-text-muted text-sm mb-2">{territory.district}</p>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-nordic-text-secondary">Control:</span>
                                <span className="text-nordic-text-primary">{territory.control}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-nordic-text-secondary">Income:</span>
                                <span className="text-nordic-text-primary">{territory.income.toLocaleString()} SEK</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-nordic-text-secondary">Defense:</span>
                                <span className="text-nordic-text-primary">{territory.defenseLevel}/5</span>
                            </div>
                        </div>
                        <div className="w-full bg-nordic-bg h-2 rounded-full mt-3">
                            <div
                                className="bg-nordic-accent h-2 rounded-full transition-all"
                                style={{ width: `${territory.control}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {selectedTerritory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedTerritory(null)}>
                    <div className="bg-nordic-bg-dark p-6 rounded-lg border-2 border-nordic-accent max-w-md w-full m-4" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-nordic-text-primary text-xl font-bold mb-2">{selectedTerritory.name}</h3>
                        <p className="text-nordic-text-secondary mb-4">{selectedTerritory.district}</p>
                        <p className="text-nordic-text-secondary text-sm mb-4">{selectedTerritory.description}</p>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-nordic-text-secondary">Status:</span>
                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedTerritory.status)} text-white`}>
                                    {selectedTerritory.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-nordic-text-secondary">Control:</span>
                                <span className="text-nordic-text-primary">{selectedTerritory.control}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-nordic-text-secondary">Income:</span>
                                <span className="text-nordic-text-primary">{selectedTerritory.income.toLocaleString()} SEK/hour</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-nordic-text-secondary">Defense Level:</span>
                                <span className="text-nordic-text-primary">{selectedTerritory.defenseLevel}/5</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => console.log(`Attacking ${selectedTerritory.name}`)}
                                className="flex-1 py-2 text-sm font-medium bg-nordic-status-danger text-white rounded-lg hover:opacity-80"
                            >
                                Attack
                            </button>
                            <button
                                onClick={() => console.log(`Defending ${selectedTerritory.name}`)}
                                className="flex-1 py-2 text-sm font-medium bg-nordic-accent text-white rounded-lg hover:opacity-80"
                            >
                                Defend
                            </button>
                            <button
                                onClick={() => setSelectedTerritory(null)}
                                className="flex-1 py-2 text-sm font-medium bg-nordic-border text-nordic-text-primary rounded-lg hover:opacity-80"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
