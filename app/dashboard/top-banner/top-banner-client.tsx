"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const TopBannerClient = () => {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/');
    };

    return (
        <div className="absolute top-4 right-4">
            <button
                onClick={handleLogout}
                className="flex items-center text-[#D4C5B2] hover:text-white"
            >
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
        </div>
    );
};

export default TopBannerClient;