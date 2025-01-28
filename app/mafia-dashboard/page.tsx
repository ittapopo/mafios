import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Home,
    Users,
    Briefcase,
    Map,
    Shield,
    MessageSquare,
    Bell,
    Settings,
    Mail,
    UserPlus,
    Gift
} from 'lucide-react';

const MafiaDashboard = () => {
    return (
        <div className="min-h-screen bg-[#2A241D] flex">
            {/* Left Action Navigation */}
            <nav className="w-64 bg-[#1A150F] p-4 space-y-4">
                <div className="mb-8">
                    <h2 className="text-[#D4C5B2] text-xl font-bold">Operations</h2>
                </div>

                <div className="space-y-2">
                    {[
                        { icon: Home, label: 'Headquarters' },
                        { icon: Users, label: 'Family' },
                        { icon: Briefcase, label: 'Business' },
                        { icon: Map, label: 'Territory' },
                        { icon: Shield, label: 'Defense' },
                    ].map((item) => (
                        <Button
                            key={item.label}
                            variant="ghost"
                            className="w-full justify-start text-[#B8A99A] hover:text-[#D4C5B2] hover:bg-[#2A241D]"
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Button>
                    ))}
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
                {/* Banner */}
                <div className="h-48 relative">
                    <img
                        src="/api/placeholder/1200/192"
                        alt="City Skyline"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute bottom-0 left-0 p-6">
                        <h1 className="text-3xl font-bold text-[#D4C5B2]">Don Giovanni's Empire</h1>
                        <p className="text-[#B8A99A]">Respected Boss • Manhattan Territory</p>
                    </div>
                </div>

                {/* Character Overview */}
                <div className="flex-1 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Character Stats */}
                        <div className="bg-[#1A150F] p-6 rounded-lg">
                            <h3 className="text-[#D4C5B2] text-xl mb-4">Character Stats</h3>
                            <div className="space-y-3">
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
                            </div>
                        </div>

                        {/* Family Overview */}
                        <div className="bg-[#1A150F] p-6 rounded-lg">
                            <h3 className="text-[#D4C5B2] text-xl mb-4">Family Members</h3>
                            <div className="space-y-3">
                                <div className="flex items-center text-[#B8A99A]">
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>12 Made Members</span>
                                </div>
                                <div className="flex items-center text-[#B8A99A]">
                                    <Shield className="mr-2 h-4 w-4" />
                                    <span>4 Capos</span>
                                </div>
                            </div>
                        </div>

                        {/* Territory Control */}
                        <div className="bg-[#1A150F] p-6 rounded-lg">
                            <h3 className="text-[#D4C5B2] text-xl mb-4">Territory Control</h3>
                            <div className="space-y-3">
                                <div className="flex items-center text-[#B8A99A]">
                                    <Map className="mr-2 h-4 w-4" />
                                    <span>3 Districts Controlled</span>
                                </div>
                                <div className="flex items-center text-[#B8A99A]">
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    <span>8 Businesses</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Right Social Navigation */}
            <nav className="w-64 bg-[#1A150F] p-4 space-y-4">
                <div className="mb-8">
                    <h2 className="text-[#D4C5B2] text-xl font-bold">Social</h2>
                </div>

                <div className="space-y-2">
                    {[
                        { icon: MessageSquare, label: 'Messages', count: 3 },
                        { icon: Bell, label: 'Notifications', count: 5 },
                        { icon: Mail, label: 'Invites', count: 2 },
                        { icon: UserPlus, label: 'Recruitment' },
                        { icon: Gift, label: 'Rewards' },
                    ].map((item) => (
                        <Button
                            key={item.label}
                            variant="ghost"
                            className="w-full justify-between text-[#B8A99A] hover:text-[#D4C5B2] hover:bg-[#2A241D]"
                        >
                            <span className="flex items-center">
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </span>
                            {item.count && (
                                <span className="bg-[#8B7355] px-2 py-1 rounded-full text-xs">
                                    {item.count}
                                </span>
                            )}
                        </Button>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default MafiaDashboard;