"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const MainContentClient = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/dashboard');
    };

    return (
        <>
            {/* Left Side - Text Content */}
            <div className="md:w-1/2 space-y-6 text-center md:text-left">
                <h2 className="text-5xl font-bold text-[#D4C5B2] leading-tight">
                    Welcome to the Family
                </h2>
                <p className="text-xl text-[#B8A99A]">
                    Rise through the ranks, build your empire, and become the most powerful Don in the city.
                </p>
                <div className="space-x-4">
                    <Button
                        className="bg-[#8B7355] hover:bg-[#6B563D] text-[#D4C5B2] text-lg px-8 py-6"
                        onClick={handleClick}
                    >
                        Start Your Empire
                    </Button>
                </div>
            </div>

            {/* Right Side - Decorative Elements */}
            <div className="md:w-1/2 mt-8 md:mt-0 relative">
                <div className="w-64 h-64 md:w-96 md:h-96 bg-[#8B7355] rounded-full opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="relative z-10">
                    <div className="w-64 h-64 md:w-96 md:h-96 bg-[#4A3F32] rounded-lg shadow-2xl flex items-center justify-center">
                        <img
                            src="mafia.png"
                            alt="Mafia Theme"
                            className="rounded-lg opacity-80"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export { MainContentClient }