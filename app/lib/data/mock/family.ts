/**
 * Mock family data - MC Chapter structure (biker gang hierarchy)
 */

import { FamilyMember, FamilyStats } from '../../types';

export const mockFamilyMembers: FamilyMember[] = [
    {
        role: 'Vice President',
        name: 'Mikael "Micke" Andersson',
        status: 'Active',
        traits: ['Strategic', 'Connected'],
        loyalty: 95,
        skills: {
            combat: 7,
            stealth: 5,
            charisma: 9,
        },
    },
    {
        role: 'Sergeant-at-Arms',
        name: 'Erik "Bulldog" Hansen',
        status: 'On Mission',
        traits: ['Ruthless', 'Fearless'],
        loyalty: 88,
        skills: {
            combat: 9,
            stealth: 6,
            charisma: 7,
        },
    },
    {
        role: 'Road Captain',
        name: 'Bjørn Sørensen',
        status: 'Active',
        traits: ['Loyal', 'Experienced'],
        loyalty: 92,
        skills: {
            combat: 8,
            stealth: 4,
            charisma: 5,
        },
    },
    {
        role: 'Secretary',
        name: 'Jonas Lindqvist',
        status: 'Active',
        traits: ['Intelligent', 'Discreet'],
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
    { label: 'Full Patch Members', value: 28 },
    { label: 'Prospects', value: 14 },
    { label: 'Average Loyalty', value: '91%' },
    { label: 'Chapter Assets', value: '18M SEK' }, // Swedish Kronor
    { label: 'Controlled Areas', value: 8 },
];
