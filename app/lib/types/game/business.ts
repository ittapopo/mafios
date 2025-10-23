/**
 * Business-related game types
 */

export type BusinessType =
  | 'bar'
  | 'nightclub'
  | 'auto_shop'
  | 'laundromat'
  | 'restaurant'
  | 'tattoo_parlor'
  | 'pawn_shop'
  | 'gym';

export type BusinessStatus = 'available' | 'owned' | 'locked';

export interface Business {
    id: string;
    name: string;
    type: BusinessType;
    location: string;
    description: string;

    // Ownership
    status: BusinessStatus;
    purchasePrice: number;

    // Income generation
    incomePerTick: number; // Every 60 seconds
    level: number;
    maxLevel: number;
    upgradeCost: number;

    // Management
    managerId?: string; // Assigned family member ID
    efficiency: number; // 0-100, affected by manager

    // Heat & Risk
    heatGeneration: number; // Heat generated per tick
    raidRisk: number; // Probability of police raid (0-100)

    // Money Laundering (for certain businesses)
    launderingCapacity?: number; // Max SEK that can be laundered per tick
    launderingFee?: number; // % fee (e.g., 15 = 15% fee)

    // Requirements
    requiredLevel: number;
    requiredRespekt: number;
    prerequisiteBusinesses?: string[]; // Business IDs
}

export interface BusinessStats {
    totalBusinesses: number;
    ownedBusinesses: number;
    totalIncome: number;
    totalLaunderingCapacity: number;
}
