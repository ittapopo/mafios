/**
 * Mock territory data - Scandinavian cities and districts
 * Based on real Nordic urban areas where organized crime is present
 */

import { Territory, TerritoryStats } from '../../types';

export const mockTerritories: Territory[] = [
    {
        id: 'stockholm-sodermalm',
        name: 'Södermalm',
        district: 'Stockholm',
        status: 'Controlled',
        control: 95,
        income: 45000,
        defenseLevel: 4,
        description: 'Historic district with MC clubhouse presence',
    },
    {
        id: 'stockholm-frihamnen',
        name: 'Frihamnen Port',
        district: 'Stockholm',
        status: 'Controlled',
        control: 88,
        income: 75000,
        defenseLevel: 5,
        description: 'Strategic port access for Baltic smuggling routes',
    },
    {
        id: 'malmo-rosengard',
        name: 'Rosengård',
        district: 'Malmö',
        status: 'Contested',
        control: 65,
        income: 30000,
        defenseLevel: 3,
        description: 'High-crime area, disputed with local gangs',
    },
    {
        id: 'copenhagen-vesterbro',
        name: 'Vesterbro',
        district: 'Copenhagen',
        status: 'Controlled',
        control: 78,
        income: 55000,
        defenseLevel: 3,
        description: 'Red light district with protection rackets',
    },
    {
        id: 'oslo-grunerlokka',
        name: 'Grünerløkka',
        district: 'Oslo',
        status: 'Enemy',
        control: 20,
        income: 0,
        defenseLevel: 1,
        description: 'Rival MC chapter stronghold',
    },
    {
        id: 'gothenburg-hisingen',
        name: 'Hisingen',
        district: 'Gothenburg',
        status: 'Neutral',
        control: 0,
        income: 0,
        defenseLevel: 0,
        description: 'Industrial area, expansion opportunity',
    },
];

export const mockTerritoryStats: TerritoryStats = {
    totalTerritories: 12,
    controlledTerritories: 8,
    contestedTerritories: 2,
    totalIncome: 450000, // SEK (Swedish Kronor)
};
