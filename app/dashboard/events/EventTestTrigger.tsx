"use client";

/**
 * EventTestTrigger Component
 *
 * Development tool to manually trigger random events for testing
 */

import React from 'react';
import { useGameState } from '@/app/lib/contexts';
import { Zap } from 'lucide-react';

export const EventTestTrigger: React.FC = () => {
    const { state, triggerEvent } = useGameState();

    // Get untriggered events
    const availableEvents = state.randomEvents?.filter(
        event => !event.triggered && !event.resolved
    ) ?? [];

    const handleTriggerRandom = () => {
        if (availableEvents.length === 0) {
            alert('No available events to trigger!');
            return;
        }

        const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        triggerEvent(randomEvent.id);
        alert(`Triggered: ${randomEvent.title}`);
    };

    return (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-yellow-400" />
                <h3 className="text-yellow-400 font-semibold text-sm">Dev Tools: Event Tester</h3>
            </div>

            <p className="text-nordic-text-secondary text-xs mb-3">
                Events trigger automatically every 3 minutes based on conditions.
                Use this to test manually.
            </p>

            <button
                onClick={handleTriggerRandom}
                disabled={availableEvents.length === 0}
                className={`
                    w-full px-3 py-2 rounded-lg text-sm font-semibold transition-colors
                    ${availableEvents.length > 0
                        ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                        : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    }
                `}
            >
                {availableEvents.length > 0
                    ? `Trigger Random Event (${availableEvents.length} available)`
                    : 'No Events Available'
                }
            </button>
        </div>
    );
};
