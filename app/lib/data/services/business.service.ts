/**
 * Business/Crime data service
 *
 * Provides access to crime and business-related data.
 */

import { mockCrimes, mockCrimeTiers } from '../mock/business';
import { Crime } from '../../types';

export class BusinessService {
    /**
     * Get all available crimes
     */
    static getCrimes(): Crime[] {
        return mockCrimes;
    }

    /**
     * Get crimes organized by tier
     */
    static getCrimeTiers() {
        return mockCrimeTiers;
    }

    /**
     * Start a crime (mock implementation)
     */
    static startCrime(crime: Crime): Promise<{ success: boolean; reward: number }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate success/failure based on risk
                const successRate = crime.risk === 'Low' ? 0.95 :
                                   crime.risk === 'Medium' ? 0.75 :
                                   crime.risk === 'High' ? 0.5 : 0.3;
                const success = Math.random() < successRate;

                resolve({
                    success,
                    reward: success ? crime.reward : 0,
                });
            }, crime.duration * 1000);
        });
    }
}
