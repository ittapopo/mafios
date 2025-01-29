import React, { ReactNode } from 'react';
import { Users, Shield, Map, Briefcase } from 'lucide-react';

interface StatCardProps {
    title: string;
    children: ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, children }) => (
    <div className="bg-[#1A150F] p-6 rounded-lg">
        <h3 className="text-[#D4C5B2] text-xl mb-4">{title}</h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

// Character Stats Card
export const CharacterStatsCard = () => (
    <StatCard title="Character Stats">
        <div className="flex justify-between text-[#B8A99A]">
            <span>Respect</span>
            <span>875/1000</span>
        </div>
        <div className="flex justify-between text-[#B8A99A]">
            <span>Influence</span>
            <span>234/500</span>
        </div>
        <div className="flex justify-between text-[#B8A99A]">
            <span>Wealth</span>
            <span>$1,245,000</span>
        </div>
    </StatCard>
);

// Family Members Card
export const FamilyMembersCard = () => (
    <StatCard title="Family Members">
        <div className="flex items-center text-[#B8A99A]">
            <Users className="mr-2 h-4 w-4" />
            <span>12 Made Members</span>
        </div>
        <div className="flex items-center text-[#B8A99A]">
            <Shield className="mr-2 h-4 w-4" />
            <span>4 Capos</span>
        </div>
    </StatCard>
);

// Territory Control Card
export const TerritoryControlCard = () => (
    <StatCard title="Territory Control">
        <div className="flex items-center text-[#B8A99A]">
            <Map className="mr-2 h-4 w-4" />
            <span>3 Districts Controlled</span>
        </div>
        <div className="flex items-center text-[#B8A99A]">
            <Briefcase className="mr-2 h-4 w-4" />
            <span>8 Businesses</span>
        </div>
    </StatCard>
);

// Stats Grid Container
export const TopStatsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CharacterStatsCard />
        <FamilyMembersCard />
        <TerritoryControlCard />
    </div>
);

export default TopStatsGrid;