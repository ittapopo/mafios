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
import { LeftNavigationBar } from './left-navigation-bar/left-navigation-bar';
import { RightNavigationBar } from './right-navigation-bar/right-navigation-bar';
import TopStatsGrid from './top-stats/stat-card';

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
            {/* Top Banner */}
            <TopBanner />

            {/* Main Content Area with Side Navs */}
            <div className="flex flex-1">
                {/* Left Navigation */}
                <LeftNavigationBar />

                {/* Main Content */}
                <main className="flex-1 p-6 space-y-6">
                    {/* Top Stats Grid */}
                    <TopStatsGrid />

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

                {/* Right Navigation */}
                <RightNavigationBar />

            </div>
        </div>
    );
};

export default MafiaDashboard;