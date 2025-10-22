/**
 * Headquarters-related game types
 */

export type SecurityStatus = 'Compromised' | 'Secured' | 'Maximum Security';

export interface SecurityLevel {
    area: string;
    level: number;
    status: SecurityStatus;
    description: string;
}

export type OperationType = 'Income' | 'Defense' | 'Offense';
export type OperationStatus = 'Active' | 'Cooldown' | 'Ready';

export interface Operation {
    id: string;
    name: string;
    type: OperationType;
    status: OperationStatus;
    efficiency: number;
    level: number;
    maxLevel: number;
    description: string;

    // Benefits per tick (60 seconds)
    incomePerTick?: number;      // SEK generated
    heatReductionPerTick?: number; // Polisbevakning reduced

    // Upgrade costs
    upgradeCost: number;
    activationCost: number;

    // Member assignment
    assignedMemberIds?: string[];
    maxMembers: number;
}
