"use client";

/**
 * Game Context
 *
 * Centralized game state management with persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { GameState, GameActions, DEFAULT_GAME_STATE, PlayerStats } from '../types/game/state';
import { EquipmentItemType, EquipmentSlot } from '../types';
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

    // Passive income from territories and operations every 60 seconds
    useEffect(() => {
        const incomeInterval = setInterval(() => {
            setState((prev) => {
                const territoryIncome = prev.territoryStats.totalIncome;

                // Calculate income and heat reduction from active operations
                const activeOps = prev.operations.filter(op =>
                    prev.activeOperations.includes(op.id)
                );

                const operationIncome = activeOps.reduce((sum, op) => {
                    return sum + (op.incomePerTick || 0);
                }, 0);

                const heatReduction = activeOps.reduce((sum, op) => {
                    return sum + (op.heatReductionPerTick || 0);
                }, 0);

                const totalIncome = territoryIncome + operationIncome;

                // Only update if there's income or heat reduction
                if (totalIncome > 0 || heatReduction > 0) {
                    return {
                        ...prev,
                        player: {
                            ...prev.player,
                            kontanter: prev.player.kontanter + totalIncome,
                            polisbevakning: Math.max(0, prev.player.polisbevakning - heatReduction),
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

    const buyEquipment = useCallback((item: EquipmentItemType): boolean => {
        let success = false;
        setState((prev) => {
            // Check if player has enough money
            if (prev.player.kontanter < item.price) {
                return prev;
            }

            success = true;
            return {
                ...prev,
                player: {
                    ...prev.player,
                    kontanter: prev.player.kontanter - item.price,
                },
                inventory: [...prev.inventory, { ...item, equipped: false }],
            };
        });
        return success;
    }, [setState]);

    const sellEquipment = useCallback((itemId: string) => {
        setState((prev) => {
            // Find item in inventory
            const item = prev.inventory.find(i => i.id === itemId);
            if (!item) return prev;

            // Sell for 60% of purchase price
            const sellPrice = Math.floor(item.price * 0.6);

            return {
                ...prev,
                player: {
                    ...prev.player,
                    kontanter: prev.player.kontanter + sellPrice,
                },
                inventory: prev.inventory.filter(i => i.id !== itemId),
            };
        });
    }, [setState]);

    const equipItem = useCallback((itemId: string) => {
        setState((prev) => {
            // Find item in inventory
            const item = prev.inventory.find(i => i.id === itemId);
            if (!item) return prev;

            // Remove from inventory
            const newInventory = prev.inventory.filter(i => i.id !== itemId);

            // Remove existing item in same slot and add to inventory
            const currentItem = prev.equipment.find(e => e.slot === item.slot);
            if (currentItem) {
                newInventory.push({ ...currentItem, equipped: false });
            }

            // Equip new item
            const newEquipment = prev.equipment.filter(e => e.slot !== item.slot);
            newEquipment.push({ ...item, equipped: true });

            return {
                ...prev,
                equipment: newEquipment,
                inventory: newInventory,
            };
        });
    }, [setState]);

    const unequipItem = useCallback((slot: EquipmentSlot) => {
        setState((prev) => {
            // Find equipped item
            const item = prev.equipment.find(e => e.slot === slot);
            if (!item) return prev;

            return {
                ...prev,
                equipment: prev.equipment.filter(e => e.slot !== slot),
                inventory: [...prev.inventory, { ...item, equipped: false }],
            };
        });
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

    const startOperation = useCallback((operationId: string): boolean => {
        let success = false;
        setState((prev) => {
            const operation = prev.operations.find(op => op.id === operationId);
            if (!operation || operation.status === 'Active') return prev;

            // Check if player has enough money
            if (prev.player.kontanter < operation.activationCost) {
                return prev;
            }

            success = true;
            return {
                ...prev,
                player: {
                    ...prev.player,
                    kontanter: prev.player.kontanter - operation.activationCost,
                },
                activeOperations: [...prev.activeOperations, operationId],
                operations: prev.operations.map(op =>
                    op.id === operationId
                        ? { ...op, status: 'Active' as const }
                        : op
                ),
            };
        });
        return success;
    }, [setState]);

    const stopOperation = useCallback((operationId: string) => {
        setState((prev) => ({
            ...prev,
            activeOperations: prev.activeOperations.filter(id => id !== operationId),
            operations: prev.operations.map(op =>
                op.id === operationId
                    ? { ...op, status: 'Ready' as const }
                    : op
            ),
        }));
    }, [setState]);

    const upgradeOperation = useCallback((operationId: string): boolean => {
        let success = false;
        setState((prev) => {
            const operation = prev.operations.find(op => op.id === operationId);
            if (!operation || operation.level >= operation.maxLevel) return prev;

            const upgradeCost = operation.upgradeCost * operation.level;

            // Check if player has enough money
            if (prev.player.kontanter < upgradeCost) {
                return prev;
            }

            success = true;
            return {
                ...prev,
                player: {
                    ...prev.player,
                    kontanter: prev.player.kontanter - upgradeCost,
                },
                operations: prev.operations.map(op =>
                    op.id === operationId
                        ? {
                            ...op,
                            level: op.level + 1,
                            efficiency: Math.min(100, op.efficiency + 5),
                            incomePerTick: op.incomePerTick ? Math.floor(op.incomePerTick * 1.25) : undefined,
                            heatReductionPerTick: op.heatReductionPerTick ? op.heatReductionPerTick + 1 : undefined,
                        }
                        : op
                ),
            };
        });
        return success;
    }, [setState]);

    const assignMemberToOperation = useCallback((operationId: string, memberId: string) => {
        setState((prev) => {
            const operation = prev.operations.find(op => op.id === operationId);
            if (!operation) return prev;

            const assignedCount = operation.assignedMemberIds?.length || 0;
            if (assignedCount >= operation.maxMembers) return prev;

            return {
                ...prev,
                operations: prev.operations.map(op =>
                    op.id === operationId
                        ? {
                            ...op,
                            assignedMemberIds: [...(op.assignedMemberIds || []), memberId],
                            efficiency: Math.min(100, op.efficiency + 3),
                        }
                        : op
                ),
            };
        });
    }, [setState]);

    const removeMemberFromOperation = useCallback((operationId: string, memberId: string) => {
        setState((prev) => ({
            ...prev,
            operations: prev.operations.map(op =>
                op.id === operationId
                    ? {
                        ...op,
                        assignedMemberIds: (op.assignedMemberIds || []).filter(id => id !== memberId),
                        efficiency: Math.max(0, op.efficiency - 3),
                    }
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
        buyEquipment,
        sellEquipment,
        equipItem,
        unequipItem,
        captureTerritory,
        loseTerritory,
        updateTerritoryControl,
        startOperation,
        stopOperation,
        upgradeOperation,
        assignMemberToOperation,
        removeMemberFromOperation,
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
