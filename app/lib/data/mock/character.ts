/**
 * Mock character data - Scandinavian organized crime theme
 */

import { EquipmentItemType, MaterialStatus } from '../../types';

export const mockEquipment: EquipmentItemType[] = [
    {
        slot: 'Weapon',
        label: 'CZ Scorpion EVO',
        stats: '+15 Combat, +5 Intimidation',
        rarity: 'Epic',
    },
    {
        slot: 'Armor',
        label: 'Leather MC Vest',
        stats: '+10 Defense, +3 Respect',
        rarity: 'Rare',
    },
    {
        slot: 'Accessory',
        label: 'Encrypted Phone',
        stats: '+8 Stealth, +2 Intelligence',
        rarity: 'Uncommon',
    },
    {
        slot: 'Vehicle',
        label: 'Harley-Davidson Fat Boy',
        stats: '+12 Speed, +7 Intimidation',
        rarity: 'Rare',
    },
];

export const mockMaterials: MaterialStatus[] = [
    { name: 'Kontanter', current: 450000, max: 1000000 }, // Cash (Swedish: Kontanter)
    { name: 'Inflytande', current: 320, max: 500 },        // Influence (Swedish: Inflytande)
    { name: 'Respekt', current: 78, max: 100 },            // Respect (Swedish: Respekt)
    { name: 'Polisbevakning', current: 42, max: 100 },     // Police Heat (Swedish: Polisbevakning)
];

export const mockCharacterStats = {
    name: 'Lars "Lasse" Nordström',
    level: 25,
    chapter: 'Stockholm MC',
    rank: 'Enforcer',  // Biker gang rank instead of mafia
    health: 100,
    energy: 85,
};
