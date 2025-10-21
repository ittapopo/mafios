/**
 * Mock territory data
 */

import { Territory, TerritoryStats } from '../../types';

export const mockTerritories: Territory[] = [
    {
        id: 'downtown-1',
        name: 'Little Italy',
        district: 'Downtown',
        status: 'Controlled',
        control: 95,
        income: 5000,
        defenseLevel: 4,
        description: 'Historic neighborhood with strong family presence',
    },
    {
        id: 'downtown-2',
        name: 'Harbor District',
        district: 'Downtown',
        status: 'Controlled',
        control: 88,
        income: 7500,
        defenseLevel: 5,
        description: 'Strategic port access for smuggling operations',
    },
    {
        id: 'westside-1',
        name: 'Casino Row',
        district: 'Westside',
        status: 'Contested',
        control: 65,
        income: 3000,
        defenseLevel: 3,
        description: 'Gambling district under dispute',
    },
    {
        id: 'westside-2',
        name: 'Industrial Zone',
        district: 'Westside',
        status: 'Controlled',
        control: 78,
        income: 4500,
        defenseLevel: 3,
        description: 'Warehouses and manufacturing facilities',
    },
    {
        id: 'eastside-1',
        name: 'Financial District',
        district: 'Eastside',
        status: 'Enemy',
        control: 20,
        income: 0,
        defenseLevel: 1,
        description: 'Rival family stronghold',
    },
    {
        id: 'northside-1',
        name: 'Residential Quarter',
        district: 'Northside',
        status: 'Neutral',
        control: 0,
        income: 0,
        defenseLevel: 0,
        description: 'Unclaimed territory',
    },
];

export const mockTerritoryStats: TerritoryStats = {
    totalTerritories: 12,
    controlledTerritories: 8,
    contestedTerritories: 2,
    totalIncome: 45000,
};
