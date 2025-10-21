/**
 * Mock business/crime data
 */

import { Crime } from '../../types';

export const mockCrimes: Crime[] = [
    { name: 'Petty Theft', duration: 30, reward: 100, risk: 'Low' },
    { name: 'Pickpocketing', duration: 60, reward: 250, risk: 'Low' },
    { name: 'Burglary', duration: 120, reward: 500, risk: 'Medium' },
    { name: 'Car Theft', duration: 90, reward: 750, risk: 'Medium' },
    { name: 'Armed Robbery', duration: 180, reward: 1500, risk: 'High' },
    { name: 'Bank Heist', duration: 300, reward: 5000, risk: 'Very High' },
    { name: 'Armored Truck', duration: 240, reward: 3500, risk: 'High' },
    { name: 'Casino Job', duration: 360, reward: 8000, risk: 'Very High' },
];

export const mockCrimeTiers = [
    {
        tier: 'Petty Crimes',
        crimes: mockCrimes.slice(0, 2),
    },
    {
        tier: 'Street Crimes',
        crimes: mockCrimes.slice(2, 4),
    },
    {
        tier: 'Major Crimes',
        crimes: mockCrimes.slice(4, 6),
    },
    {
        tier: 'Heists',
        crimes: mockCrimes.slice(6, 8),
    },
];
