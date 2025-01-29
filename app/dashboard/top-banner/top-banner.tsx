import React from 'react';
import TopBannerClient from './top-banner-client';


const TopBanner = () => {
    return (
        <div className="w-full h-48 relative">
            <img
                src="/banner.jpg"
                alt="City Skyline"
                className="w-full h-full object-cover opacity-60"
            />
            <TopBannerClient />
            <div className="absolute bottom-0 left-0 p-6">
                <h1 className="text-3xl font-bold text-[#D4C5B2]">Don Giovanni's Empire</h1>
                <p className="text-[#B8A99A]">Respected Boss • Manhattan Territory</p>
            </div>
        </div>
    );
};

export default TopBanner;