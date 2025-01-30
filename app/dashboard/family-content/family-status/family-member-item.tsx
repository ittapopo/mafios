export const FamilyMemberItem = ({
    item: { icon, label, value, status }
}: {
    item: { icon: JSX.Element; label: string; value: string; status: string };
}) => (
    <div className="flex items-center justify-between text-[#B8A99A] p-3 hover:bg-[#2A241D] rounded-lg transition-colors">
        <div className="flex items-center gap-3 min-w-0">
            <span className="h-5 w-5 flex-shrink-0">{icon}</span>
            <div className="min-w-0">
                <div className="font-medium truncate">{label}</div>
                <div className="text-sm opacity-80 truncate">{value}</div>
            </div>
        </div>
        <span className="text-xs px-3 py-1 bg-[#8B7355] rounded-full flex-shrink-0 text-right">
            {status}
        </span>
    </div>
);