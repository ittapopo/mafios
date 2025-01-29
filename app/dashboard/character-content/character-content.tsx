import { CharacterProfile } from "./character-profile/character-profile";
import { MaterialStatus } from "./material-status/material-status";


export const CharacterContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MaterialStatus />
        <CharacterProfile />
    </div>
)