/**
 * Mock headquarters data - MC Clubhouse security and operations
 */

import { SecurityLevel, Operation } from '../../types';

export const mockSecurityLevels: SecurityLevel[] = [
    {
        area: 'Clubhouse Entrance',
        level: 4,
        status: 'Secured',
        description: 'Reinforced door, camera surveillance',
    },
    {
        area: 'Weapons Cache',
        level: 5,
        status: 'Maximum Security',
        description: 'Hidden compartment, encrypted access',
    },
    {
        area: 'Back Lot',
        level: 2,
        status: 'Compromised',
        description: 'Potential police surveillance point',
    },
    {
        area: 'Meeting Room',
        level: 3,
        status: 'Secured',
        description: 'Signal jammers, soundproofing',
    },
];

export const mockOperations: Operation[] = [
    {
        name: 'Drug Distribution Network',
        type: 'Income',
        status: 'Active',
        efficiency: 87,
    },
    {
        name: 'Estonian Import Route',
        type: 'Income',
        status: 'Active',
        efficiency: 92,
    },
    {
        name: 'Clubhouse Security',
        type: 'Defense',
        status: 'Active',
        efficiency: 78,
    },
    {
        name: 'Rival Chapter Conflict',
        type: 'Offense',
        status: 'Cooldown',
        efficiency: 0,
    },
    {
        name: 'Police Informant Network',
        type: 'Defense',
        status: 'Ready',
        efficiency: 100,
    },
];
