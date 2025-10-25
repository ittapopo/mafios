"use client";

import { useGameState } from "@/app/lib/contexts/GameContext";
import { RivalGang, GangEvent } from "@/app/lib/types";
import { Shield, Swords, Handshake, Ban, AlertTriangle, DollarSign, Trophy, Gift, Zap } from "lucide-react";

const getRelationColor = (status: string) => {
    switch (status) {
        case 'Hostile': return 'text-red-500';
        case 'Neutral': return 'text-yellow-500';
        case 'Truce': return 'text-blue-500';
        case 'Allied': return 'text-green-500';
        default: return 'text-gray-500';
    }
};

const getRelationIcon = (status: string) => {
    switch (status) {
        case 'Hostile': return <Swords className="text-red-500" size={20} />;
        case 'Neutral': return <Shield className="text-yellow-500" size={20} />;
        case 'Truce': return <Handshake className="text-blue-500" size={20} />;
        case 'Allied': return <Handshake className="text-green-500" size={20} />;
        default: return <Ban className="text-gray-500" size={20} />;
    }
};

const getEventIcon = (type: string) => {
    switch (type) {
        case 'attack': return <Swords className="text-red-500" size={24} />;
        case 'raid': return <AlertTriangle className="text-orange-500" size={24} />;
        case 'challenge': return <Trophy className="text-yellow-500" size={24} />;
        case 'offer': return <Gift className="text-green-500" size={24} />;
        case 'peace_offer': return <Handshake className="text-blue-500" size={24} />;
        case 'betrayal': return <Zap className="text-red-600" size={24} />;
        default: return <Ban className="text-gray-500" size={24} />;
    }
};

interface GangEventCardProps {
    event: GangEvent;
    gangName: string;
}

