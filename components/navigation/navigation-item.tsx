"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { NavigationItemProps, Route } from '@/app/lib/types';

export const NavigationItem: React.FC<NavigationItemProps> = ({
    item: { icon, label, route, count },
    justifyBetween = false,
    isActive = false,
    onRouteChange
}) => {
    return (
        <Button
            onClick={() => {
                if (onRouteChange) {
                    onRouteChange(route as Route);
                }
            }}
            variant="ghost"
            className={`w-full flex items-center ${justifyBetween ? "justify-between" : "justify-start"
                } ${isActive
                    ? "text-[#D4C5B2] bg-[#2A241D]"
                    : "text-[#B8A99A] hover:text-[#D4C5B2] hover:bg-[#2A241D]"
                }`}
        >
            <div className="flex items-center">
                <span className="mr-2 h-4 w-4">{icon}</span>
                {label}
            </div>
            {count !== undefined && (
                <span className="bg-[#8B7355] px-2 py-1 rounded-full text-xs">
                    {count}
                </span>
            )}
        </Button>
    );
};