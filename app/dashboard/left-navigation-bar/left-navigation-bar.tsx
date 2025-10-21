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

export const LeftNavigationBar: React.FC = () => {
    const { currentRoute, navigateTo } = useRoute();

    return (
        <nav className="w-64 bg-mafia-bg-dark p-4 space-y-4">
            <h2 className="mb-8 text-mafia-text-primary text-xl font-bold">Operations</h2>
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