"use client";

import { Operation } from "@/app/lib/types";
import { DollarSign, Shield, Target, Radio } from "lucide-react";
import { useGameState } from "@/app/lib/hooks";

export const OperationsCenter = () => {
    const { state } = useGameState();
    const operations = state.operations;

    const getOperationIcon = (type: Operation['type']) => {
        switch (type) {
            case 'Income': return <DollarSign className="h-5 w-5" />;
            case 'Defense': return <Shield className="h-5 w-5" />;
            case 'Offense': return <Target className="h-5 w-5" />;
        }
    };

    return (
        <div className="bg-nordic-bg-dark p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-nordic-text-primary text-xl">Operations Center</h3>
                <Radio className="text-nordic-text-primary h-6 w-6" />
            </div>
            <div className="grid gap-4">
                {operations.length > 0 ? (
                    operations.map((op) => (
                        <div key={op.name} className="bg-nordic-bg p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-nordic-text-primary">
                                    {getOperationIcon(op.type)}
                                    <span>{op.name}</span>
                                </div>
                                <span className={`px-2 py-1 rounded text-sm ${
                                    op.status === 'Active' ? 'bg-nordic-status-success text-white' :
                                    op.status === 'Cooldown' ? 'bg-nordic-status-danger text-white' :
                                    'bg-nordic-status-warning text-white'
                                    }`}>
                                    {op.status}
                                </span>
                            </div>
                            <div className="w-full bg-nordic-bg-dark h-2 rounded-full">
                                <div
                                    className="bg-nordic-accent h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${op.efficiency}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-nordic-text-muted text-sm">Efficiency</span>
                                <span className="text-nordic-text-primary text-sm">{op.efficiency}%</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-nordic-text-muted text-center py-4">
                        No active operations
                    </p>
                )}
            </div>
        </div>
    );
};