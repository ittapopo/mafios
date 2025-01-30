import { Crown, Shield, Coins, Flag } from "lucide-react";
import { FamilyStatsItem } from "./family-stats-item";

export const FamilyDynasty = () => {
    const stats = [
        { icon: <Crown />, label: 'Dynasty Name', value: 'House of Bologna', effect: '+10% Influence Gain' },
        { icon: <Shield />, label: 'Reputation', value: '745 Honor', effect: '+5% Trade Success' },
        { icon: <Coins />, label: 'Family Fortune', value: '25,000 Gold', effect: '+2 Income/Hour' },
        { icon: <Flag />, label: 'Territory', value: '3 Holdings', effect: '+15% Resource Production' },
    ];

    return (
        <div className="bg-[#1A150F] p-4 rounded-lg border border-[#2A241D]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#D4C5B2] text-lg">Dynasty Overview</h3>
                <span className="text-xs text-[#8B7355]">Year 1246</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {stats.map((item) => (
                    <FamilyStatsItem key={item.label} item={item} />
                ))}
            </div>
        </div>
    );
};