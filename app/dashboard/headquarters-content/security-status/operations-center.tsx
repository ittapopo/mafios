"use client";

import { useState } from "react";
import { Operation } from "@/app/lib/types";
import { DollarSign, Shield, Target, Radio, Play, Square, TrendingUp, CheckCircle, XCircle, Users } from "lucide-react";
import { useGameState } from "@/app/lib/hooks";

export const OperationsCenter = () => {
    const {
        state,
        startOperation,
        stopOperation,
        upgradeOperation,
        assignMemberToOperation,
        removeMemberFromOperation
    } = useGameState();
    const operations = state.operations;
    const activeOperationIds = state.activeOperations;
    const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
    const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null);

    const getOperationIcon = (type: Operation['type']) => {
        switch (type) {
            case 'Income': return <DollarSign className="h-5 w-5" />;
            case 'Defense': return <Shield className="h-5 w-5" />;
            case 'Offense': return <Target className="h-5 w-5" />;
        }
    };

    const handleStartOperation = (op: Operation) => {
        const success = startOperation(op.id);
        if (success) {
            setActionResult({
                success: true,
                message: `Started ${op.name}. Passive benefits active!`,
            });
        } else {
            setActionResult({
                success: false,
                message: `Not enough kontanter! Need ${op.activationCost.toLocaleString()} SEK`,
            });
        }
        setTimeout(() => setActionResult(null), 3000);
    };

    const handleStopOperation = (op: Operation) => {
        stopOperation(op.id);
        setActionResult({
            success: true,
            message: `Stopped ${op.name}`,
        });
        setTimeout(() => setActionResult(null), 2000);
    };

    const handleUpgradeOperation = (op: Operation) => {
        const upgradeCost = op.upgradeCost * op.level;
        const success = upgradeOperation(op.id);
        if (success) {
            setActionResult({
                success: true,
                message: `Upgraded ${op.name} to level ${op.level + 1}!`,
            });
        } else {
            if (op.level >= op.maxLevel) {
                setActionResult({
                    success: false,
                    message: `${op.name} is already at maximum level!`,
                });
            } else {
                setActionResult({
                    success: false,
                    message: `Not enough kontanter! Need ${upgradeCost.toLocaleString()} SEK`,
                });
            }
        }
        setTimeout(() => setActionResult(null), 3000);
    };

    const handleAssignMember = (opId: string, memberId: string) => {
        assignMemberToOperation(opId, memberId);
        setActionResult({
            success: true,
            message: `Member assigned! Efficiency increased.`,
        });
        setTimeout(() => setActionResult(null), 2000);
    };

    const handleRemoveMember = (opId: string, memberId: string) => {
        removeMemberFromOperation(opId, memberId);
        setActionResult({
            success: true,
            message: `Member removed from operation.`,
        });
        setTimeout(() => setActionResult(null), 2000);
    };

    return (
        <div className="bg-nordic-bg-dark p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-nordic-text-primary text-xl">Operations Center</h3>
                <Radio className="text-nordic-text-primary h-6 w-6" />
            </div>

            {/* Action Result Notification */}
            {actionResult && (
                <div className={`mb-4 p-3 rounded-lg border ${
                    actionResult.success
                        ? 'bg-nordic-status-success/20 border-nordic-status-success'
                        : 'bg-nordic-status-danger/20 border-nordic-status-danger'
                }`}>
                    <p className={`text-sm font-semibold flex items-center gap-2 ${
                        actionResult.success ? 'text-nordic-status-success' : 'text-nordic-status-danger'
                    }`}>
                        {actionResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {actionResult.message}
                    </p>
                </div>
            )}

            <div className="grid gap-4">
                {operations.length > 0 ? (
                    operations.map((op) => {
                        const isActive = activeOperationIds.includes(op.id);
                        const upgradeCost = op.upgradeCost * op.level;
                        const assignedMembers = state.chapter.members.filter(m =>
                            op.assignedMemberIds?.includes(m.id)
                        );

                        return (
                            <div key={op.id} className="bg-nordic-bg p-4 rounded-lg border border-nordic-border hover:border-nordic-accent transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-nordic-text-primary">
                                        {getOperationIcon(op.type)}
                                        <span className="font-semibold">{op.name}</span>
                                        <span className="text-xs text-nordic-text-muted">Lvl {op.level}/{op.maxLevel}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        isActive ? 'bg-nordic-status-success text-white' :
                                        op.status === 'Cooldown' ? 'bg-nordic-status-danger text-white' :
                                        'bg-nordic-status-warning text-white'
                                    }`}>
                                        {isActive ? 'Active' : op.status}
                                    </span>
                                </div>

                                <p className="text-nordic-text-secondary text-sm mb-3">{op.description}</p>

                                {/* Benefits Display */}
                                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                                    {op.incomePerTick && (
                                        <div className="flex justify-between">
                                            <span className="text-nordic-text-secondary">Income/min:</span>
                                            <span className="text-nordic-status-success font-semibold">+{op.incomePerTick.toLocaleString()} SEK</span>
                                        </div>
                                    )}
                                    {op.heatReductionPerTick && (
                                        <div className="flex justify-between">
                                            <span className="text-nordic-text-secondary">Heat Reduction/min:</span>
                                            <span className="text-blue-400 font-semibold">-{op.heatReductionPerTick}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-nordic-text-secondary">Assigned Members:</span>
                                        <span className="text-nordic-text-primary">{assignedMembers.length}/{op.maxMembers}</span>
                                    </div>
                                </div>

                                {/* Efficiency Bar */}
                                <div className="w-full bg-nordic-bg-dark h-2 rounded-full mb-3">
                                    <div
                                        className="bg-nordic-accent h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${op.efficiency}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mb-3">
                                    <span className="text-nordic-text-muted text-xs">Efficiency</span>
                                    <span className="text-nordic-text-primary text-xs font-semibold">{op.efficiency}%</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {!isActive ? (
                                        <button
                                            onClick={() => handleStartOperation(op)}
                                            className="flex-1 py-2 px-3 bg-nordic-status-success hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                                        >
                                            <Play className="h-4 w-4" />
                                            Start ({op.activationCost.toLocaleString()} SEK)
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleStopOperation(op)}
                                            className="flex-1 py-2 px-3 bg-nordic-status-danger hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                                        >
                                            <Square className="h-4 w-4" />
                                            Stop
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleUpgradeOperation(op)}
                                        disabled={op.level >= op.maxLevel}
                                        className="flex-1 py-2 px-3 bg-nordic-accent hover:bg-nordic-accent-muted text-white font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                    >
                                        <TrendingUp className="h-4 w-4" />
                                        {op.level >= op.maxLevel ? 'Max Level' : `Upgrade (${upgradeCost.toLocaleString()})`}
                                    </button>

                                    <button
                                        onClick={() => setSelectedOperation(op)}
                                        className="py-2 px-3 bg-nordic-border hover:bg-nordic-accent text-nordic-text-primary hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
                                        title="Manage members"
                                    >
                                        <Users className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-nordic-text-muted text-center py-4">
                        No operations available
                    </p>
                )}
            </div>

            {/* Member Assignment Modal */}
            {selectedOperation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedOperation(null)}>
                    <div className="bg-nordic-bg-dark p-6 rounded-lg border-2 border-nordic-accent max-w-md w-full m-4" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-nordic-text-primary text-xl font-bold mb-2">{selectedOperation.name}</h3>
                        <p className="text-nordic-text-secondary text-sm mb-4">Assign members to boost efficiency</p>

                        <div className="mb-4">
                            <h4 className="text-nordic-text-primary font-semibold mb-2 text-sm">Assigned Members</h4>
                            {(selectedOperation.assignedMemberIds?.length || 0) > 0 ? (
                                <div className="space-y-2">
                                    {state.chapter.members
                                        .filter(m => selectedOperation.assignedMemberIds?.includes(m.id))
                                        .map(member => (
                                            <div key={member.id} className="flex justify-between items-center bg-nordic-bg p-2 rounded">
                                                <span className="text-nordic-text-primary text-sm">{member.name}</span>
                                                <button
                                                    onClick={() => handleRemoveMember(selectedOperation.id, member.id)}
                                                    className="text-xs px-2 py-1 bg-nordic-status-danger text-white rounded hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-nordic-text-muted text-sm">No members assigned</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <h4 className="text-nordic-text-primary font-semibold mb-2 text-sm">Available Members</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {state.chapter.members
                                    .filter(m => !selectedOperation.assignedMemberIds?.includes(m.id))
                                    .map(member => (
                                        <div key={member.id} className="flex justify-between items-center bg-nordic-bg p-2 rounded">
                                            <span className="text-nordic-text-primary text-sm">{member.name}</span>
                                            <button
                                                onClick={() => handleAssignMember(selectedOperation.id, member.id)}
                                                disabled={(selectedOperation.assignedMemberIds?.length || 0) >= selectedOperation.maxMembers}
                                                className="text-xs px-2 py-1 bg-nordic-status-success text-white rounded hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    ))}
                            </div>
                            {(selectedOperation.assignedMemberIds?.length || 0) >= selectedOperation.maxMembers && (
                                <p className="text-nordic-status-warning text-xs mt-2">Maximum members assigned</p>
                            )}
                        </div>

                        <button
                            onClick={() => setSelectedOperation(null)}
                            className="w-full py-2 bg-nordic-border text-nordic-text-primary rounded-lg hover:bg-nordic-accent hover:text-white transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
