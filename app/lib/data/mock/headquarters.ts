/**
 * Mock headquarters data
 */

import { SecurityLevel, Operation } from '../../types';

export const mockSecurityLevels: SecurityLevel[] = [
    {
        area: 'Main Entrance',
        level: 4,
        status: 'Secured',
        description: 'Armed guards and metal detectors',
    },
    {
        area: 'Vault',
        level: 5,
        status: 'Maximum Security',
        description: 'Reinforced steel, biometric locks',
    },
    {
        area: 'Back Alley',
        level: 2,
        status: 'Compromised',
        description: 'Needs immediate attention',
    },
    {
        area: 'Office Floor',
        level: 3,
        status: 'Secured',
        description: 'CCTV and security patrols',
    },
];

export const mockOperations: Operation[] = [
    {
        name: 'Protection Racket',
        type: 'Income',
        status: 'Active',
        efficiency: 87,
    },
    {
        name: 'Weapons Smuggling',
        type: 'Income',
        status: 'Active',
        efficiency: 92,
    },
    {
        name: 'Perimeter Defense',
        type: 'Defense',
        status: 'Active',
        efficiency: 78,
    },
    {
        name: 'Territory Raid',
        type: 'Offense',
        status: 'Cooldown',
        efficiency: 0,
    },
    {
        name: 'Information Network',
        type: 'Defense',
        status: 'Ready',
        efficiency: 100,
    },
];
