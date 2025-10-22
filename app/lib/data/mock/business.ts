/**
 * Mock business/crime data - Scandinavian organized crime operations
 * Inspired by Nordic biker gangs, drug trafficking, and Baltic connections
 */

import { Crime } from '../../types';

export const mockCrimes: Crime[] = [
    // Low-level operations
    { name: 'Protection Racket', duration: 30, reward: 500, risk: 'Low' },
    { name: 'Cigarette Smuggling', duration: 60, reward: 1200, risk: 'Low' },

    // Medium operations
    { name: 'Amphetamine Deal', duration: 120, reward: 3500, risk: 'Medium' },
    { name: 'Stolen Vehicle Export', duration: 90, reward: 2800, risk: 'Medium' },

    // High-risk operations
    { name: 'Estonian Connection Run', duration: 180, reward: 8500, risk: 'High' },
    { name: 'Cocaine Shipment', duration: 300, reward: 15000, risk: 'Very High' },

    // Major operations
    { name: 'Arms Deal from Balkans', duration: 240, reward: 12000, risk: 'High' },
    { name: 'Money Laundering Operation', duration: 360, reward: 25000, risk: 'Very High' },
];

export const mockCrimeTiers = [
    {
        tier: 'Gadeoperationer', // Street Operations (Danish)
        crimes: mockCrimes.slice(0, 2),
    },
    {
        tier: 'Smugling', // Smuggling (Norwegian/Swedish)
        crimes: mockCrimes.slice(2, 4),
    },
    {
        tier: 'Narkotikahandel', // Drug Trade (Swedish)
        crimes: mockCrimes.slice(4, 6),
    },
    {
        tier: 'Tung Kriminalitet', // Heavy Crime (Swedish)
        crimes: mockCrimes.slice(6, 8),
    },
];
