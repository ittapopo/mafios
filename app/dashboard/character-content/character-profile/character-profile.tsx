import { Upload } from "lucide-react";
import { EquipmentItem } from "./equipment-item";
import { EquipmentItemType } from "@/app/lib/types";

export const CharacterProfile = () => {
    const equipment: EquipmentItemType[] = [
        { slot: 'Weapon', label: 'Custom M1911', stats: '+3 Power • +2 Accuracy', rarity: 'Rare' },
        { slot: 'Armor', label: 'Bulletproof Vest', stats: '+3 Defense • -1 Agility', rarity: 'Uncommon' },
        { slot: 'Accessory', label: 'Lucky Ring', stats: '+1 All Stats', rarity: 'Epic' },
        { slot: 'Tool', label: 'Lock Picking Set', stats: '+2 Stealth • +1 Utility', rarity: 'Common' }
    ];

    return (
        <div className="bg-[#1A150F] p-6 rounded-lg">
            <h3 className="text-[#D4C5B2] text-xl mb-4">Character Profile</h3>

            <div className="mb-6">
                <div className="relative w-full h-64 bg-[#2A241D] rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[#B8A99A]">
                        <Upload className="h-12 w-12 mb-2" />
                        <p>Upload Character Image</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {equipment.map((item) => (
                    <EquipmentItem key={item.label} item={item} />
                ))}
            </div>
        </div>
    );
};
