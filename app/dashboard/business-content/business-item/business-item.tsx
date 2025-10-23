"use client";

import { Business } from "@/app/lib/types";
import { useGameState } from "@/app/lib/contexts/GameContext";
import { Building2, TrendingUp, AlertTriangle, Lock, Crown, Users } from "lucide-react";

interface BusinessItemProps {
    business: Business;
}

export const BusinessItem = ({ business }: BusinessItemProps) => {
    const { state, purchaseBusiness, upgradeBusiness, assignManagerToBusiness, removeManagerFromBusiness } = useGameState();

    const canAfford = state.player.kontanter >= business.purchasePrice;
    const meetsLevelReq = state.player.level >= business.requiredLevel;
    const meetsRespektReq = state.player.respekt >= business.requiredRespekt;
    const meetsPrerequisites = business.prerequisiteBusinesses?.every(prereqId =>
        state.businesses.find(b => b.id === prereqId)?.status === 'owned'
    ) ?? true;

    const isOwned = business.status === 'owned';
    const isLocked = business.status === 'locked';
    const canPurchase = !isOwned && !isLocked && canAfford && meetsLevelReq && meetsRespektReq && meetsPrerequisites;

    const canUpgrade = isOwned && business.level < business.maxLevel && state.player.kontanter >= (business.upgradeCost * business.level);

    const availableManagers = state.chapter.members.filter(m =>
        !state.businesses.some(b => b.managerId === m.id)
    );

    const assignedManager = state.chapter.members.find(m => m.id === business.managerId);

    const handlePurchase = () => {
        if (canPurchase) {
            purchaseBusiness(business.id);
        }
    };

    const handleUpgrade = () => {
        if (canUpgrade) {
            upgradeBusiness(business.id);
        }
    };

    const handleAssignManager = (memberId: string) => {
        assignManagerToBusiness(business.id, memberId);
    };

    const handleRemoveManager = () => {
        if (business.managerId) {
            removeManagerFromBusiness(business.id);
        }
    };

    const getBusinessTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            bar: 'text-amber-400',
            nightclub: 'text-purple-400',
            auto_shop: 'text-blue-400',
            laundromat: 'text-cyan-400',
            restaurant: 'text-green-400',
            tattoo_parlor: 'text-red-400',
            pawn_shop: 'text-yellow-400',
            gym: 'text-orange-400',
        };
        return colors[type] || 'text-nordic-text-secondary';
    };

    return (
        <div className={`bg-nordic-card border rounded-lg p-4 ${
            isLocked ? 'border-nordic-border opacity-60' :
            isOwned ? 'border-nordic-accent' :
            'border-nordic-border hover:border-nordic-border-light'
        } transition-all`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                    <Building2 className={`${getBusinessTypeColor(business.type)} mt-1`} size={24} />
                    <div>
                        <h3 className="text-nordic-text-primary font-bold text-lg">{business.name}</h3>
                        <p className="text-nordic-text-secondary text-sm">{business.location}</p>
                    </div>
                </div>
                {isLocked && <Lock className="text-nordic-text-muted" size={20} />}
                {isOwned && <Crown className="text-nordic-accent" size={20} />}
            </div>

            {/* Description */}
            <p className="text-nordic-text-secondary text-sm mb-4">{business.description}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-nordic-bg-dark p-2 rounded">
                    <p className="text-nordic-text-muted text-xs">Income/Tick</p>
                    <p className="text-nordic-text-primary font-semibold">
                        {Math.floor(business.incomePerTick * (business.efficiency / 100)).toLocaleString()} kr
                    </p>
                </div>
                <div className="bg-nordic-bg-dark p-2 rounded">
                    <p className="text-nordic-text-muted text-xs">Efficiency</p>
                    <p className="text-nordic-text-primary font-semibold">{business.efficiency}%</p>
                </div>
                <div className="bg-nordic-bg-dark p-2 rounded">
                    <p className="text-nordic-text-muted text-xs">Heat</p>
                    <p className="text-orange-400 font-semibold">+{business.heatGeneration}/tick</p>
                </div>
                <div className="bg-nordic-bg-dark p-2 rounded">
                    <p className="text-nordic-text-muted text-xs">Raid Risk</p>
                    <p className="text-red-400 font-semibold">{business.raidRisk}%</p>
                </div>
            </div>

            {/* Laundering Info */}
            {business.launderingCapacity && (
                <div className="bg-blue-950/30 border border-blue-900/50 p-2 rounded mb-4">
                    <p className="text-blue-300 text-xs font-semibold mb-1">Money Laundering</p>
                    <div className="flex justify-between text-xs">
                        <span className="text-nordic-text-secondary">Capacity:</span>
                        <span className="text-nordic-text-primary">{business.launderingCapacity?.toLocaleString()} kr/tick</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-nordic-text-secondary">Fee:</span>
                        <span className="text-nordic-text-primary">{business.launderingFee}%</span>
                    </div>
                </div>
            )}

            {/* Level & Upgrade Info */}
            {isOwned && (
                <div className="mb-4 pb-4 border-b border-nordic-border">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-nordic-text-secondary text-sm">Level {business.level}/{business.maxLevel}</span>
                        {business.level < business.maxLevel && (
                            <span className="text-nordic-text-muted text-xs">
                                Upgrade: {(business.upgradeCost * business.level).toLocaleString()} kr
                            </span>
                        )}
                    </div>
                    <div className="w-full bg-nordic-bg-dark rounded-full h-2">
                        <div
                            className="bg-nordic-accent h-2 rounded-full transition-all"
                            style={{ width: `${(business.level / business.maxLevel) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Manager Section */}
            {isOwned && (
                <div className="mb-4 bg-nordic-bg-dark p-3 rounded">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-nordic-text-secondary" />
                        <p className="text-nordic-text-secondary text-sm font-semibold">Manager</p>
                    </div>
                    {assignedManager ? (
                        <div className="flex items-center justify-between">
                            <span className="text-nordic-text-primary text-sm">{assignedManager.name}</span>
                            <button
                                onClick={handleRemoveManager}
                                className="text-xs text-red-400 hover:text-red-300"
                            >
                                Remove
                            </button>
                        </div>
                    ) : availableManagers.length > 0 ? (
                        <select
                            onChange={(e) => e.target.value && handleAssignManager(e.target.value)}
                            className="w-full bg-nordic-bg border border-nordic-border rounded px-2 py-1 text-sm text-nordic-text-primary"
                            defaultValue=""
                        >
                            <option value="" disabled>Assign a manager (+10% efficiency)</option>
                            {availableManagers.map(member => (
                                <option key={member.id} value={member.id}>
                                    {member.name} (Loyalty: {member.loyalty})
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-nordic-text-muted text-xs italic">No available members</p>
                    )}
                </div>
            )}

            {/* Requirements */}
            {!isOwned && (
                <div className="mb-4 space-y-1">
                    <p className="text-nordic-text-muted text-xs font-semibold">Requirements:</p>
                    <div className="flex items-center gap-2 text-xs">
                        <span className={meetsLevelReq ? 'text-green-400' : 'text-red-400'}>
                            Level {business.requiredLevel}
                        </span>
                        <span className={meetsRespektReq ? 'text-green-400' : 'text-red-400'}>
                            {business.requiredRespekt} Respect
                        </span>
                    </div>
                    {business.prerequisiteBusinesses && business.prerequisiteBusinesses.length > 0 && (
                        <div className="text-xs">
                            <span className={meetsPrerequisites ? 'text-green-400' : 'text-red-400'}>
                                Requires other businesses
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                {!isOwned && !isLocked && (
                    <button
                        onClick={handlePurchase}
                        disabled={!canPurchase}
                        className={`flex-1 py-2 px-4 rounded font-semibold transition-all ${
                            canPurchase
                                ? 'bg-nordic-accent text-white hover:bg-nordic-accent-hover'
                                : 'bg-nordic-bg-dark text-nordic-text-muted cursor-not-allowed'
                        }`}
                    >
                        Purchase - {business.purchasePrice.toLocaleString()} kr
                    </button>
                )}
                {isOwned && business.level < business.maxLevel && (
                    <button
                        onClick={handleUpgrade}
                        disabled={!canUpgrade}
                        className={`flex-1 py-2 px-4 rounded font-semibold transition-all flex items-center justify-center gap-2 ${
                            canUpgrade
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-nordic-bg-dark text-nordic-text-muted cursor-not-allowed'
                        }`}
                    >
                        <TrendingUp size={16} />
                        Upgrade - {(business.upgradeCost * business.level).toLocaleString()} kr
                    </button>
                )}
                {isLocked && (
                    <div className="flex-1 py-2 px-4 rounded bg-nordic-bg-dark text-nordic-text-muted text-center">
                        <Lock className="inline mr-2" size={16} />
                        Locked
                    </div>
                )}
            </div>
        </div>
    );
};
