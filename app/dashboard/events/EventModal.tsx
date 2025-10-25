"use client";

/**
 * EventModal Component
 *
 * Modal for displaying event details and making choices
 */

import React, { useState } from 'react';
import { GameEvent, EventChoice } from '@/app/lib/types';
import { useGameState } from '@/app/lib/contexts';
import * as LucideIcons from 'lucide-react';
import { LucideIcon, X, Check, AlertTriangle, Coins, TrendingUp, TrendingDown, Shield } from 'lucide-react';

interface EventModalProps {
    event: GameEvent;
    onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
    const { state, resolveEvent, dismissEvent } = useGameState();
    const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
    const [isResolving, setIsResolving] = useState(false);

    // Get the appropriate icon from Lucide
    const IconComponent = event.icon
        ? (LucideIcons[event.icon as keyof typeof LucideIcons] as LucideIcon)
        : LucideIcons.AlertCircle;

    const handleChoice = async (choiceId: string) => {
        setIsResolving(true);
        setSelectedChoiceId(choiceId);

        // Simulate a brief delay for dramatic effect
        await new Promise(resolve => setTimeout(resolve, 300));

        resolveEvent(event.id, choiceId);

        // Close modal after resolving
        setTimeout(() => {
            onClose();
        }, 500);
    };

    const handleDismiss = () => {
        dismissEvent(event.id);
        onClose();
    };

    const canAffordChoice = (choice: EventChoice): boolean => {
        const { player } = state;

        if (choice.requiredKontanter && player.kontanter < choice.requiredKontanter) return false;
        if (choice.requiredInflytande && player.inflytande < choice.requiredInflytande) return false;
        if (choice.requiredRespekt && player.respekt < choice.requiredRespekt) return false;
        if (choice.requiredLevel && player.level < choice.requiredLevel) return false;

        return true;
    };

    const renderRequirements = (choice: EventChoice) => {
        const requirements = [];

        if (choice.requiredKontanter) {
            requirements.push(
                <span key="kontanter" className="flex items-center gap-1">
                    <Coins size={14} />
                    {choice.requiredKontanter.toLocaleString()} kr
                </span>
            );
        }
        if (choice.requiredInflytande) {
            requirements.push(
                <span key="inflytande" className="flex items-center gap-1">
                    <TrendingUp size={14} />
                    {choice.requiredInflytande} Inflytande
                </span>
            );
        }
        if (choice.requiredRespekt) {
            requirements.push(
                <span key="respekt" className="flex items-center gap-1">
                    <Shield size={14} />
                    {choice.requiredRespekt} Respekt
                </span>
            );
        }
        if (choice.requiredLevel) {
            requirements.push(
                <span key="level">
                    Nivå {choice.requiredLevel}+
                </span>
            );
        }

        return requirements.length > 0 ? (
            <div className="flex flex-wrap gap-2 text-xs text-nordic-text-muted mt-2">
                {requirements}
            </div>
        ) : null;
    };

