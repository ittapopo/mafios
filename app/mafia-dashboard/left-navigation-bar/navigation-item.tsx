"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const NavigationItem = ({
    item: { icon, label, route },
}: {
    item: { icon: JSX.Element; label: string; route: string };
}) => {
    const router = useRouter();

    return (
        <Button
            onClick={() => router.push(route)}
            variant="ghost"
            className="w-full justify-start text-[#B8A99A] hover:text-[#D4C5B2] hover:bg-[#2A241D]"
        >
            <span className="mr-2 h-4 w-4">{icon}</span>
            {label}
        </Button>
    );
};
