/**
 * Character-related game types
 */

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic';
export type EquipmentSlot = 'Weapon' | 'Armor' | 'Accessory' | 'Vehicle';

export interface EquipmentItemType {
    id: string;
    slot: EquipmentSlot;
    label: string;
    stats: string;
    rarity: Rarity;
    price: number;
    equipped?: boolean;
}

export interface MaterialStatus {
    name: string;
    current: number;
    max: number;
}
