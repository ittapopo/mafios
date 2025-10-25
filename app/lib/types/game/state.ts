/**
 * Game State Types
 *
 * Central game state interface for the entire application
 */

import { FamilyMember, FamilyStats } from './family';
import { Territory, TerritoryStats } from './territory';
import { Operation } from './headquarters';
import { EquipmentItemType, MaterialStatus, EquipmentSlot } from './character';
import { Business, BusinessStats } from './business';
import { RivalGang, GangEvent, GangStats } from './gang';
import { GameEvent, EventStats, EventHistoryEntry } from './events';

/**
 * Player statistics and resources
 */
export interface PlayerStats {
    name: string;
    level: number;
    chapter: string;
    rank: string;

    // Resources (Swedish terminology)
    kontanter: number;      // Cash
    inflytande: number;     // Influence
    respekt: number;        // Respect
    polisbevakning: number; // Police Heat (0-100)

    // Progression
    experience: number;
    experienceToNext: number;
}

/**
 * MC Chapter (organization) data
 */
export interface ChapterData {
    name: string;
    members: FamilyMember[];
    stats: FamilyStats[];
    reputation: number;
}

/**
 * Complete game state
 */
export interface GameState {
    // Player
    player: PlayerStats;

    // Chapter (Family/Organization)
    chapter: ChapterData;

    // Assets
    equipment: EquipmentItemType[];  // Currently equipped items
    inventory: EquipmentItemType[];  // Owned but not equipped items
    territories: Territory[];
    businesses: Business[];

    // Operations
    operations: Operation[];
    activeOperations: string[]; // IDs of running operations

    // Rival Gangs
    rivalGangs: RivalGang[];
    gangEvents: GangEvent[];
    activeGangEvents: string[]; // IDs of unresolved events

    // Random Events
    randomEvents: GameEvent[];
    activeEvents: string[]; // IDs of unresolved events
    eventHistory: EventHistoryEntry[];

    // Stats
    territoryStats: TerritoryStats;
    businessStats: BusinessStats;
    gangStats: GangStats;
    eventStats: EventStats;

    // Metadata
    lastSaved: number; // timestamp
    playTime: number; // total seconds played
}

/**
 * Actions that can be performed on the game state
 */
export interface GameActions {
    // Resources
    addKontanter: (amount: number) => void;
    removeKontanter: (amount: number) => void;
    addInflytande: (amount: number) => void;
    addRespekt: (amount: number) => void;
    addPolisbevakning: (amount: number) => void;
    reducePolisbevakning: (amount: number) => void;

    // Experience
    addExperience: (amount: number) => void;

    // Equipment
    addEquipment: (item: EquipmentItemType) => void;
    removeEquipment: (slot: string) => void;
    buyEquipment: (item: EquipmentItemType) => boolean;
    sellEquipment: (itemId: string) => void;
    equipItem: (itemId: string) => void;
    unequipItem: (slot: EquipmentSlot) => void;

    // Territories
    captureTerritory: (territoryId: string) => void;
    loseTerritory: (territoryId: string) => void;
    updateTerritoryControl: (territoryId: string, control: number) => void;

    // Operations
    startOperation: (operationId: string) => boolean;
    stopOperation: (operationId: string) => void;
    upgradeOperation: (operationId: string) => boolean;
    assignMemberToOperation: (operationId: string, memberId: string) => void;
    removeMemberFromOperation: (operationId: string, memberId: string) => void;

    // Family
    addMember: (member: FamilyMember) => void;
    removeMember: (memberId: string) => void;
    updateMemberLoyalty: (memberId: string, loyalty: number) => void;

    // Businesses
    purchaseBusiness: (businessId: string) => boolean;
    upgradeBusiness: (businessId: string) => boolean;
    assignManagerToBusiness: (businessId: string, memberId: string) => void;
    removeManagerFromBusiness: (businessId: string) => void;

    // Rival Gangs
    updateGangRelation: (gangId: string, hostilityChange: number) => void;
    resolveGangEvent: (eventId: string, outcome: 'success' | 'failure' | 'negotiated') => void;
    attackGang: (gangId: string) => boolean;
    negotiateWithGang: (gangId: string, offer: 'truce' | 'alliance' | 'payment') => boolean;
    generateGangEvents: () => void;

    // Random Events
    triggerEvent: (eventId: string) => void;
    resolveEvent: (eventId: string, choiceId: string) => void;
    dismissEvent: (eventId: string) => void;
    checkEventTriggers: () => void;

    // Persistence
    saveGame: () => void;
    loadGame: () => void;
    resetGame: () => void;
}

/**
 * Default initial game state
 */
export const DEFAULT_GAME_STATE: GameState = {
    player: {
        name: 'Lars "Lasse" Nordström',
        level: 1,
        chapter: 'Stockholm MC',
        rank: 'Enforcer',
        kontanter: 5000,
        inflytande: 10,
        respekt: 5,
        polisbevakning: 0,
        experience: 0,
        experienceToNext: 100,
    },
    chapter: {
        name: 'Stockholm MC',
        members: [],
        stats: [],
        reputation: 0,
    },
    equipment: [],
    inventory: [],
    territories: [],
    businesses: [],
    operations: [],
    activeOperations: [],
    rivalGangs: [],
    gangEvents: [],
    activeGangEvents: [],
    randomEvents: [],
    activeEvents: [],
    eventHistory: [],
    territoryStats: {
        totalTerritories: 12,
        controlledTerritories: 0,
        contestedTerritories: 0,
        totalIncome: 0,
    },
    businessStats: {
        totalBusinesses: 10,
        ownedBusinesses: 0,
        totalIncome: 0,
        totalLaunderingCapacity: 0,
    },
    gangStats: {
        totalRivalGangs: 4,
        hostileGangs: 0,
        alliedGangs: 0,
        activeEvents: 0,
        territoriesLostToGangs: 0,
    },
    eventStats: {
        totalTriggered: 0,
        totalResolved: 0,
        successfulOutcomes: 0,
        failedOutcomes: 0,
        byType: {
            police_raid: 0,
            opportunity: 0,
            member_issue: 0,
            rival_incident: 0,
            informant: 0,
            betrayal: 0,
            market_shift: 0,
            territory_threat: 0,
            lucky_break: 0,
            inspection: 0,
        },
        recentEvents: [],
    },
    lastSaved: Date.now(),
    playTime: 0,
};