const GangEventCard = ({ event, gangName }: GangEventCardProps) => {
    const { resolveGangEvent, state } = useGameState();

    const handleResolve = (outcome: 'success' | 'failure' | 'negotiated') => {
        resolveGangEvent(event.id, outcome);
    };

    const getEventTypeColor = () => {
        switch (event.type) {
            case 'attack':
            case 'raid':
            case 'betrayal':
                return 'border-red-500 bg-red-500/10';
            case 'challenge':
                return 'border-yellow-500 bg-yellow-500/10';
            case 'offer':
            case 'peace_offer':
                return 'border-green-500 bg-green-500/10';
            default:
                return 'border-nordic-border bg-nordic-card';
        }
    };

    const timeSinceEvent = Math.floor((Date.now() - event.timestamp) / 1000 / 60); // minutes

    return (
        <div className={`border-2 ${getEventTypeColor()} rounded-lg p-4`}>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                    {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h4 className="text-nordic-text-primary font-bold text-lg">{event.title}</h4>
                            <p className="text-nordic-text-muted text-sm">
                                {gangName} • {timeSinceEvent < 1 ? 'Just now' : `${timeSinceEvent}m ago`}
                            </p>
                        </div>
                    </div>

                    <p className="text-nordic-text-secondary mb-4">{event.description}</p>

                    {/* Event Requirements/Details */}
                    <div className="flex flex-wrap gap-3 mb-4 text-sm">
                        {event.strengthRequired && (
                            <div className="flex items-center gap-1 text-nordic-text-secondary">
                                <Shield size={16} />
                                <span>Required Strength: {Math.floor(event.strengthRequired)}</span>
                            </div>
                        )}
                        {event.cashDemand && (
                            <div className="flex items-center gap-1 text-nordic-text-secondary">
                                <DollarSign size={16} />
                                <span>Demand: {event.cashDemand.toLocaleString()} kr</span>
                            </div>
                        )}
                        {event.respektChange && (
                            <div className="flex items-center gap-1 text-nordic-text-secondary">
                                <Trophy size={16} />
                                <span>Respekt: {event.respektChange > 0 ? '+' : ''}{event.respektChange}</span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {(event.type === 'attack' || event.type === 'raid' || event.type === 'challenge' || event.type === 'betrayal') && (
                            <button
                                onClick={() => handleResolve('success')}
                                className="py-2 px-4 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-all text-sm"
                            >
                                Fight Back
                            </button>
                        )}
                        {event.type === 'raid' && event.cashDemand && (
                            <button
                                onClick={() => handleResolve('negotiated')}
                                disabled={state.player.kontanter < event.cashDemand}
                                className={`py-2 px-4 rounded font-semibold transition-all text-sm ${
                                    state.player.kontanter < event.cashDemand
                                        ? 'bg-nordic-bg-dark text-nordic-text-muted cursor-not-allowed'
                                        : 'bg-amber-600 text-white hover:bg-amber-700'
                                }`}
                            >
                                Pay Demand
                            </button>
                        )}
                        {(event.type === 'offer' || event.type === 'peace_offer') && (
                            <button
                                onClick={() => handleResolve('success')}
                                className="py-2 px-4 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition-all text-sm"
                            >
                                Accept
                            </button>
                        )}
                        <button
                            onClick={() => handleResolve('failure')}
                            className="py-2 px-4 rounded font-semibold bg-gray-600 text-white hover:bg-gray-700 transition-all text-sm"
                        >
                            Ignore
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface GangCardProps {
    gang: RivalGang;
}

const GangCard = ({ gang }: GangCardProps) => {
    const { attackGang, negotiateWithGang } = useGameState();

    const handleAttack = () => {
        const success = attackGang(gang.id);
        alert(success
            ? `Successfully attacked ${gang.name}! Gained respect but increased police heat.`
            : `Failed to attack ${gang.name}. Lost respect and increased their hostility.`
        );
    };

    const handleNegotiate = (offer: 'truce' | 'alliance' | 'payment') => {
        const success = negotiateWithGang(gang.id, offer);
        alert(success
            ? `Successfully negotiated ${offer} with ${gang.name}!`
            : `Negotiations with ${gang.name} failed.`
        );
    };

    const hostilityPercentage = ((gang.hostility + 100) / 200) * 100;
    const hostilityColor = gang.hostility <= -60 ? 'bg-red-500' :
                          gang.hostility <= -20 ? 'bg-yellow-500' :
                          gang.hostility <= 40 ? 'bg-blue-500' : 'bg-green-500';

    return (
        <div className="bg-nordic-card border border-nordic-border rounded-lg p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-4xl">{gang.logo}</span>
                    <div>
                        <h3 className="text-nordic-text-primary text-xl font-bold">{gang.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            {getRelationIcon(gang.relationStatus)}
                            <span className={`text-sm font-semibold ${getRelationColor(gang.relationStatus)}`}>
                                {gang.relationStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-nordic-text-secondary text-sm mb-4">{gang.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-nordic-bg-dark p-2 rounded">
                    <p className="text-nordic-text-muted text-xs">Strength</p>
                    <p className="text-nordic-text-primary font-semibold">{gang.strength}/100</p>
                </div>
                <div className="bg-nordic-bg-dark p-2 rounded">
                    <p className="text-nordic-text-muted text-xs">Members</p>
                    <p className="text-nordic-text-primary font-semibold">{gang.memberCount}</p>
                </div>
                <div className="bg-nordic-bg-dark p-2 rounded">
                    <p className="text-nordic-text-muted text-xs">Territories</p>
                    <p className="text-nordic-text-primary font-semibold">{gang.controlledTerritories.length}</p>
                </div>
                <div className="bg-nordic-bg-dark p-2 rounded">
                    <p className="text-nordic-text-muted text-xs">Wealth</p>
                    <p className="text-nordic-text-primary font-semibold">{(gang.wealth / 1000).toFixed(0)}K</p>
                </div>
            </div>

            {/* Hostility Meter */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-nordic-text-secondary text-sm">Hostility</span>
                    <span className="text-nordic-text-primary text-sm font-semibold">{gang.hostility}/100</span>
                </div>
                <div className="w-full bg-nordic-bg-dark rounded-full h-2">
                    <div
                        className={`${hostilityColor} h-2 rounded-full transition-all`}
                        style={{ width: `${hostilityPercentage}%` }}
                    />
                </div>
                <p className="text-nordic-text-muted text-xs mt-1">
                    {gang.hostility <= -60 ? 'At war with us' :
                     gang.hostility <= -20 ? 'Unfriendly' :
                     gang.hostility <= 40 ? 'Neutral relations' : 'Friendly alliance'}
                </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={handleAttack}
                    disabled={gang.relationStatus === 'Allied'}
                    className={`py-2 px-4 rounded font-semibold transition-all ${
                        gang.relationStatus === 'Allied'
                            ? 'bg-nordic-bg-dark text-nordic-text-muted cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                    Attack
                </button>
                <button
                    onClick={() => handleNegotiate('truce')}
                    disabled={gang.relationStatus === 'Allied' || gang.relationStatus === 'Truce'}
                    className={`py-2 px-4 rounded font-semibold transition-all ${
                        gang.relationStatus === 'Allied' || gang.relationStatus === 'Truce'
                            ? 'bg-nordic-bg-dark text-nordic-text-muted cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    Truce
                </button>
                <button
                    onClick={() => handleNegotiate('payment')}
                    className="py-2 px-4 rounded font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-all"
                >
                    Pay 50K
                </button>
                <button
                    onClick={() => handleNegotiate('alliance')}
                    disabled={gang.relationStatus === 'Allied'}
                    className={`py-2 px-4 rounded font-semibold transition-all ${
                        gang.relationStatus === 'Allied'
                            ? 'bg-nordic-bg-dark text-nordic-text-muted cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                    Alliance
                </button>
            </div>
        </div>
    );
};

export const RivalGangsContent = () => {
    const { state } = useGameState();

    const hostileGangs = state.rivalGangs.filter(g => g.relationStatus === 'Hostile');
    const neutralGangs = state.rivalGangs.filter(g => g.relationStatus === 'Neutral');
    const truceGangs = state.rivalGangs.filter(g => g.relationStatus === 'Truce');
    const alliedGangs = state.rivalGangs.filter(g => g.relationStatus === 'Allied');

    // Get active unresolved events
    const activeEvents = state.gangEvents.filter(e => !e.resolved && state.activeGangEvents.includes(e.id));

    return (
        <div className="bg-nordic-bg p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-nordic-text-primary text-2xl font-bold mb-2">Rival Gangs</h2>
                <p className="text-nordic-text-secondary">
                    Navigate the complex web of alliances and rivalries in the Nordic underworld
                </p>
            </div>

            {/* Active Events Section */}
            {activeEvents.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-nordic-text-primary text-xl font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-orange-500" size={24} />
                        Active Events
                        <span className="text-sm font-normal text-nordic-text-muted">
                            ({activeEvents.length} pending)
                        </span>
                    </h3>
                    <div className="space-y-4">
                        {activeEvents.map(event => {
                            const gang = state.rivalGangs.find(g => g.id === event.gangId);
                            return (
                                <GangEventCard
                                    key={event.id}
                                    event={event}
                                    gangName={gang?.name || 'Unknown Gang'}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-nordic-card border border-nordic-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="text-nordic-accent" size={20} />
                        <p className="text-nordic-text-muted text-sm">Total Gangs</p>
                    </div>
                    <p className="text-nordic-text-primary text-2xl font-bold">{state.gangStats.totalRivalGangs}</p>
                </div>

                <div className="bg-nordic-card border border-nordic-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Swords className="text-red-500" size={20} />
                        <p className="text-nordic-text-muted text-sm">Hostile</p>
                    </div>
                    <p className="text-red-500 text-2xl font-bold">{state.gangStats.hostileGangs}</p>
                </div>

                <div className="bg-nordic-card border border-nordic-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Handshake className="text-green-500" size={20} />
                        <p className="text-nordic-text-muted text-sm">Allied</p>
                    </div>
                    <p className="text-green-500 text-2xl font-bold">{state.gangStats.alliedGangs}</p>
                </div>

                <div className="bg-nordic-card border border-nordic-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Ban className="text-orange-500" size={20} />
                        <p className="text-nordic-text-muted text-sm">Active Events</p>
                    </div>
                    <p className="text-orange-500 text-2xl font-bold">{state.gangStats.activeEvents}</p>
                </div>
            </div>

            {/* Gangs by Status */}
            {hostileGangs.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-nordic-text-primary text-xl font-bold mb-4 flex items-center gap-2">
                        <Swords className="text-red-500" size={24} />
                        Hostile Gangs
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {hostileGangs.map(gang => <GangCard key={gang.id} gang={gang} />)}
                    </div>
                </div>
            )}

            {neutralGangs.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-nordic-text-primary text-xl font-bold mb-4 flex items-center gap-2">
                        <Shield className="text-yellow-500" size={24} />
                        Neutral Gangs
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {neutralGangs.map(gang => <GangCard key={gang.id} gang={gang} />)}
                    </div>
                </div>
            )}

            {truceGangs.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-nordic-text-primary text-xl font-bold mb-4 flex items-center gap-2">
                        <Handshake className="text-blue-500" size={24} />
                        Truces
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {truceGangs.map(gang => <GangCard key={gang.id} gang={gang} />)}
                    </div>
                </div>
            )}

            {alliedGangs.length > 0 && (
                <div>
                    <h3 className="text-nordic-text-primary text-xl font-bold mb-4 flex items-center gap-2">
                        <Handshake className="text-green-500" size={24} />
                        Allied Gangs
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {alliedGangs.map(gang => <GangCard key={gang.id} gang={gang} />)}
                    </div>
                </div>
            )}
        </div>
    );
};
