"use client";

import { Upload } from "lucide-react";
import { EquipmentItem } from "./equipment-item";
import { useGameState } from "@/app/lib/hooks";

export const CharacterProfile = () => {
    const { state } = useGameState();
    const equipment = state.equipment;

    return (
        <div className="bg-nordic-bg-dark p-6 rounded-lg">
            <h3 className="text-nordic-text-primary text-xl mb-4">
                {state.player.name}
            </h3>
            <p className="text-nordic-text-secondary text-sm mb-4">
                Level {state.player.level} {state.player.rank} • {state.player.chapter}
            </p>

            <div className="mb-6">
                <div className="relative w-full h-64 bg-nordic-bg rounded-lg overflow-hidden border-2 border-nordic-border-light">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-nordic-text-secondary">
                        <Upload className="h-12 w-12 mb-2" />
                        <p>Upload Character Image</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {equipment.length > 0 ? (
                    equipment.map((item) => (
                        <EquipmentItem key={item.slot} item={item} />
                    ))
                ) : (
                    <p className="text-nordic-text-muted col-span-2 text-center py-4">
                        No equipment equipped
                    </p>
                )}
            </div>
        </div>
    );
};
