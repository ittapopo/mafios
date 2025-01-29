"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const NavigationItem = ({
    item: { icon, label, route, count },
    justifyBetween = false,
}: {
    item: { icon: JSX.Element; label: string; route: string; count?: number };
    justifyBetween?: boolean;
}) => {
    const router = useRouter();

    return (
        <Button
            onClick={() => router.push(route)}
            variant="ghost"
            className={`w-full flex items-center ${justifyBetween ? "justify-between" : "justify-start"
                } text-[#B8A99A] hover:text-[#D4C5B2] hover:bg-[#2A241D]`}

        >
            {/* Container for Icon and Label */}
            <div className="flex items-center">
                <span className="mr-2 h-4 w-4">{icon}</span>
                {label}
            </div>

            {/* Count should always be on the far right */}
            {count !== undefined && (
                <span className="bg-[#8B7355] px-2 py-1 rounded-full text-xs">
                    {count}
                </span>
            )}
        </Button>
    );
};
