"use client";

import { useState } from "react";
import { useGameState } from "@/app/lib/hooks";
import { Territory } from "@/app/lib/types";
import { Sword, Shield, TrendingUp } from "lucide-react";

type ActionResult = 'success' | 'failure' | null;

export const TerritoryContent = () => {
    const {
        state,
        updateTerritoryControl,
        captureTerritory,
        loseTerritory,
        removeKontanter,
        addRespekt,
        addPolisbevakning,
        addExperience
    } = useGameState();
    const territories = state.territories;
    const territoryStats = state.territoryStats;

    const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
    const [actionResult, setActionResult] = useState<ActionResult>(null);
    const [actionCooldown, setActionCooldown] = useState(false);

    const selectTerritory = (territory: Territory) => {
        setSelectedTerritory(territory);
        setActionResult(null);
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

    const attackTerritory = (territory: Territory) => {
        if (actionCooldown) return;

        // Cost to attack based on territory defense
        const attackCost = territory.defenseLevel * 10000;

        if (state.player.kontanter < attackCost) {
            alert(`Not enough cash! Need ${attackCost.toLocaleString()} SEK`);
            return;
        }

        // Calculate success chance based on player resources and territory defense
        const playerStrength = (state.player.respekt / 100) + (state.chapter.members.length / 10);
        const territoryStrength = (territory.defenseLevel / 5) + (territory.control / 100);
        const successChance = Math.min(0.9, Math.max(0.3, playerStrength / territoryStrength * 0.6));

        const success = Math.random() < successChance;

        // Deduct attack cost
        removeKontanter(attackCost);

        if (success) {
            // Successful attack
            const controlGain = territory.status === 'Enemy' ? 30 :
                               territory.status === 'Neutral' ? 50 : 20;

            const newControl = Math.min(100, territory.control + controlGain);
            updateTerritoryControl(territory.id, newControl);

            // If we reach 100% control, capture the territory
            if (newControl >= 100) {
                captureTerritory(territory.id);
            }

            // Rewards
            addRespekt(5);
            addExperience(20);
            addPolisbevakning(15); // Attacks increase heat significantly

            setActionResult('success');
        } else {
            // Failed attack - lose control and gain heat
            const controlLoss = 10;
            const newControl = Math.max(0, territory.control - controlLoss);
            updateTerritoryControl(territory.id, newControl);

            addPolisbevakning(10);

            setActionResult('failure');
        }

        // Set cooldown
        setActionCooldown(true);
        setTimeout(() => {
            setActionCooldown(false);
            setActionResult(null);
        }, 3000);
    };

    const defendTerritory = (territory: Territory) => {
        if (actionCooldown) return;

        // Cost to defend
        const defenseCost = 5000;

        if (state.player.kontanter < defenseCost) {
            alert(`Not enough cash! Need ${defenseCost.toLocaleString()} SEK`);
            return;
        }

        removeKontanter(defenseCost);

        // Defense always succeeds but with varying effectiveness
        const controlGain = 15;
        const newControl = Math.min(100, territory.control + controlGain);
        updateTerritoryControl(territory.id, newControl);

        // If we reach 100% control, solidify the territory
        if (newControl >= 100 && territory.status !== 'Controlled') {
            captureTerritory(territory.id);
        }

        // Rewards
        addRespekt(2);
        addExperience(10);
        addPolisbevakning(3); // Defense generates less heat

        setActionResult('success');

        // Set cooldown
        setActionCooldown(true);
        setTimeout(() => {
            setActionCooldown(false);
            setActionResult(null);
        }, 3000);
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
                    <div className={`bg-nordic-bg-dark p-6 rounded-lg border-2 max-w-md w-full m-4 transition-all ${
                        actionResult === 'success' ? 'border-nordic-status-success' :
                        actionResult === 'failure' ? 'border-nordic-status-danger' :
                        'border-nordic-accent'
                    }`} onClick={(e) => e.stopPropagation()}>
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
                                <span className="text-nordic-text-primary font-semibold">{selectedTerritory.control}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-nordic-text-secondary">Income:</span>
                                <span className="text-nordic-text-primary">{selectedTerritory.income.toLocaleString()} SEK/h</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-nordic-text-secondary">Defense Level:</span>
                                <span className="text-nordic-text-primary">{selectedTerritory.defenseLevel}/5</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-nordic-text-secondary">Attack Cost:</span>
                                <span className="text-nordic-text-primary">{(selectedTerritory.defenseLevel * 10000).toLocaleString()} SEK</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-nordic-text-secondary">Defense Cost:</span>
                                <span className="text-nordic-text-primary">5,000 SEK</span>
                            </div>
                        </div>

                        {actionResult && (
                            <div className={`mb-4 p-3 rounded-lg border ${
                                actionResult === 'success'
                                    ? 'bg-nordic-status-success/20 border-nordic-status-success text-nordic-status-success'
                                    : 'bg-nordic-status-danger/20 border-nordic-status-danger text-nordic-status-danger'
                            }`}>
                                <p className="text-sm font-semibold">
                                    {actionResult === 'success'
                                        ? '✓ Operation successful! Control increased.'
                                        : '✗ Operation failed. Control decreased.'}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={() => attackTerritory(selectedTerritory)}
                                disabled={actionCooldown || selectedTerritory.status === 'Controlled'}
                                className="flex-1 py-2 text-sm font-medium bg-nordic-status-danger text-white rounded-lg hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                title={selectedTerritory.status === 'Controlled' ? 'Already controlled' : 'Launch attack'}
                            >
                                <Sword className="h-4 w-4" />
                                Attack
                            </button>
                            <button
                                onClick={() => defendTerritory(selectedTerritory)}
                                disabled={actionCooldown || selectedTerritory.control >= 100}
                                className="flex-1 py-2 text-sm font-medium bg-nordic-accent text-white rounded-lg hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                title={selectedTerritory.control >= 100 ? 'Already at max control' : 'Strengthen defenses'}
                            >
                                <Shield className="h-4 w-4" />
                                Defend
                            </button>
                            <button
                                onClick={() => setSelectedTerritory(null)}
                                disabled={actionCooldown}
                                className="flex-1 py-2 text-sm font-medium bg-nordic-border text-nordic-text-primary rounded-lg hover:opacity-80 disabled:opacity-40"
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
