/**
 * Mock character data - Scandinavian organized crime theme
 */

import { EquipmentItemType, MaterialStatus } from '../../types';

export const mockEquipment: EquipmentItemType[] = [
    {
        id: 'eq-weapon-1',
        slot: 'Weapon',
        label: 'CZ Scorpion EVO',
        stats: '+15 Combat, +5 Intimidation',
        rarity: 'Epic',
        price: 75000,
        equipped: true,
    },
    {
        id: 'eq-armor-1',
        slot: 'Armor',
        label: 'Leather MC Vest',
        stats: '+10 Defense, +3 Respect',
        rarity: 'Rare',
        price: 35000,
        equipped: true,
    },
    {
        id: 'eq-accessory-1',
        slot: 'Accessory',
        label: 'Encrypted Phone',
        stats: '+8 Stealth, +2 Intelligence',
        rarity: 'Uncommon',
        price: 15000,
        equipped: true,
    },
    {
        id: 'eq-vehicle-1',
        slot: 'Vehicle',
        label: 'Harley-Davidson Fat Boy',
        stats: '+12 Speed, +7 Intimidation',
        rarity: 'Rare',
        price: 125000,
        equipped: true,
    },
];

// Available shop inventory
export const mockShopInventory: EquipmentItemType[] = [
    // Weapons
    {
        id: 'shop-weapon-1',
        slot: 'Weapon',
        label: 'Glock 17',
        stats: '+8 Combat, +2 Intimidation',
        rarity: 'Common',
        price: 12000,
    },
    {
        id: 'shop-weapon-2',
        slot: 'Weapon',
        label: 'AK-47',
        stats: '+18 Combat, +8 Intimidation',
        rarity: 'Rare',
        price: 45000,
    },
    {
        id: 'shop-weapon-3',
        slot: 'Weapon',
        label: 'HK MP5',
        stats: '+20 Combat, +10 Intimidation',
        rarity: 'Epic',
        price: 85000,
    },

    // Armor
    {
        id: 'shop-armor-1',
        slot: 'Armor',
        label: 'Kevlar Vest',
        stats: '+5 Defense',
        rarity: 'Common',
        price: 8000,
    },
    {
        id: 'shop-armor-2',
        slot: 'Armor',
        label: 'Tactical Body Armor',
        stats: '+12 Defense, +5 Respect',
        rarity: 'Rare',
        price: 40000,
    },
    {
        id: 'shop-armor-3',
        slot: 'Armor',
        label: 'MC President Cut',
        stats: '+15 Defense, +10 Respect',
        rarity: 'Epic',
        price: 65000,
    },

    // Accessories
    {
        id: 'shop-accessory-1',
        slot: 'Accessory',
        label: 'Burner Phone',
        stats: '+3 Stealth',
        rarity: 'Common',
        price: 2000,
    },
    {
        id: 'shop-accessory-2',
        slot: 'Accessory',
        label: 'GPS Jammer',
        stats: '+10 Stealth, +5 Intelligence',
        rarity: 'Rare',
        price: 25000,
    },
    {
        id: 'shop-accessory-3',
        slot: 'Accessory',
        label: 'Police Scanner',
        stats: '+12 Stealth, +8 Intelligence',
        rarity: 'Epic',
        price: 45000,
    },

    // Vehicles
    {
        id: 'shop-vehicle-1',
        slot: 'Vehicle',
        label: 'Honda Shadow',
        stats: '+5 Speed, +2 Intimidation',
        rarity: 'Common',
        price: 35000,
    },
    {
        id: 'shop-vehicle-2',
        slot: 'Vehicle',
        label: 'Triumph Bonneville',
        stats: '+10 Speed, +5 Intimidation',
        rarity: 'Uncommon',
        price: 75000,
    },
    {
        id: 'shop-vehicle-3',
        slot: 'Vehicle',
        label: 'Ducati Diavel',
        stats: '+15 Speed, +10 Intimidation',
        rarity: 'Epic',
        price: 175000,
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
