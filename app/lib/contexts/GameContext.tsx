"use client";

/**
 * Game Context
 *
 * Centralized game state management with persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { GameState, GameActions, DEFAULT_GAME_STATE, PlayerStats } from '../types/game/state';
import { EquipmentItemType } from '../types';
import { FamilyMember } from '../types/game/family';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CharacterService } from '../data/services/character.service';
import { BusinessService } from '../data/services/business.service';
import { mockFamilyMembers, mockFamilyStats } from '../data/mock/family';
import { mockSecurityLevels, mockOperations } from '../data/mock/headquarters';
import { mockTerritories, mockTerritoryStats } from '../data/mock/territory';

const STORAGE_KEY = 'mafios-game-state';

interface GameContextType extends GameActions {
    state: GameState;
    isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
    children: ReactNode;
}

/**
 * Initialize game state with mock data from services
 */
const initializeGameState = (): GameState => {
    return {
        ...DEFAULT_GAME_STATE,
        equipment: CharacterService.getEquipment(),
        chapter: {
            name: 'Stockholm MC',
            members: mockFamilyMembers,
            stats: mockFamilyStats,
            reputation: 0,
        },
        operations: mockOperations,
        territories: mockTerritories,
        territoryStats: mockTerritoryStats,
    };
};

/**
 * Game Provider Component
 *
 * Manages global game state with localStorage persistence
 */
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    // Try to load from localStorage, otherwise initialize with mock data
    const [state, setState] = useLocalStorage<GameState>(STORAGE_KEY, initializeGameState());
    const [isLoading, setIsLoading] = useState(true);
    const [playTimeInterval, setPlayTimeInterval] = useState<NodeJS.Timeout | null>(null);

    // Initialize game and start play time tracker
    useEffect(() => {
        // Check if this is first load (no equipment means fresh start)
        if (state.equipment.length === 0 && state.chapter.members.length === 0) {
            setState(initializeGameState());
        }

        setIsLoading(false);

        // Track play time
        const interval = setInterval(() => {
            setState((prev) => ({
                ...prev,
                playTime: prev.playTime + 1,
            }));
        }, 1000);

        setPlayTimeInterval(interval);

        return () => {
            if (interval) clearInterval(interval);
        };
    }, []);

    // Auto-save every 30 seconds
    useEffect(() => {
        const saveInterval = setInterval(() => {
            setState((prev) => ({
                ...prev,
                lastSaved: Date.now(),
            }));
        }, 30000);

        return () => clearInterval(saveInterval);
    }, []);

    // Passive income from territories every 60 seconds
    useEffect(() => {
        const incomeInterval = setInterval(() => {
            setState((prev) => {
                const territoryIncome = prev.territoryStats.totalIncome;

                // Only award income if we have controlled territories
                if (territoryIncome > 0) {
                    return {
                        ...prev,
                        player: {
                            ...prev.player,
                            kontanter: prev.player.kontanter + territoryIncome,
                        },
                    };
                }

                return prev;
            });
        }, 60000); // Every 60 seconds

        return () => clearInterval(incomeInterval);
    }, []);

    // ===== Resource Management =====

    const addKontanter = useCallback((amount: number) => {
        setState((prev) => ({
            ...prev,
            player: {
                ...prev.player,
                kontanter: prev.player.kontanter + amount,
            },
        }));
    }, [setState]);

    const removeKontanter = useCallback((amount: number) => {
        setState((prev) => ({
            ...prev,
            player: {
                ...prev.player,
                kontanter: Math.max(0, prev.player.kontanter - amount),
            },
        }));
    }, [setState]);

    const addInflytande = useCallback((amount: number) => {
        setState((prev) => ({
            ...prev,
            player: {
                ...prev.player,
                inflytande: prev.player.inflytande + amount,
            },
        }));
    }, [setState]);

    const addRespekt = useCallback((amount: number) => {
        setState((prev) => ({
            ...prev,
            player: {
                ...prev.player,
                respekt: Math.min(100, prev.player.respekt + amount),
            },
        }));
    }, [setState]);

    const addPolisbevakning = useCallback((amount: number) => {
        setState((prev) => ({
            ...prev,
            player: {
                ...prev.player,
                polisbevakning: Math.min(100, prev.player.polisbevakning + amount),
            },
        }));
    }, [setState]);

    const reducePolisbevakning = useCallback((amount: number) => {
        setState((prev) => ({
            ...prev,
            player: {
                ...prev.player,
                polisbevakning: Math.max(0, prev.player.polisbevakning - amount),
            },
        }));
    }, [setState]);

    // ===== Experience & Leveling =====

    const addExperience = useCallback((amount: number) => {
        setState((prev) => {
            const newExp = prev.player.experience + amount;
            let newLevel = prev.player.level;
            let expToNext = prev.player.experienceToNext;
            let remainingExp = newExp;

            // Level up logic
            while (remainingExp >= expToNext) {
                remainingExp -= expToNext;
                newLevel++;
                expToNext = Math.floor(100 * Math.pow(1.5, newLevel - 1)); // Exponential scaling
            }

            return {
                ...prev,
                player: {
                    ...prev.player,
                    experience: remainingExp,
                    level: newLevel,
                    experienceToNext: expToNext,
                },
            };
        });
    }, [setState]);

    // ===== Equipment Management =====

    const addEquipment = useCallback((item: EquipmentItemType) => {
        setState((prev) => {
            // Remove existing item in same slot
            const filtered = prev.equipment.filter(e => e.slot !== item.slot);
            return {
                ...prev,
                equipment: [...filtered, item],
            };
        });
    }, [setState]);

    const removeEquipment = useCallback((slot: string) => {
        setState((prev) => ({
            ...prev,
            equipment: prev.equipment.filter(e => e.slot !== slot),
        }));
    }, [setState]);

    // ===== Territory Management =====

    const captureTerritory = useCallback((territoryId: string) => {
        setState((prev) => {
            const updatedTerritories = prev.territories.map(t =>
                t.id === territoryId
                    ? { ...t, status: 'Controlled' as const, control: 100 }
                    : t
            );

            const controlled = updatedTerritories.filter(t => t.status === 'Controlled').length;
            const contested = updatedTerritories.filter(t => t.status === 'Contested').length;
            const totalIncome = updatedTerritories
                .filter(t => t.status === 'Controlled')
                .reduce((sum, t) => sum + t.income, 0);

            return {
                ...prev,
                territories: updatedTerritories,
                territoryStats: {
                    ...prev.territoryStats,
                    controlledTerritories: controlled,
                    contestedTerritories: contested,
                    totalIncome,
                },
            };
        });
    }, [setState]);

    const loseTerritory = useCallback((territoryId: string) => {
        setState((prev) => {
            const updatedTerritories = prev.territories.map(t =>
                t.id === territoryId
                    ? { ...t, status: 'Enemy' as const, control: 0 }
                    : t
            );

            const controlled = updatedTerritories.filter(t => t.status === 'Controlled').length;
            const contested = updatedTerritories.filter(t => t.status === 'Contested').length;
            const totalIncome = updatedTerritories
                .filter(t => t.status === 'Controlled')
                .reduce((sum, t) => sum + t.income, 0);

            return {
                ...prev,
                territories: updatedTerritories,
                territoryStats: {
                    ...prev.territoryStats,
                    controlledTerritories: controlled,
                    contestedTerritories: contested,
                    totalIncome,
                },
            };
        });
    }, [setState]);

    const updateTerritoryControl = useCallback((territoryId: string, control: number) => {
        setState((prev) => ({
            ...prev,
            territories: prev.territories.map(t =>
                t.id === territoryId
                    ? { ...t, control: Math.max(0, Math.min(100, control)) }
                    : t
            ),
        }));
    }, [setState]);

    // ===== Operations Management =====

    const startOperation = useCallback((operationId: string) => {
        setState((prev) => ({
            ...prev,
            activeOperations: [...prev.activeOperations, operationId],
            operations: prev.operations.map(op =>
                op.name === operationId
                    ? { ...op, status: 'Active' as const }
                    : op
            ),
        }));
    }, [setState]);

    const stopOperation = useCallback((operationId: string) => {
        setState((prev) => ({
            ...prev,
            activeOperations: prev.activeOperations.filter(id => id !== operationId),
            operations: prev.operations.map(op =>
                op.name === operationId
                    ? { ...op, status: 'Ready' as const }
                    : op
            ),
        }));
    }, [setState]);

    // ===== Family Management =====

    const addMember = useCallback((member: FamilyMember) => {
        setState((prev) => ({
            ...prev,
            chapter: {
                ...prev.chapter,
                members: [...prev.chapter.members, member],
            },
        }));
    }, [setState]);

    const removeMember = useCallback((memberName: string) => {
        setState((prev) => ({
            ...prev,
            chapter: {
                ...prev.chapter,
                members: prev.chapter.members.filter(m => m.name !== memberName),
            },
        }));
    }, [setState]);

    const updateMemberLoyalty = useCallback((memberName: string, loyalty: number) => {
        setState((prev) => ({
            ...prev,
            chapter: {
                ...prev.chapter,
                members: prev.chapter.members.map(m =>
                    m.name === memberName
                        ? { ...m, loyalty: Math.max(0, Math.min(100, loyalty)) }
                        : m
                ),
            },
        }));
    }, [setState]);

    // ===== Persistence =====

    const saveGame = useCallback(() => {
        setState((prev) => ({
            ...prev,
            lastSaved: Date.now(),
        }));
    }, [setState]);

    const loadGame = useCallback(() => {
        // Force reload from localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setState(parsed);
            } catch (error) {
                console.error('Failed to load game:', error);
            }
        }
    }, [setState]);

    const resetGame = useCallback(() => {
        if (confirm('Are you sure you want to reset your game? This cannot be undone.')) {
            setState(DEFAULT_GAME_STATE);
        }
    }, [setState]);

    const value: GameContextType = {
        state,
        isLoading,
        addKontanter,
        removeKontanter,
        addInflytande,
        addRespekt,
        addPolisbevakning,
        reducePolisbevakning,
        addExperience,
        addEquipment,
        removeEquipment,
        captureTerritory,
        loseTerritory,
        updateTerritoryControl,
        startOperation,
        stopOperation,
        addMember,
        removeMember,
        updateMemberLoyalty,
        saveGame,
        loadGame,
        resetGame,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

/**
 * useGameState Hook
 *
 * Access game state and actions from any component
 *
 * @example
 * const { state, addKontanter } = useGameState();
 * addKontanter(1000);
 */
export const useGameState = (): GameContextType => {
    const context = useContext(GameContext);

    if (context === undefined) {
        throw new Error('useGameState must be used within a GameProvider');
    }

    return context;
};
