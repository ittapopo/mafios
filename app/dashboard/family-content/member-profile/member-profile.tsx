import { Users } from "lucide-react";

export const MemberProfile = () => {
    const achievements = [
        { slot: 'Education', label: 'Masters in Education', stats: 'University of Oregon • 2019', rarity: 'Academic' },
        { slot: 'Career', label: 'Senior Teacher', stats: 'Lincoln High School • 5 years', rarity: 'Professional' },
        { slot: 'Skills', label: 'Piano & Art', stats: '10+ years experience', rarity: 'Creative' },
        { slot: 'Volunteer', label: 'Community Service', stats: 'Youth Mentor • Local Library', rarity: 'Social' }
    ];

    return (
        <div className="bg-[#1A150F] p-6 rounded-lg">
            <h3 className="text-[#D4C5B2] text-xl mb-4">Member Profile</h3>
            <div className="mb-6">
                <div className="relative w-full h-64 bg-[#2A241D] rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[#B8A99A]">
                        <Users className="h-12 w-12 mb-2" />
                        <p>Family Photo</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {achievements.map((item) => (
                    <div key={item.label} className="bg-[#2A241D] p-4 rounded-lg">
                        <div className="text-[#8B7355] text-sm mb-1">{item.slot}</div>
                        <div className="text-[#D4C5B2] font-medium mb-1">{item.label}</div>
                        <div className="text-[#B8A99A] text-sm">{item.stats}</div>
                        <div className="text-[#8B7355] text-xs mt-2">{item.rarity}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};