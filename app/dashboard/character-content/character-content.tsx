import { CharacterProfile } from "./character-profile/character-profile";
import { MaterialStatus } from "./material-status/material-status";
import { EquipmentShop } from "./equipment-shop/equipment-shop";


export const CharacterContent = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MaterialStatus />
            <CharacterProfile />
        </div>
        <EquipmentShop />
    </div>
)