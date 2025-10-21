"use client";

/**
 * Route Context
 *
 * Provides centralized routing state management for the application.
 * Eliminates props drilling and provides a foundation for future routing enhancements.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Route } from '../types';

interface RouteContextType {
    currentRoute: Route;
    setCurrentRoute: (route: Route) => void;
    navigateTo: (route: Route) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

interface RouteProviderProps {
    children: ReactNode;
    initialRoute?: Route;
}

/**
 * Route Provider Component
 *
 * Wrap your application with this provider to enable routing context.
 */
export const RouteProvider: React.FC<RouteProviderProps> = ({
    children,
    initialRoute = '/character',
}) => {
    const [currentRoute, setCurrentRoute] = useState<Route>(initialRoute);

    const navigateTo = (route: Route) => {
        setCurrentRoute(route);
        // Future enhancement: Add route history, analytics, etc.
    };

    return (
        <RouteContext.Provider
            value={{
                currentRoute,
                setCurrentRoute,
                navigateTo,
            }}
        >
            {children}
        </RouteContext.Provider>
    );
};

/**
 * useRoute Hook
 *
 * Access routing state and navigation from any component.
 *
 * @example
 * const { currentRoute, navigateTo } = useRoute();
 * navigateTo('/headquarters');
 */
export const useRoute = (): RouteContextType => {
    const context = useContext(RouteContext);

    if (context === undefined) {
        throw new Error('useRoute must be used within a RouteProvider');
    }

    return context;
};
