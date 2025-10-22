/**
 * Mock family data - MC Chapter structure (biker gang hierarchy)
 */

import { FamilyMember, FamilyStats } from '../../types';

export const mockFamilyMembers: FamilyMember[] = [
    {
        id: '1',
        role: 'Vice President',
        name: 'Mikael "Micke" Andersson',
        status: 'Active',
        traits: ['Strategic', 'Connected'],
        loyalty: 95,
        power: 85,
        actions: ['Trade', 'Negotiate', 'Influence'],
        skills: {
            combat: 7,
            stealth: 5,
            charisma: 9,
        },
    },
    {
        id: '2',
        role: 'Sergeant-at-Arms',
        name: 'Erik "Bulldog" Hansen',
        status: 'On Mission',
        traits: ['Ruthless', 'Fearless'],
        loyalty: 88,
        power: 92,
        actions: ['Command', 'Train', 'Quest'],
        skills: {
            combat: 9,
            stealth: 6,
            charisma: 7,
        },
    },
    {
        id: '3',
        role: 'Road Captain',
        name: 'Bjørn Sørensen',
        status: 'Active',
        traits: ['Loyal', 'Experienced'],
        loyalty: 92,
        power: 78,
        actions: ['Command', 'Trade', 'Quest'],
        skills: {
            combat: 8,
            stealth: 4,
            charisma: 5,
        },
    },
    {
        id: '4',
        role: 'Secretary',
        name: 'Jonas Lindqvist',
        status: 'Active',
        traits: ['Intelligent', 'Discreet'],
        loyalty: 97,
        power: 65,
        actions: ['Counsel', 'Scheme', 'Study'],
        skills: {
            combat: 4,
            stealth: 7,
            charisma: 10,
        },
    },
    {
        id: '5',
        role: 'Enforcer',
        name: 'Magnus "Magge" Berg',
        status: 'Active',
        traits: ['Brutal', 'Intimidating'],
        loyalty: 82,
        power: 88,
        actions: ['Command', 'Train', 'Scheme'],
        skills: {
            combat: 10,
            stealth: 5,
            charisma: 6,
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
