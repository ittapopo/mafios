"use client";

import { useState } from "react";
import { Shield, Lock, Users, Eye, CheckCircle } from "lucide-react";
import { useGameState } from "@/app/lib/hooks";

interface SecurityUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    heatReduction: number;
    icon: React.ReactNode;
    level: number;
    maxLevel: number;
}

export const DefenseContent = () => {
    const { state, removeKontanter, reducePolisbevakning, addRespekt } = useGameState();
    const [purchasedUpgrades, setPurchasedUpgrades] = useState<Record<string, number>>({});
    const [upgradeResult, setUpgradeResult] = useState<string | null>(null);

    const securityUpgrades: SecurityUpgrade[] = [
        {
            id: 'alarm-system',
            name: 'Alarm System',
            description: 'Advanced alarm system to detect police raids',
            cost: 15000,
            heatReduction: 5,
            icon: <Lock className="h-6 w-6" />,
            level: purchasedUpgrades['alarm-system'] || 0,
            maxLevel: 5,
        },
        {
            id: 'security-guards',
            name: 'Security Guards',
            description: 'Hire additional guards for clubhouse protection',
            cost: 25000,
            heatReduction: 8,
            icon: <Users className="h-6 w-6" />,
            level: purchasedUpgrades['security-guards'] || 0,
            maxLevel: 5,
        },
        {
            id: 'surveillance-system',
            name: 'Surveillance System',
            description: 'Monitor all entry points and detect threats',
            cost: 20000,
            heatReduction: 6,
            icon: <Eye className="h-6 w-6" />,
            level: purchasedUpgrades['surveillance-system'] || 0,
            maxLevel: 5,
        },
        {
            id: 'reinforced-defenses',
            name: 'Reinforced Defenses',
            description: 'Strengthen walls and install safe rooms',
            cost: 35000,
            heatReduction: 10,
            icon: <Shield className="h-6 w-6" />,
            level: purchasedUpgrades['reinforced-defenses'] || 0,
            maxLevel: 5,
        },
    ];

    const purchaseUpgrade = (upgrade: SecurityUpgrade) => {
        if (upgrade.level >= upgrade.maxLevel) {
            setUpgradeResult(`${upgrade.name} is already at maximum level!`);
            setTimeout(() => setUpgradeResult(null), 3000);
            return;
        }

        const cost = upgrade.cost * (upgrade.level + 1); // Cost increases with level

        if (state.player.kontanter < cost) {
            setUpgradeResult(`Not enough kontanter! Need ${cost.toLocaleString()} SEK`);
            setTimeout(() => setUpgradeResult(null), 3000);
            return;
        }

        // Purchase the upgrade
        removeKontanter(cost);
        reducePolisbevakning(upgrade.heatReduction);
        addRespekt(2);

        // Update purchased upgrades
        setPurchasedUpgrades(prev => ({
            ...prev,
            [upgrade.id]: (prev[upgrade.id] || 0) + 1,
        }));

        setUpgradeResult(`${upgrade.name} upgraded to level ${upgrade.level + 1}!`);
        setTimeout(() => setUpgradeResult(null), 3000);
    };

    const reduceHeat = () => {
        const cost = 10000;

        if (state.player.kontanter < cost) {
            setUpgradeResult(`Not enough kontanter! Need ${cost.toLocaleString()} SEK`);
            setTimeout(() => setUpgradeResult(null), 3000);
            return;
        }

        removeKontanter(cost);
        reducePolisbevakning(15);

        setUpgradeResult('Paid off police contacts! Heat reduced significantly.');
        setTimeout(() => setUpgradeResult(null), 3000);
    };

    return (
        <div className="bg-nordic-bg p-6">
            <div className="mb-6">
                <h2 className="text-nordic-text-primary text-2xl font-bold mb-2">Defense & Security</h2>
                <p className="text-nordic-text-secondary">
                    Upgrade your clubhouse defenses and reduce police heat
                </p>
            </div>

            {/* Current Heat Status */}
            <div className="bg-nordic-bg-dark p-6 rounded-lg border-2 border-nordic-border mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-nordic-text-primary text-xl font-semibold">Polisbevakning Status</h3>
                    <span className={`text-2xl font-bold ${
                        state.player.polisbevakning > 70 ? 'text-nordic-status-danger' :
                        state.player.polisbevakning > 40 ? 'text-nordic-status-warning' :
                        'text-nordic-status-success'
                    }`}>
                        {state.player.polisbevakning}/100
                    </span>
                </div>

                <div className="w-full bg-nordic-bg h-4 rounded-full mb-4">
                    <div
                        className={`h-4 rounded-full transition-all ${
                            state.player.polisbevakning > 70 ? 'bg-nordic-status-danger' :
                            state.player.polisbevakning > 40 ? 'bg-nordic-status-warning' :
                            'bg-nordic-status-success'
                        }`}
                        style={{ width: `${state.player.polisbevakning}%` }}
                    />
                </div>

                <p className="text-nordic-text-secondary text-sm mb-4">
                    {state.player.polisbevakning > 70 ? 'Critical! Police raids imminent. Reduce heat immediately!' :
                     state.player.polisbevakning > 40 ? 'Elevated heat. Police are watching closely.' :
                     'Low heat. Operations are relatively safe.'}
                </p>

                <button
                    onClick={reduceHeat}
                    disabled={state.player.polisbevakning < 10}
                    className="w-full py-3 bg-nordic-accent hover:bg-nordic-accent-muted text-white font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Pay Off Police Contacts (-15 Heat) - 10,000 SEK
                </button>
            </div>

            {/* Upgrade Result Notification */}
            {upgradeResult && (
                <div className="mb-6 p-4 bg-nordic-status-success/20 border border-nordic-status-success rounded-lg">
                    <p className="text-nordic-status-success font-semibold flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        {upgradeResult}
                    </p>
                </div>
            )}

            {/* Security Upgrades */}
            <div>
                <h3 className="text-nordic-text-primary text-xl font-semibold mb-4">Security Upgrades</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {securityUpgrades.map((upgrade) => {
                        const nextLevelCost = upgrade.cost * (upgrade.level + 1);
                        const isMaxLevel = upgrade.level >= upgrade.maxLevel;

                        return (
                            <div
                                key={upgrade.id}
                                className="bg-nordic-bg-dark p-6 rounded-lg border-2 border-nordic-border hover:border-nordic-accent transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="text-nordic-accent">{upgrade.icon}</div>
                                        <div>
                                            <h4 className="text-nordic-text-primary font-semibold">{upgrade.name}</h4>
                                            <p className="text-nordic-text-muted text-sm">
                                                Level {upgrade.level}/{upgrade.maxLevel}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-nordic-text-secondary text-sm mb-4">
                                    {upgrade.description}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-nordic-text-secondary">Heat Reduction:</span>
                                        <span className="text-nordic-status-success">-{upgrade.heatReduction}</span>
                                    </div>
                                    {!isMaxLevel && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-nordic-text-secondary">Next Level Cost:</span>
                                            <span className="text-nordic-text-primary font-semibold">
                                                {nextLevelCost.toLocaleString()} SEK
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => purchaseUpgrade(upgrade)}
                                    disabled={isMaxLevel}
                                    className="w-full py-2 bg-nordic-accent hover:bg-nordic-accent-muted text-white font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {isMaxLevel ? 'Max Level' : `Upgrade to Level ${upgrade.level + 1}`}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-6 p-4 bg-nordic-bg-dark rounded-lg border border-nordic-border">
                <h4 className="text-nordic-text-primary font-semibold mb-2">Defense Tips</h4>
                <ul className="space-y-2 text-nordic-text-secondary text-sm">
                    <li>• Higher security levels make police raids less likely</li>
                    <li>• Reduce heat regularly to avoid unwanted attention</li>
                    <li>• Security upgrades provide permanent heat reduction</li>
                    <li>• High heat increases crime failure rates</li>
                </ul>
            </div>
        </div>
    );
};
