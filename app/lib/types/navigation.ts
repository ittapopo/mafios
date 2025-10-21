/**
 * Navigation component types
 */

import React from 'react';
import { Route } from './routes';

/**
 * Navigation item data structure
 */
export interface NavItem {
    icon: React.ReactNode;
    label: string;
    route: Route;
    count?: number;
}

/**
 * Props for NavigationItem component
 */
export interface NavigationItemProps {
    item: NavItem;
    justifyBetween?: boolean;
    isActive?: boolean;
    onRouteChange?: (route: Route) => void;
}

/**
 * Props for LeftNavigationBar component
 */
export interface LeftNavigationBarProps {
    onRouteChange: (route: Route) => void;
    currentRoute: Route;
}
