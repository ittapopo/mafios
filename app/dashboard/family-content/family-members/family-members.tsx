"use client";

import { Swords } from "lucide-react";
import { useGameState } from "@/app/lib/hooks";

export const FamilyMembers = () => {
    const { state } = useGameState();
    const members = state.chapter.members;

    return (
        <div className="bg-nordic-bg-dark p-4 rounded-lg border border-nordic-border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-nordic-text-primary text-lg">Chapter Members</h3>
                <button className="text-xs text-nordic-text-primary hover:text-nordic-text-secondary border border-nordic-border px-2 py-1 rounded">
                    Manage Chapter
                </button>
            </div>
            <div className="space-y-3">
                {members.length > 0 ? (
                    members.map((member) => (
                        <div key={member.id} className="border border-nordic-border bg-nordic-bg p-3 rounded">
                            <div className="flex justify-between mb-2">
                                <span className="text-nordic-text-primary font-bold">{member.name}</span>
                                <span className="text-xs text-nordic-accent-muted">{member.role}</span>
                            </div>
                            <div className="flex gap-2 mb-2">
                                {member.traits.map((trait) => (
                                    <span key={trait} className="text-xs px-2 py-1 bg-nordic-bg-dark text-nordic-text-secondary rounded">
                                        {trait}
                                    </span>
                                ))}
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 flex-wrap">
                                    {member.actions.map((action) => (
                                        <button
                                            key={action}
                                            className="text-xs px-2 py-1 bg-nordic-bg-dark text-nordic-text-secondary hover:bg-nordic-border rounded"
                                            onClick={() => console.log(`${member.name} performing ${action}`)}
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Swords className="h-3 w-3 text-nordic-text-primary" />
                                    <span className="text-nordic-text-primary text-sm">{member.power}</span>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-nordic-text-muted">
                                Loyalty: {member.loyalty}/100
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-nordic-text-muted text-center py-4">
                        No chapter members yet
                    </p>
                )}
            </div>
        </div>
    );
};