/**
 * Random Events & Encounters System
 *
 * Events are triggered dynamically based on game state and add unpredictability
 * to gameplay. Events can be positive (opportunities) or negative (threats).
 */

/**
 * Event types categorize different kinds of random encounters
 */
export type GameEventType =
    | 'police_raid'      // Police crackdown on operations
    | 'opportunity'      // Profitable job offers
    | 'member_issue'     // Family member problems/requests
    | 'rival_incident'   // Unexpected rival gang encounters
    | 'informant'        // Information about territories/gangs
    | 'betrayal'         // Internal betrayal or loyalty test
    | 'market_shift'     // Economic changes affecting income
    | 'territory_threat' // Territory under threat
    | 'lucky_break'      // Random positive event
    | 'inspection';      // Business inspection/audit

/**
 * Trigger conditions determine when an event can occur
 */
export interface EventTriggerConditions {
    // Resource thresholds
    minHeat?: number;
    maxHeat?: number;
    minKontanter?: number;
    maxKontanter?: number;
    minRespekt?: number;
    maxRespekt?: number;
    minInflytande?: number;
    maxInflytande?: number;

    // Asset requirements
    controlledTerritories?: number;
    ownedBusinesses?: number;
    activeOperations?: number;
    familyMembers?: number;

    // Level requirements
    minLevel?: number;
    maxLevel?: number;

    // Probability (0-100)
    probability: number;

    // Cooldown (minutes since last event of this type)
    cooldown?: number;
}

/**
 * Event consequences affect the game state
 */
export interface EventConsequences {
    kontanterChange?: number;
    respektChange?: number;
    inflytandeChange?: number;
    heatChange?: number;
    experienceChange?: number;

    // Asset changes
    territoryLoss?: string[];     // Territory IDs to lose
    businessLoss?: string[];      // Business IDs to lose
    equipmentGain?: string[];     // Equipment IDs to gain

    // Member changes
    memberLoss?: string[];        // Member IDs who leave
    memberLoyaltyChange?: Record<string, number>; // memberId -> loyalty change

    // Gang relations
    gangHostilityChange?: Record<string, number>; // gangId -> hostility change

    // Special effects
    operationsShutdown?: boolean; // Temporarily disable operations
    operationsShutdownDuration?: number; // Minutes
}

/**
 * Event choice represents a decision the player can make
 */
export interface EventChoice {
    id: string;
    label: string;
    description: string;

    // Requirements to select this choice
    requiredKontanter?: number;
    requiredInflytande?: number;
    requiredRespekt?: number;
    requiredLevel?: number;

    // Success chance (0-100)
    successChance?: number;

    // Consequences on success
    successConsequences: EventConsequences;

    // Consequences on failure (if successChance < 100)
    failureConsequences?: EventConsequences;
}

/**
 * Game event definition
 */
export interface GameEvent {
    id: string;
    type: GameEventType;

    // Event content
    title: string;
    description: string;
    flavorText?: string; // Additional narrative text

    // Icon/visual
    icon?: string; // Lucide icon name
    severity: 'low' | 'medium' | 'high' | 'critical'; // Visual importance

    // Triggering
    triggerConditions: EventTriggerConditions;

    // Choices
    choices: EventChoice[];

    // State tracking
    triggered: boolean;
    triggeredAt?: number;       // Timestamp
    lastTriggered?: number;     // Last time this event type occurred
    choiceSelected?: string;    // Choice ID
    resolved: boolean;
    resolvedAt?: number;        // Timestamp

    // Outcome
    success?: boolean;          // Did the chosen action succeed?
}

/**
 * Active event instance (minimal data for UI)
 */
export interface ActiveEvent {
    id: string;
    type: GameEventType;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    triggeredAt: number;
    choices: EventChoice[];
}

/**
 * Event history entry for tracking past events
 */
export interface EventHistoryEntry {
    eventId: string;
    type: GameEventType;
    title: string;
    triggeredAt: number;
    resolvedAt: number;
    choiceId: string;
    choiceLabel: string;
    success: boolean;
    consequences: EventConsequences;
}

/**
 * Event statistics for tracking
 */
export interface EventStats {
    totalTriggered: number;
    totalResolved: number;
    successfulOutcomes: number;
    failedOutcomes: number;

    // By type
    byType: Record<GameEventType, number>;

    // Recent events
    recentEvents: EventHistoryEntry[];
}
