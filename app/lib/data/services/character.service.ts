/**
 * Character data service
 *
 * Provides access to character-related data.
 * Currently returns mock data, but can be easily replaced with API calls.
 */

import { mockEquipment, mockMaterials, mockCharacterStats } from '../mock/character';
import { EquipmentItemType, MaterialStatus } from '../../types';

export class CharacterService {
    /**
     * Get character equipment
     */
    static getEquipment(): EquipmentItemType[] {
        return mockEquipment;
    }

    /**
     * Get character materials/resources
     */
    static getMaterials(): MaterialStatus[] {
        return mockMaterials;
    }

    /**
     * Get character stats
     */
    static getStats() {
        return mockCharacterStats;
    }

    /**
     * Update equipment (mock implementation)
     */
    static updateEquipment(slot: string, item: EquipmentItemType): Promise<void> {
        return new Promise((resolve) => {
            // Mock async operation
            setTimeout(() => {
                console.log(`Equipment updated: ${slot}`, item);
                resolve();
            }, 100);
        });
    }
}
