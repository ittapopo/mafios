
type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic';

const rarityColors: Record<Rarity, string> = {
    Common: 'bg-[#8B7355]/30 text-[#B8A99A]',
    Uncommon: 'bg-[#4A9F4A]/30 text-[#7FBF7F]',
    Rare: 'bg-[#4A4A9F]/30 text-[#7F7FBF]',
    Epic: 'bg-[#9F4A9F]/30 text-[#BF7FBF]'
};

export const EquipmentItem = ({ item: { slot, label, stats, rarity },
}: {
    item: { slot: string; label: string; stats: string; rarity: Rarity };
}) => {

    return (
        <div className="p-4 bg-[#2A241D] rounded-lg border-2 border-[#8B7355]/30 hover:border-[#8B7355] transition-colors">
            <div className="text-[#D4C5B2] font-medium mb-1">{slot}</div>
            <p className="text-[#B8A99A] text-sm">{label}</p>
            <div className="mt-2 text-xs text-[#8B7355]">{stats}</div>
            <div className={`mt-1 text-xs px-2 py-1 rounded-full inline-block ${rarityColors[rarity]}`}>
                {rarity}
            </div>
        </div>
    );
};