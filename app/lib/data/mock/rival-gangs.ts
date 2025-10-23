/**
 * Mock Rival Gang Data - Nordic MC Rivals
 */

import { RivalGang } from '../../types';

export const mockRivalGangs: RivalGang[] = [
    {
        id: 'gang-1',
        name: 'Odin\'s Wolves MC',
        logo: '🐺',
        description: 'Danish-based MC with strong presence in Copenhagen. Known for their brutal enforcement and loyalty to Norse mythology.',
        color: '#8B0000', // Dark red

        // Stats
        strength: 75,
        controlledTerritories: [], // Will be linked to territory IDs
        memberCount: 45,
        wealth: 500000,

        // Relationship
        hostility: -60, // Very hostile
        relationStatus: 'Hostile',

        // Activity
        nextAttackProbability: 70,
        aggressiveness: 85,
    },
    {
        id: 'gang-2',
        name: 'Iron Ravens MC',
        logo: '🦅',
        description: 'Norwegian gang operating from Oslo. Specialists in smuggling and cross-border operations via Baltic routes.',
        color: '#2F4F4F', // Dark slate gray

        // Stats
        strength: 60,
        controlledTerritories: [],
        memberCount: 30,
        wealth: 350000,

        // Relationship
        hostility: -30, // Mildly hostile
        relationStatus: 'Neutral',

        // Activity
        nextAttackProbability: 40,
        aggressiveness: 60,
    },
    {
        id: 'gang-3',
        name: 'Fenrir Brotherhood',
        logo: '⚡',
        description: 'Malmö-based gang with ties to international crime syndicates. Aggressive expansionists who don\'t respect truces.',
        color: '#000080', // Navy blue

        // Stats
        strength: 85,
        controlledTerritories: [],
        memberCount: 60,
        wealth: 750000,

        // Relationship
        hostility: -80, // Extremely hostile
        relationStatus: 'Hostile',

        // Activity
        lastAttack: Date.now() - 86400000, // Last attacked 1 day ago
        nextAttackProbability: 85,
        aggressiveness: 95,
    },
    {
        id: 'gang-4',
        name: 'Midnight Riders MC',
        logo: '🏍️',
        description: 'Finnish MC from Helsinki. Prefer profit over violence. Open to negotiation but will defend their interests fiercely.',
        color: '#4B0082', // Indigo

        // Stats
        strength: 50,
        controlledTerritories: [],
        memberCount: 25,
        wealth: 250000,

        // Relationship
        hostility: 10, // Slightly positive
        relationStatus: 'Neutral',

        // Activity
        nextAttackProbability: 20,
        aggressiveness: 40,
    },
];
