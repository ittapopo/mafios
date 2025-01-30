export const FamilyStatsItem = ({
    item: { icon, label, value, effect }
}: {
    item: { icon: JSX.Element; label: string; value: string; effect: string };
}) => (
    <div className="border border-[#2A241D] bg-[#2A241D] p-3 rounded">
        <div className="flex items-center gap-2 mb-2">
            <span className="h-4 w-4 text-[#D4C5B2]">{icon}</span>
            <div className="text-[#B8A99A] text-sm">{label}</div>
        </div>
        <div className="text-[#D4C5B2] font-bold mb-1">{value}</div>
        <div className="text-xs text-[#8B7355]">{effect}</div>
    </div>
);
