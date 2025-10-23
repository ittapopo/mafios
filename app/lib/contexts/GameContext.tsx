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
import { mockBusinesses } from '../data/mock/businesses';
import { mockRivalGangs } from '../data/mock/rival-gangs';

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
    // Calculate gang stats
    const hostileGangs = mockRivalGangs.filter(g => g.relationStatus === 'Hostile').length;
    const alliedGangs = mockRivalGangs.filter(g => g.relationStatus === 'Allied').length;

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
        businesses: mockBusinesses,
        rivalGangs: mockRivalGangs,
        gangStats: {
            totalRivalGangs: mockRivalGangs.length,
            hostileGangs,
            alliedGangs,
            activeEvents: 0,
            territoriesLostToGangs: 0,
        },
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

    // Passive income from territories, operations, and businesses every 60 seconds
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

                // Calculate income from owned businesses
                const ownedBusinesses = prev.businesses.filter(b => b.status === 'owned');
                const businessIncome = ownedBusinesses.reduce((sum, b) => {
                    // Apply efficiency modifier (efficiency is 0-100, convert to multiplier)
                    const efficiencyMultiplier = b.efficiency / 100;
                    return sum + Math.floor(b.incomePerTick * efficiencyMultiplier);
                }, 0);

                // Accumulate heat from businesses
                const businessHeat = ownedBusinesses.reduce((sum, b) => {
                    return sum + b.heatGeneration;
                }, 0);

                const totalIncome = territoryIncome + operationIncome + businessIncome;
                const netHeatChange = businessHeat - heatReduction;

                // Only update if there's income or heat change
                if (totalIncome > 0 || netHeatChange !== 0) {
                    return {
                        ...prev,
                        player: {
                            ...prev.player,
                            kontanter: prev.player.kontanter + totalIncome,
                            polisbevakning: Math.max(0, Math.min(100, prev.player.polisbevakning + netHeatChange)),
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

    // ===== Business Management =====

    const purchaseBusiness = useCallback((businessId: string): boolean => {
        let success = false;
        setState((prev) => {
            const business = prev.businesses.find(b => b.id === businessId);
            if (!business || business.status === 'owned') return prev;

            // Check requirements
            if (prev.player.level < business.requiredLevel) return prev;
            if (prev.player.respekt < business.requiredRespekt) return prev;
            if (prev.player.kontanter < business.purchasePrice) return prev;

            // Check prerequisites
            if (business.prerequisiteBusinesses) {
                const hasPrerequisites = business.prerequisiteBusinesses.every(prereqId =>
                    prev.businesses.find(b => b.id === prereqId)?.status === 'owned'
                );
                if (!hasPrerequisites) return prev;
            }

            success = true;

            const updatedBusinesses = prev.businesses.map(b =>
                b.id === businessId
                    ? { ...b, status: 'owned' as const }
                    : b
            );

            const ownedBusinesses = updatedBusinesses.filter(b => b.status === 'owned');
            const totalIncome = ownedBusinesses.reduce((sum, b) => sum + b.incomePerTick, 0);
            const totalLaundering = ownedBusinesses.reduce((sum, b) => sum + (b.launderingCapacity || 0), 0);

            return {
                ...prev,
                player: {
                    ...prev.player,
                    kontanter: prev.player.kontanter - business.purchasePrice,
                },
                businesses: updatedBusinesses,
                businessStats: {
                    ...prev.businessStats,
                    ownedBusinesses: ownedBusinesses.length,
                    totalIncome,
                    totalLaunderingCapacity: totalLaundering,
                },
            };
        });
        return success;
    }, [setState]);

    const upgradeBusiness = useCallback((businessId: string): boolean => {
        let success = false;
        setState((prev) => {
            const business = prev.businesses.find(b => b.id === businessId);
            if (!business || business.status !== 'owned') return prev;
            if (business.level >= business.maxLevel) return prev;

            const upgradeCost = business.upgradeCost * business.level;
            if (prev.player.kontanter < upgradeCost) return prev;

            success = true;

            const updatedBusinesses = prev.businesses.map(b =>
                b.id === businessId
                    ? {
                        ...b,
                        level: b.level + 1,
                        incomePerTick: Math.floor(b.incomePerTick * 1.3),
                        efficiency: Math.min(100, b.efficiency + 5),
                        launderingCapacity: b.launderingCapacity ? Math.floor(b.launderingCapacity * 1.25) : undefined,
                    }
                    : b
            );

            const ownedBusinesses = updatedBusinesses.filter(b => b.status === 'owned');
            const totalIncome = ownedBusinesses.reduce((sum, b) => sum + b.incomePerTick, 0);
            const totalLaundering = ownedBusinesses.reduce((sum, b) => sum + (b.launderingCapacity || 0), 0);

            return {
                ...prev,
                player: {
                    ...prev.player,
                    kontanter: prev.player.kontanter - upgradeCost,
                },
                businesses: updatedBusinesses,
                businessStats: {
                    ...prev.businessStats,
                    totalIncome,
                    totalLaunderingCapacity: totalLaundering,
                },
            };
        });
        return success;
    }, [setState]);

    const assignManagerToBusiness = useCallback((businessId: string, memberId: string) => {
        setState((prev) => ({
            ...prev,
            businesses: prev.businesses.map(b =>
                b.id === businessId
                    ? {
                        ...b,
                        managerId: memberId,
                        efficiency: Math.min(100, b.efficiency + 10),
                    }
                    : b
            ),
        }));
    }, [setState]);

    const removeManagerFromBusiness = useCallback((businessId: string) => {
        setState((prev) => ({
            ...prev,
            businesses: prev.businesses.map(b =>
                b.id === businessId
                    ? {
                        ...b,
                        managerId: undefined,
                        efficiency: Math.max(0, b.efficiency - 10),
                    }
                    : b
            ),
        }));
    }, [setState]);

    // ===== Rival Gang Management =====

    const updateGangRelation = useCallback((gangId: string, hostilityChange: number) => {
        setState((prev) => {
            const updatedGangs = prev.rivalGangs.map(gang => {
                if (gang.id !== gangId) return gang;

                const newHostility = Math.max(-100, Math.min(100, gang.hostility + hostilityChange));
                let newStatus: 'Hostile' | 'Neutral' | 'Truce' | 'Allied' = gang.relationStatus;

                // Update relation status based on hostility
                if (newHostility <= -60) newStatus = 'Hostile';
                else if (newHostility <= -20) newStatus = 'Neutral';
                else if (newHostility <= 40) newStatus = 'Truce';
                else newStatus = 'Allied';

                return {
                    ...gang,
                    hostility: newHostility,
                    relationStatus: newStatus,
                };
            });

            const hostileGangs = updatedGangs.filter(g => g.relationStatus === 'Hostile').length;
            const alliedGangs = updatedGangs.filter(g => g.relationStatus === 'Allied').length;

            return {
                ...prev,
                rivalGangs: updatedGangs,
                gangStats: {
                    ...prev.gangStats,
                    hostileGangs,
                    alliedGangs,
                },
            };
        });
    }, [setState]);

    const resolveGangEvent = useCallback((eventId: string, outcome: 'success' | 'failure' | 'negotiated') => {
        setState((prev) => {
            const event = prev.gangEvents.find(e => e.id === eventId);
            if (!event) return prev;

            const updatedEvents = prev.gangEvents.map(e =>
                e.id === eventId ? { ...e, resolved: true, outcome } : e
            );

            const activeGangEvents = prev.activeGangEvents.filter(id => id !== eventId);

            // Apply event consequences
            let newState = { ...prev };
            if (event.respektChange) {
                newState.player = { ...newState.player, respekt: Math.max(0, Math.min(100, newState.player.respekt + event.respektChange)) };
            }
            if (event.kontanterChange) {
                newState.player = { ...newState.player, kontanter: Math.max(0, newState.player.kontanter + event.kontanterChange) };
            }
            if (event.hostilityChange) {
                newState.rivalGangs = newState.rivalGangs.map(g =>
                    g.id === event.gangId
                        ? { ...g, hostility: Math.max(-100, Math.min(100, g.hostility + event.hostilityChange)) }
                        : g
                );
            }

            return {
                ...newState,
                gangEvents: updatedEvents,
                activeGangEvents,
                gangStats: {
                    ...prev.gangStats,
                    activeEvents: activeGangEvents.length,
                },
            };
        });
    }, [setState]);

    const attackGang = useCallback((gangId: string): boolean => {
        let success = false;
        setState((prev) => {
            const gang = prev.rivalGangs.find(g => g.id === gangId);
            if (!gang) return prev;

            // Calculate attack outcome based on strength
            const playerStrength = prev.player.respekt + (prev.chapter.members.length * 5);
            const successChance = (playerStrength / (playerStrength + gang.strength)) * 100;
            success = Math.random() * 100 < successChance;

            if (success) {
                // Successful attack: increase hostility, gain respect
                return {
                    ...prev,
                    player: {
                        ...prev.player,
                        respekt: Math.min(100, prev.player.respekt + 10),
                        polisbevakning: Math.min(100, prev.player.polisbevakning + 20),
                    },
                    rivalGangs: prev.rivalGangs.map(g =>
                        g.id === gangId
                            ? { ...g, hostility: Math.max(-100, g.hostility - 30), strength: Math.max(1, g.strength - 5) }
                            : g
                    ),
                };
            } else {
                // Failed attack: increase hostility, lose respect
                return {
                    ...prev,
                    player: {
                        ...prev.player,
                        respekt: Math.max(0, prev.player.respekt - 5),
                        polisbevakning: Math.min(100, prev.player.polisbevakning + 10),
                    },
                    rivalGangs: prev.rivalGangs.map(g =>
                        g.id === gangId
                            ? { ...g, hostility: Math.max(-100, g.hostility - 20) }
                            : g
                    ),
                };
            }
        });
        return success;
    }, [setState]);

    const negotiateWithGang = useCallback((gangId: string, offer: 'truce' | 'alliance' | 'payment'): boolean => {
        let success = false;
        setState((prev) => {
            const gang = prev.rivalGangs.find(g => g.id === gangId);
            if (!gang) return prev;

            let hostilityChange = 0;
            let kostnad = 0;

            switch (offer) {
                case 'payment':
                    kostnad = 50000;
                    hostilityChange = 30;
                    break;
                case 'truce':
                    hostilityChange = 40;
                    break;
                case 'alliance':
                    hostilityChange = 60;
                    break;
            }

            // Check if player can afford payment
            if (offer === 'payment' && prev.player.kontanter < kostnad) {
                return prev;
            }

            // Calculate success based on current hostility
            const successChance = Math.max(20, Math.min(80, 50 + gang.hostility / 2));
            success = Math.random() * 100 < successChance;

            if (success) {
                return {
                    ...prev,
                    player: {
                        ...prev.player,
                        kontanter: offer === 'payment' ? prev.player.kontanter - kostnad : prev.player.kontanter,
                        inflytande: Math.min(500, prev.player.inflytande + 10),
                    },
                    rivalGangs: prev.rivalGangs.map(g =>
                        g.id === gangId
                            ? {
                                ...g,
                                hostility: Math.min(100, g.hostility + hostilityChange),
                                relationStatus: offer === 'alliance' ? 'Allied' as const : 'Truce' as const,
                            }
                            : g
                    ),
                };
            }

            return prev;
        });
        return success;
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
        purchaseBusiness,
        upgradeBusiness,
        assignManagerToBusiness,
        removeManagerFromBusiness,
        updateGangRelation,
        resolveGangEvent,
        attackGang,
        negotiateWithGang,
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
