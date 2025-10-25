"use client";

import { Bell, Gift, Mail, MessageSquare, UserPlus, Zap } from "lucide-react";
import { useState } from "react";
import { useGameState } from "@/app/lib/contexts";
import { EventsList } from "../events";

export const RightNavigationBar = () => {
    const { state } = useGameState();
    const [activeSection, setActiveSection] = useState<'events' | 'social'>('events');

    // Count active events
    const activeEventsCount = state.randomEvents?.filter(
        event => event.triggered && !event.resolved
    ).length ?? 0;

    return (
        <nav className="w-64 bg-nordic-bg-dark p-4 space-y-4 h-full overflow-y-auto">
            {/* Section Tabs */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveSection('events')}
                    className={`
                        flex-1 px-3 py-2 rounded-lg transition-colors text-sm font-semibold
                        ${activeSection === 'events'
                            ? 'bg-nordic-accent text-nordic-text-primary'
                            : 'bg-nordic-bg text-nordic-text-secondary hover:bg-nordic-bg-dark'
                        }
                    `}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Zap size={16} />
                        <span>Händelser</span>
                        {activeEventsCount > 0 && (
                            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                {activeEventsCount}
                            </span>
                        )}
                    </div>
                </button>
                <button
                    onClick={() => setActiveSection('social')}
                    className={`
                        flex-1 px-3 py-2 rounded-lg transition-colors text-sm font-semibold
                        ${activeSection === 'social'
                            ? 'bg-nordic-accent text-nordic-text-primary'
                            : 'bg-nordic-bg text-nordic-text-secondary hover:bg-nordic-bg-dark'
                        }
                    `}
                >
                    Social
                </button>
            </div>

            {/* Events Section */}
            {activeSection === 'events' && (
                <div className="space-y-4">
                    <div>
                        <h2 className="text-nordic-text-primary text-xl font-bold mb-1">Händelser</h2>
                        <p className="text-nordic-text-muted text-xs">Aktiva random encounters</p>
                    </div>
                    <EventsList />
                </div>
            )}

            {/* Social Section */}
            {activeSection === 'social' && (
                <div className="space-y-4">
                    <div>
                        <h2 className="text-nordic-text-primary text-xl font-bold">Social</h2>
                    </div>
                    <div className="space-y-2 opacity-50">
                        <div className="p-3 bg-nordic-bg rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageSquare size={18} className="text-nordic-text-muted" />
                                <span className="text-nordic-text-secondary">Messages</span>
                            </div>
                            <span className="text-xs text-nordic-text-muted">Kommer snart</span>
                        </div>
                        <div className="p-3 bg-nordic-bg rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bell size={18} className="text-nordic-text-muted" />
                                <span className="text-nordic-text-secondary">Notifications</span>
                            </div>
                            <span className="text-xs text-nordic-text-muted">Kommer snart</span>
                        </div>
                        <div className="p-3 bg-nordic-bg rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Mail size={18} className="text-nordic-text-muted" />
                                <span className="text-nordic-text-secondary">Invites</span>
                            </div>
                            <span className="text-xs text-nordic-text-muted">Kommer snart</span>
                        </div>
                        <div className="p-3 bg-nordic-bg rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <UserPlus size={18} className="text-nordic-text-muted" />
                                <span className="text-nordic-text-secondary">Recruitment</span>
                            </div>
                            <span className="text-xs text-nordic-text-muted">Kommer snart</span>
                        </div>
                        <div className="p-3 bg-nordic-bg rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Gift size={18} className="text-nordic-text-muted" />
                                <span className="text-nordic-text-secondary">Rewards</span>
                            </div>
                            <span className="text-xs text-nordic-text-muted">Kommer snart</span>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};