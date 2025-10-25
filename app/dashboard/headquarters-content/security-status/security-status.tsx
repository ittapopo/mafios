"use client";

import { SecurityLevel } from "@/app/lib/types";
import { Shield } from "lucide-react";
import { useGameState } from "@/app/lib/hooks";

export const SecurityStatus = () => {
    // TODO: Add securityLevels to GameState when implementing security upgrade system
    const securityLevels: SecurityLevel[] = [
        {
            area: 'Clubhouse Perimeter',
            level: 3,
            status: 'Secured',
            description: 'Armed members, security cameras, reinforced entry'
        },
        {
            area: 'Safe House',
            level: 4,
            status: 'Maximum Security',
            description: 'Hidden location, biometric locks, escape routes'
        },
        {
            area: 'Communications',
            level: 2,
            status: 'Compromised',
            description: 'Encrypted phones, potential police surveillance detected'
        }
    ];

    return (
        <div className="bg-nordic-bg-dark p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-nordic-text-primary text-xl">Security Status</h3>
                <Shield className="text-nordic-text-primary h-6 w-6" />
            </div>
            <div className="space-y-4">
                {securityLevels.map((security) => (
                    <div key={security.area} className="border-b border-nordic-border pb-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-nordic-text-secondary">{security.area}</span>
                            <span className={`px-2 py-1 rounded text-sm ${
                                security.status === 'Compromised' ? 'bg-nordic-status-danger text-white' :
                                security.status === 'Secured' ? 'bg-nordic-status-success text-white' :
                                'bg-nordic-accent text-white'
                                }`}>
                                {security.status}
                            </span>
                        </div>
                        <div className="w-full bg-nordic-bg h-2 rounded-full">
                            <div
                                className="bg-nordic-accent h-2 rounded-full"
                                style={{ width: `${(security.level / 5) * 100}%` }}
                            />
                        </div>
                        <p className="text-nordic-text-muted text-sm mt-2">{security.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};