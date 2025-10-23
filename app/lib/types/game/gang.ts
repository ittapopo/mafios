/**
 * Rival Gang and Gang Event Types
 */

export type RelationStatus = 'Hostile' | 'Neutral' | 'Truce' | 'Allied';

export type GangEventType = 'attack' | 'raid' | 'challenge' | 'offer' | 'peace_offer' | 'betrayal';

export interface RivalGang {
    id: string;
    name: string;
    logo: string; // Emoji or icon identifier
    description: string;
    color: string; // For UI theming

    // Stats
    strength: number; // Overall power (1-100)
    controlledTerritories: string[]; // Territory IDs
    memberCount: number;
    wealth: number; // Approximate kontanter

    // Relationship
    hostility: number; // -100 (war) to 100 (alliance)
    relationStatus: RelationStatus;

    // Activity
    lastAttack?: number; // Timestamp
    nextAttackProbability: number; // 0-100%
    aggressiveness: number; // How likely they are to attack (1-100)
}

export interface GangEvent {
    id: string;
    type: GangEventType;
    gangId: string;
    timestamp: number;

    // Event details
    targetTerritoryId?: string;
    targetBusinessId?: string;
    targetMemberId?: string;

    // Event outcome requirements
    strengthRequired?: number;
    cashDemand?: number;
    territoryOffer?: string;

    // Status
    resolved: boolean;
    outcome?: 'success' | 'failure' | 'negotiated';

    // Rewards/penalties
    respektChange?: number;
    kontanterChange?: number;
    hostilityChange?: number;

    // Description
    title: string;
    description: string;
}

export interface GangStats {
    totalRivalGangs: number;
    hostileGangs: number;
    alliedGangs: number;
    activeEvents: number;
    territoriesLostToGangs: number;
}
