/**
 * Character-related game types
 */

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic';

export interface EquipmentItemType {
    slot: string;
    label: string;
    stats: string;
    rarity: Rarity;
}

export interface MaterialStatus {
    name: string;
    current: number;
    max: number;
}
