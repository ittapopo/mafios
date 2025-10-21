/**
 * Mock family data
 */

import { FamilyMember, FamilyStats } from '../../types';

export const mockFamilyMembers: FamilyMember[] = [
    {
        role: 'Brother',
        name: 'Tony',
        status: 'Active',
        traits: ['Diplomatic', 'Wealthy'],
        loyalty: 95,
        skills: {
            combat: 7,
            stealth: 5,
            charisma: 9,
        },
    },
    {
        role: 'Capo',
        name: 'Salvatore',
        status: 'On Mission',
        traits: ['Ruthless', 'Strategic'],
        loyalty: 88,
        skills: {
            combat: 9,
            stealth: 6,
            charisma: 7,
        },
    },
    {
        role: 'Soldier',
        name: 'Marco',
        status: 'Active',
        traits: ['Loyal', 'Strong'],
        loyalty: 92,
        skills: {
            combat: 8,
            stealth: 4,
            charisma: 5,
        },
    },
    {
        role: 'Consigliere',
        name: 'Giovanni',
        status: 'Active',
        traits: ['Wise', 'Connected'],
        loyalty: 97,
        skills: {
            combat: 4,
            stealth: 7,
            charisma: 10,
        },
    },
];

export const mockFamilyStats: FamilyStats[] = [
    { label: 'Total Members', value: 42 },
    { label: 'Active Soldiers', value: 28 },
    { label: 'Associates', value: 14 },
    { label: 'Average Loyalty', value: '91%' },
    { label: 'Family Wealth', value: '$2.4M' },
    { label: 'Territory Count', value: 8 },
];
