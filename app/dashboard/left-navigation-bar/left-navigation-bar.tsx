"use client";

import React from 'react';
import { Home, User, Users, Briefcase, Map, Shield } from "lucide-react";
import { NavigationItem } from "../../../components/navigation/navigation-item";
import { NavItem } from '@/app/lib/types';
import { useRoute } from '@/app/lib/contexts';

const navigationItems: NavItem[] = [
    { icon: <User />, label: "Character", route: "/character" },
    { icon: <Home />, label: "Headquarters", route: "/headquarters" },
    { icon: <Users />, label: "Family", route: "/family" },
    { icon: <Briefcase />, label: "Business", route: "/business" },
    { icon: <Map />, label: "Territory", route: "/territory" },
    { icon: <Shield />, label: "Defense", route: "/defense" },
];

interface LeftNavigationBarProps {
    isMobileBottom?: boolean;
}

export const LeftNavigationBar: React.FC<LeftNavigationBarProps> = ({ isMobileBottom = false }) => {
    const { currentRoute, navigateTo } = useRoute();

    // Mobile bottom navigation (horizontal)
    if (isMobileBottom) {
        return (
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-nordic-bg-dark border-t-2 border-nordic-border safe-area-inset-bottom">
                <div className="flex justify-around items-center px-2 py-2 overflow-x-auto">
                    {navigationItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => navigateTo(item.route)}
                            className={`
                                flex flex-col items-center justify-center min-w-[60px] px-2 py-2 rounded-lg
                                transition-all duration-200
                                ${currentRoute === item.route
                                    ? 'bg-nordic-accent text-nordic-text-primary'
                                    : 'text-nordic-text-secondary hover:text-nordic-text-primary hover:bg-nordic-bg-light'
                                }
                            `}
                            aria-label={item.label}
                        >
                            <span className="mb-1">{item.icon}</span>
                            <span className="text-xs font-medium truncate max-w-full">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        );
    }

    // Desktop/Tablet sidebar navigation (vertical)
    return (
        <nav className="w-64 bg-nordic-bg-dark p-4 space-y-4 h-full overflow-y-auto">
            <h2 className="mb-8 text-nordic-text-primary text-xl font-bold">Operations</h2>
            <div className="space-y-2">
                {navigationItems.map((item) => (
                    <NavigationItem
                        key={item.label}
                        item={item}
                        isActive={currentRoute === item.route}
                        onRouteChange={navigateTo}
                    />
                ))}
            </div>
        </nav>
    );
};