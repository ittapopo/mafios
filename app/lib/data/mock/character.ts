/**
 * Mock character data
 */

import { EquipmentItemType, MaterialStatus } from '../../types';

export const mockEquipment: EquipmentItemType[] = [
    {
        slot: 'Weapon',
        label: 'Thompson Submachine Gun',
        stats: '+15 Combat, +5 Intimidation',
        rarity: 'Epic',
    },
    {
        slot: 'Armor',
        label: 'Reinforced Suit',
        stats: '+10 Defense, +3 Charisma',
        rarity: 'Rare',
    },
    {
        slot: 'Accessory',
        label: 'Gold Pocket Watch',
        stats: '+8 Charisma, +2 Luck',
        rarity: 'Uncommon',
    },
    {
        slot: 'Vehicle',
        label: 'Armored Sedan',
        stats: '+12 Speed, +7 Defense',
        rarity: 'Rare',
    },
];

export const mockMaterials: MaterialStatus[] = [
    { name: 'Cash', current: 45000, max: 100000 },
    { name: 'Influence', current: 320, max: 500 },
    { name: 'Respect', current: 78, max: 100 },
    { name: 'Heat', current: 42, max: 100 },
];

export const mockCharacterStats = {
    name: 'Don Vittorio',
    level: 25,
    family: 'Corleone',
    rank: 'Capo',
    health: 100,
    energy: 85,
};
