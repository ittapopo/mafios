import { ReactElement } from "react";

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic';

export interface EquipmentItemType {
    slot: string;
    label: string;
    stats: string;
    rarity: Rarity;
}

export interface SecurityLevel {
    area: string;
    level: number;
    status: 'Compromised' | 'Secured' | 'Maximum Security';
    description: string;
}

export interface Operation {
    name: string;
    type: 'Income' | 'Defense' | 'Offense';
    status: 'Active' | 'Cooldown' | 'Ready';
    efficiency: number;
}

export interface NavigationItem {
    icon: ReactElement;
    label: string;
    route: string;
    count?: number;
}

export type Route = '/character' | '/headquarters' | '/family' | '/business' | '/territory'
    | '/defense' | 'messages' | 'notifications' | 'invites' | 'recruitment' | 'rewards';

export interface LeftNavigationBarProps {
    onRouteChange: (route: Route) => void;
    currentRoute: Route;
}

export interface NavigationItemProps {
    item: { icon: React.ReactNode; label: string; route: Route; count?: number };
    justifyBetween?: boolean;
    isActive?: boolean;
    onRouteChange?: (route: Route) => void;
}

export interface NavItem {
    icon: React.ReactNode;
    label: string;
    route: Route;
    count?: number;
}