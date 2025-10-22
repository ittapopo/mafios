"use client";

import { useState } from "react";
import { Swords, CheckCircle } from "lucide-react";
import { useGameState } from "@/app/lib/hooks";
import { MemberAction } from "@/app/lib/types";

export const FamilyMembers = () => {
    const { state, addKontanter, addInflytande, addRespekt, reducePolisbevakning, addExperience } = useGameState();
    const members = state.chapter.members;
    const [actionCooldowns, setActionCooldowns] = useState<Record<string, string | null>>({});

    const performAction = (memberId: string, memberName: string, action: MemberAction, memberPower: number) => {
        const cooldownKey = `${memberId}-${action}`;

        // Calculate rewards based on action and member power
        const powerMultiplier = memberPower / 100;

        switch (action) {
            case 'Trade':
                // Generate cash based on power
                const cashReward = Math.floor(500 * powerMultiplier * (1 + Math.random() * 0.5));
                addKontanter(cashReward);
                addExperience(5);
                break;

            case 'Negotiate':
                // Increase influence
                const influenceGain = Math.floor(10 * powerMultiplier);
                addInflytande(influenceGain);
                addExperience(5);
                break;

            case 'Command':
                // Increase respect
                const respectGain = Math.floor(3 * powerMultiplier);
                addRespekt(respectGain);
                addExperience(5);
                break;

            case 'Study':
                // Gain XP
                addExperience(15);
                break;

            case 'Train':
                // Gain XP and slight respect
                addExperience(10);
                addRespekt(1);
                break;

            case 'Quest':
                // Random reward - cash and XP
                const questReward = Math.floor(800 * powerMultiplier * (0.5 + Math.random()));
                addKontanter(questReward);
                addExperience(10);
                break;

            case 'Counsel':
                // Reduce heat
                reducePolisbevakning(5);
                addExperience(5);
                break;

            case 'Scheme':
                // High risk, high reward
                const schemeReward = Math.floor(1500 * powerMultiplier * Math.random());
                if (schemeReward > 500) {
                    addKontanter(schemeReward);
                    addExperience(15);
                }
                break;

            case 'Influence':
                // Increase influence and respect
                addInflytande(8);
                addRespekt(2);
                addExperience(8);
                break;
        }

        // Set cooldown
        setActionCooldowns(prev => ({ ...prev, [cooldownKey]: action }));
        setTimeout(() => {
            setActionCooldowns(prev => {
                const updated = { ...prev };
                delete updated[cooldownKey];
                return updated;
            });
        }, 3000);
    };

    const isOnCooldown = (memberId: string, action: MemberAction) => {
        const cooldownKey = `${memberId}-${action}`;
        return !!actionCooldowns[cooldownKey];
    };

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
                            <div className="flex gap-2 mb-2 flex-wrap">
                                {member.traits.map((trait) => (
                                    <span key={trait} className="text-xs px-2 py-1 bg-nordic-bg-dark text-nordic-text-secondary rounded">
                                        {trait}
                                    </span>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex gap-1 flex-wrap">
                                    {member.actions.map((action) => {
                                        const onCooldown = isOnCooldown(member.id, action);
                                        return (
                                            <button
                                                key={action}
                                                className={`text-xs px-2 py-1 rounded transition-all ${
                                                    onCooldown
                                                        ? 'bg-nordic-status-success text-white'
                                                        : 'bg-nordic-bg-dark text-nordic-text-secondary hover:bg-nordic-accent hover:text-white'
                                                }`}
                                                onClick={() => performAction(member.id, member.name, action, member.power)}
                                                disabled={onCooldown || member.status !== 'Active'}
                                            >
                                                {onCooldown ? <CheckCircle className="h-3 w-3 inline" /> : action}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Swords className="h-3 w-3 text-nordic-text-primary" />
                                    <span className="text-nordic-text-primary text-sm">{member.power}</span>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between text-xs">
                                <span className="text-nordic-text-muted">
                                    Loyalty: {member.loyalty}/100
                                </span>
                                <span className={`${
                                    member.status === 'Active' ? 'text-nordic-status-success' :
                                    member.status === 'On Mission' ? 'text-nordic-status-warning' :
                                    'text-nordic-text-muted'
                                }`}>
                                    {member.status}
                                </span>
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