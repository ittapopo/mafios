import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Home,
    Users,
    Briefcase,
    Map,
    Shield,
    MessageSquare,
    Bell,
    Mail,
    UserPlus,
    Gift,
    LogOut,
    Car,
    Home as Building,
    Watch,
    Shirt,
    Phone,
    Upload
} from 'lucide-react';
import { useRouter } from 'next/router';
import TopBanner from './top-banner/top-banner';

const MafiaDashboard = () => {
    //const router = useRouter();
    //const [characterImage, setCharacterImage] = useState(null);

    // const handleImageUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setCharacterImage(reader.result);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    return (
        <div className="min-h-screen bg-[#2A241D] flex flex-col">
            {/* Top Banner - Previous code unchanged */}
            <TopBanner />

            {/* Main Content Area with Side Navs */}
            <div className="flex flex-1">
                {/* Left Navigation - Previous code unchanged */}
                <nav className="w-64 bg-[#1A150F] p-4 space-y-4">
                    {/* Previous nav content */}
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

                {/* Main Content */}
                <main className="flex-1 p-6 space-y-6">
                    {/* Top Stats Grid - Previous code unchanged */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Previous stat boxes */}
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

                    {/* New Character Display and Status Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Character Material Status */}
                        <div className="bg-[#1A150F] p-6 rounded-lg">
                            <h3 className="text-[#D4C5B2] text-xl mb-4">Material Status</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: Car, label: 'Vehicle', value: 'Rolls-Royce Phantom', status: 'Pristine' },
                                    { icon: Building, label: 'Residence', value: 'Upper East Side Penthouse', status: 'Secured' },
                                    { icon: Phone, label: 'Communications', value: 'Encrypted Satellite Phone', status: 'Active' },
                                    { icon: Watch, label: 'Accessories', value: 'Patek Philippe Watch', status: 'Pristine' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between text-[#B8A99A] p-2 hover:bg-[#2A241D] rounded-lg transition-colors">
                                        <div className="flex items-center">
                                            <item.icon className="mr-3 h-5 w-5" />
                                            <div>
                                                <div className="font-medium">{item.label}</div>
                                                <div className="text-sm opacity-80">{item.value}</div>
                                            </div>
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-[#8B7355] rounded-full">
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#1A150F] p-6 rounded-lg">
                            <h3 className="text-[#D4C5B2] text-xl mb-4">Character Profile</h3>

                            {/* Character Picture Upload */}
                            <div className="mb-6">
                                <div className="relative w-full h-64 bg-[#2A241D] rounded-lg overflow-hidden">
                                    {/* {characterImage ? (
                                        <img
                                            src={characterImage}
                                            alt="Character"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-[#B8A99A]">
                                            <Upload className="h-12 w-12 mb-2" />
                                            <p>Upload Character Image</p>
                                        </div>
                                    )} */}

                                </div>
                            </div>

                            {/* Equipment Grid - 4 slots */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { slot: 'Weapon', item: 'Custom M1911', stats: '+3 Power • +2 Accuracy', rarity: 'Rare' },
                                    { slot: 'Armor', item: 'Bulletproof Vest', stats: '+3 Defense • -1 Agility', rarity: 'Uncommon' },
                                    { slot: 'Accessory', item: 'Lucky Ring', stats: '+1 All Stats', rarity: 'Epic' },
                                    { slot: 'Tool', item: 'Lock Picking Set', stats: '+2 Stealth • +1 Utility', rarity: 'Common' }
                                ].map((item) => (
                                    <div
                                        key={item.slot}
                                        className="p-4 bg-[#2A241D] rounded-lg border-2 border-[#8B7355]/30 hover:border-[#8B7355] transition-colors"
                                    >
                                        <div className="text-[#D4C5B2] font-medium mb-1">{item.slot}</div>
                                        <p className="text-[#B8A99A] text-sm">{item.item}</p>
                                        <div className="mt-2 text-xs text-[#8B7355]">{item.stats}</div>
                                        <div className={`mt-1 text-xs px-2 py-1 rounded-full inline-block
                  ${item.rarity === 'Common' ? 'bg-[#8B7355]/30 text-[#B8A99A]' :
                                                item.rarity === 'Uncommon' ? 'bg-[#4A9F4A]/30 text-[#7FBF7F]' :
                                                    item.rarity === 'Rare' ? 'bg-[#4A4A9F]/30 text-[#7F7FBF]' :
                                                        'bg-[#9F4A9F]/30 text-[#BF7FBF]'}`}
                                        >
                                            {item.rarity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Navigation - Previous code unchanged */}
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
        </div >
    );
};

export default MafiaDashboard;