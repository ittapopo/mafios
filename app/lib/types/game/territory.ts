/**
 * Territory-related game types
 */

export type TerritoryStatus = 'Controlled' | 'Contested' | 'Enemy' | 'Neutral';

export interface Territory {
    id: string;
    name: string;
    district: string;
    status: TerritoryStatus;
    control: number;
    income: number;
    defenseLevel: number;
    description: string;
}

export interface TerritoryStats {
    totalTerritories: number;
    controlledTerritories: number;
    contestedTerritories: number;
    totalIncome: number;
}
