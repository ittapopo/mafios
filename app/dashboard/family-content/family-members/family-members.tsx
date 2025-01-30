import { Swords } from "lucide-react";

export const FamilyMembers = () => {
    const members = [
        {
            role: 'Brother',
            name: 'Tony',
            status: 'Active',
            traits: ['Diplomatic', 'Wealthy'],
            power: 85,
            actions: ['Trade', 'Negotiate', 'Command']
        },
        {
            role: 'Heir',
            name: 'Christopher',
            status: 'Training',
            traits: ['Ambitious', 'Strong'],
            power: 60,
            actions: ['Study', 'Train', 'Quest']
        },
        {
            role: 'Advisor',
            name: 'Silvio',
            status: 'Captain',
            traits: ['Wise', 'Connected'],
            power: 75,
            actions: ['Counsel', 'Scheme', 'Influence']
        }
    ];

    return (
        <div className="bg-[#1A150F] p-4 rounded-lg border border-[#2A241D]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#D4C5B2] text-lg">Family Members</h3>
                <button className="text-xs text-[#D4C5B2] hover:text-[#B8A99A] border border-[#2A241D] px-2 py-1 rounded">
                    Manage Dynasty
                </button>
            </div>
            <div className="space-y-3">
                {members.map((member) => (
                    <div key={member.name} className="border border-[#2A241D] bg-[#2A241D] p-3 rounded">
                        <div className="flex justify-between mb-2">
                            <span className="text-[#D4C5B2] font-bold">{member.name}</span>
                            <span className="text-xs text-[#8B7355]">{member.role}</span>
                        </div>
                        <div className="flex gap-2 mb-2">
                            {member.traits.map((trait) => (
                                <span key={trait} className="text-xs px-2 py-1 bg-[#1A150F] text-[#B8A99A] rounded">
                                    {trait}
                                </span>
                            ))}
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                {member.actions.map((action) => (
                                    <button
                                        key={action}
                                        className="text-xs px-2 py-1 bg-[#1A150F] text-[#B8A99A] hover:bg-[#2A241D] rounded"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-1">
                                <Swords className="h-3 w-3 text-[#D4C5B2]" />
                                <span className="text-[#D4C5B2] text-sm">{member.power}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};