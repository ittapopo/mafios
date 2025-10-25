"use client";

/**
 * EventCard Component
 *
 * Displays a random event card with severity styling
 */

import React from 'react';
import { GameEvent } from '@/app/lib/types';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface EventCardProps {
    event: GameEvent;
    onClick: () => void;
}

const severityStyles = {
    low: 'border-l-4 border-l-blue-500 bg-nordic-bg-dark/50 hover:bg-nordic-bg-dark',
    medium: 'border-l-4 border-l-yellow-500 bg-nordic-bg-dark/50 hover:bg-nordic-bg-dark',
    high: 'border-l-4 border-l-orange-500 bg-nordic-bg-dark/50 hover:bg-nordic-bg-dark',
    critical: 'border-l-4 border-l-red-500 bg-nordic-bg-dark/70 hover:bg-nordic-bg-dark animate-pulse-slow',
};

const severityBadgeStyles = {
    low: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    critical: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
    // Get the appropriate icon from Lucide
    const IconComponent = event.icon
        ? (LucideIcons[event.icon as keyof typeof LucideIcons] as LucideIcon)
        : LucideIcons.AlertCircle;

    // Calculate time since triggered
    const timeSince = event.triggeredAt
        ? Math.floor((Date.now() - event.triggeredAt) / 1000 / 60)
        : 0;

    const timeText = timeSince < 1
        ? 'Nyss'
        : timeSince < 60
            ? `${timeSince}m sedan`
            : `${Math.floor(timeSince / 60)}h sedan`;

    return (
        <div
            onClick={onClick}
            className={`
                ${severityStyles[event.severity]}
                rounded-lg p-4 cursor-pointer
                transition-all duration-200
                shadow-md hover:shadow-lg
            `}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`
                    p-2 rounded-lg
                    ${event.severity === 'critical' ? 'bg-red-500/20' : 'bg-nordic-accent/20'}
                `}>
                    <IconComponent
                        size={24}
                        className={
                            event.severity === 'critical'
                                ? 'text-red-400'
                                : 'text-nordic-accent'
                        }
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-nordic-text-primary font-semibold truncate">
                            {event.title}
                        </h3>
                        <span className={`
                            px-2 py-0.5 text-xs rounded-full border
                            ${severityBadgeStyles[event.severity]}
                            whitespace-nowrap
                        `}>
                            {event.severity === 'low' && 'Låg'}
                            {event.severity === 'medium' && 'Medel'}
                            {event.severity === 'high' && 'Hög'}
                            {event.severity === 'critical' && 'KRITISK'}
                        </span>
                    </div>

                    <p className="text-nordic-text-secondary text-sm line-clamp-2 mb-2">
                        {event.description}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-nordic-text-muted">
                            {event.choices.length} {event.choices.length === 1 ? 'val' : 'val'}
                        </span>
                        <span className="text-nordic-text-muted">
                            {timeText}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
