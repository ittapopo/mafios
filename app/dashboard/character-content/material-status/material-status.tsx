"use client";

import { DollarSign, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { MaterialStatusItem } from "./material-status-item";
import { useGameState } from "@/app/lib/hooks";

const MaterialStatus = () => {
    const { state } = useGameState();

    // Convert player stats to material status format
    const materials = [
        {
            icon: <DollarSign />,
            label: 'Cash',
            value: `${state.player.kontanter.toLocaleString()} SEK`,
            status: state.player.kontanter > 100000 ? 'Abundant' : state.player.kontanter > 50000 ? 'Moderate' : 'Low'
        },
        {
            icon: <TrendingUp />,
            label: 'Influence',
            value: `${state.player.inflytande}/500`,
            status: state.player.inflytande > 300 ? 'Strong' : state.player.inflytande > 150 ? 'Growing' : 'Weak'
        },
        {
            icon: <Users />,
            label: 'Respect',
            value: `${state.player.respekt}/100`,
            status: state.player.respekt > 70 ? 'Feared' : state.player.respekt > 40 ? 'Known' : 'Unknown'
        },
        {
            icon: <AlertTriangle />,
            label: 'Police Heat',
            value: `${state.player.polisbevakning}/100`,
            status: state.player.polisbevakning > 70 ? 'Critical' : state.player.polisbevakning > 40 ? 'Elevated' : 'Low'
        },
    ];

    return (
        <div className="bg-nordic-bg-dark p-6 rounded-lg">
            <h3 className="text-nordic-text-primary text-xl mb-4">Resource Status</h3>
            <div className="space-y-4">
                {materials.map((item) => (
                    <MaterialStatusItem key={item.label} item={item} />
                ))}
            </div>
        </div>
    );
};

export { MaterialStatus }