    const renderConsequences = (choice: EventChoice) => {
        const { successConsequences, failureConsequences, successChance } = choice;
        const hasFailure = failureConsequences && successChance && successChance < 100;

        return (
            <div className="mt-3 pt-3 border-t border-nordic-border">
                {/* Success outcomes */}
                <div className="mb-2">
                    <div className="flex items-center gap-2 text-xs text-green-400 mb-1">
                        <Check size={12} />
                        <span>
                            Success{successChance !== undefined && successChance < 100 ? ` (${successChance}%)` : ''}:
                        </span>
                    </div>
                    <div className="text-xs text-nordic-text-secondary pl-4">
                        {renderConsequencesList(successConsequences)}
                    </div>
                </div>

                {/* Failure outcomes */}
                {hasFailure && (
                    <div>
                        <div className="flex items-center gap-2 text-xs text-red-400 mb-1">
                            <AlertTriangle size={12} />
                            <span>Failure ({100 - (successChance || 0)}%):</span>
                        </div>
                        <div className="text-xs text-nordic-text-secondary pl-4">
                            {renderConsequencesList(failureConsequences)}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderConsequencesList = (consequences: EventChoice['successConsequences']) => {
        const items = [];

        if (consequences.kontanterChange) {
            items.push(
                <div key="kontanter" className="flex items-center gap-1">
                    {consequences.kontanterChange > 0 ? <TrendingUp size={12} className="text-green-400" /> : <TrendingDown size={12} className="text-red-400" />}
                    <span>{consequences.kontanterChange > 0 ? '+' : ''}{consequences.kontanterChange.toLocaleString()} kr</span>
                </div>
            );
        }
        if (consequences.respektChange) {
            items.push(
                <div key="respekt" className="flex items-center gap-1">
                    {consequences.respektChange > 0 ? <TrendingUp size={12} className="text-green-400" /> : <TrendingDown size={12} className="text-red-400" />}
                    <span>{consequences.respektChange > 0 ? '+' : ''}{consequences.respektChange} Respekt</span>
                </div>
            );
        }
        if (consequences.inflytandeChange) {
            items.push(
                <div key="inflytande" className="flex items-center gap-1">
                    {consequences.inflytandeChange > 0 ? <TrendingUp size={12} className="text-green-400" /> : <TrendingDown size={12} className="text-red-400" />}
                    <span>{consequences.inflytandeChange > 0 ? '+' : ''}{consequences.inflytandeChange} Inflytande</span>
                </div>
            );
        }
        if (consequences.heatChange) {
            items.push(
                <div key="heat" className="flex items-center gap-1">
                    {consequences.heatChange > 0 ? <TrendingUp size={12} className="text-red-400" /> : <TrendingDown size={12} className="text-green-400" />}
                    <span>{consequences.heatChange > 0 ? '+' : ''}{consequences.heatChange} Polisbevakning</span>
                </div>
            );
        }
        if (consequences.experienceChange) {
            items.push(
                <div key="exp" className="flex items-center gap-1">
                    <TrendingUp size={12} className="text-blue-400" />
                    <span>+{consequences.experienceChange} XP</span>
                </div>
            );
        }

        if (consequences.operationsShutdown) {
            items.push(
                <div key="shutdown" className="text-red-400">
                    Operationer stängda i {consequences.operationsShutdownDuration} min
                </div>
            );
        }

        return items.length > 0 ? items : <span className="text-nordic-text-muted">Inga direkta konsekvenser</span>;
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-nordic-bg-dark border border-nordic-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-nordic-bg-dark border-b border-nordic-border p-6 flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                        <div className={`
                            p-3 rounded-lg
                            ${event.severity === 'critical' ? 'bg-red-500/20' : 'bg-nordic-accent/20'}
                        `}>
                            <IconComponent
                                size={32}
                                className={
                                    event.severity === 'critical'
                                        ? 'text-red-400'
                                        : 'text-nordic-accent'
                                }
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-nordic-text-primary mb-2">
                                {event.title}
                            </h2>
                            <span className={`
                                px-3 py-1 text-xs rounded-full border
                                ${event.severity === 'low' && 'bg-blue-500/20 text-blue-300 border-blue-500/30'}
                                ${event.severity === 'medium' && 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}
                                ${event.severity === 'high' && 'bg-orange-500/20 text-orange-300 border-orange-500/30'}
                                ${event.severity === 'critical' && 'bg-red-500/20 text-red-300 border-red-500/30'}
                            `}>
                                {event.severity === 'low' && 'Låg Prioritet'}
                                {event.severity === 'medium' && 'Medel Prioritet'}
                                {event.severity === 'high' && 'Hög Prioritet'}
                                {event.severity === 'critical' && 'KRITISK PRIORITET'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-nordic-text-muted hover:text-nordic-text-primary transition-colors p-2"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-nordic-text-primary text-lg mb-4">
                        {event.description}
                    </p>

                    {event.flavorText && (
                        <p className="text-nordic-text-secondary italic mb-6 pl-4 border-l-2 border-nordic-accent">
                            {event.flavorText}
                        </p>
                    )}

                    {/* Choices */}
                    <div className="space-y-3 mt-6">
                        <h3 className="text-nordic-text-primary font-semibold mb-3">
                            Vad gör du?
                        </h3>

                        {event.choices.map((choice) => {
                            const canAfford = canAffordChoice(choice);
                            const isSelected = selectedChoiceId === choice.id;

                            return (
                                <button
                                    key={choice.id}
                                    onClick={() => handleChoice(choice.id)}
                                    disabled={!canAfford || isResolving}
                                    className={`
                                        w-full text-left p-4 rounded-lg border transition-all
                                        ${canAfford
                                            ? 'border-nordic-border bg-nordic-bg hover:border-nordic-accent hover:bg-nordic-bg-dark'
                                            : 'border-nordic-border/30 bg-nordic-bg/30 opacity-50 cursor-not-allowed'
                                        }
                                        ${isSelected ? 'border-nordic-accent ring-2 ring-nordic-accent/50' : ''}
                                    `}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="text-nordic-text-primary font-semibold">
                                            {choice.label}
                                        </h4>
                                        {!canAfford && (
                                            <span className="text-xs text-red-400 px-2 py-1 bg-red-500/10 rounded">
                                                Kan inte råd
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-nordic-text-secondary text-sm mb-2">
                                        {choice.description}
                                    </p>

                                    {renderRequirements(choice)}
                                    {renderConsequences(choice)}
                                </button>
                            );
                        })}
                    </div>

                    {/* Dismiss button */}
                    <button
                        onClick={handleDismiss}
                        disabled={isResolving}
                        className="mt-4 w-full p-3 text-nordic-text-muted hover:text-nordic-text-primary border border-nordic-border rounded-lg transition-colors"
                    >
                        Stäng (Ignorera händelse)
                    </button>
                </div>
            </div>
        </div>
    );
};
