"use client";

/**
 * EventsList Component
 *
 * Displays list of active random events
 */

import React, { useState } from 'react';
import { useGameState } from '@/app/lib/contexts';
import { EventCard } from './EventCard';
import { EventModal } from './EventModal';
import { EventTestTrigger } from './EventTestTrigger';
import { AlertCircle } from 'lucide-react';

export const EventsList: React.FC = () => {
    const { state } = useGameState();
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    // Get active events
    const activeEvents = state.randomEvents?.filter(
        event => event.triggered && !event.resolved
    ) ?? [];

    const selectedEvent = selectedEventId
        ? state.randomEvents?.find(e => e.id === selectedEventId)
        : null;

    return (
        <>
            {/* Dev Tool: Event Trigger */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mb-4">
                    <EventTestTrigger />
                </div>
            )}

            <div className="space-y-3">
                {activeEvents.length === 0 ? (
                    <div className="text-center py-8 text-nordic-text-muted">
                        <AlertCircle size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Inga aktiva händelser</p>
                        <p className="text-xs mt-1">Händelser dyker upp regelbundet</p>
                    </div>
                ) : (
                    activeEvents.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onClick={() => setSelectedEventId(event.id)}
                        />
                    ))
                )}
            </div>

            {/* Event Modal */}
            {selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    onClose={() => setSelectedEventId(null)}
                />
            )}
        </>
    );
};
