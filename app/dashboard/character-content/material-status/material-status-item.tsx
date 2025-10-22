export const MaterialStatusItem = ({
    item: { icon, label, value, status }
}: {
    item: { icon: JSX.Element; label: string; value: string; status: string };
}) => (
    <div className="flex items-center justify-between text-nordic-text-secondary p-3 hover:bg-nordic-bg rounded-lg transition-colors">
        {/* Left Section: Icon + Label/Value */}
        <div className="flex items-center gap-3 min-w-0">
            <span className="h-5 w-5 flex-shrink-0">{icon}</span>
            <div className="min-w-0">
                <div className="font-medium truncate">{label}</div>
                <div className="text-sm opacity-80 truncate">{value}</div>
            </div>
        </div>

        {/* Right Section: Status */}
        <span className="text-xs px-3 py-1 bg-nordic-accent-muted rounded-full flex-shrink-0 text-right">
            {status}
        </span>
    </div>
);
