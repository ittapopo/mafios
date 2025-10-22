/**
 * Business/Crime-related game types
 */

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Very High';

export interface Crime {
    name: string;
    duration: number;
    reward: number;
    risk: RiskLevel;
}

export interface CrimeTier {
    tier: string;
    crimes: Crime[];
}
