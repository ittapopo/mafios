"use client";

/**
 * Game Context
 *
 * Centralized game state management with persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { GameState, GameActions, DEFAULT_GAME_STATE, PlayerStats } from '../types/game/state';
import { EquipmentItemType, EquipmentSlot, GameEvent } from '../types';
import { FamilyMember } from '../types/game/family';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CharacterService } from '../data/services/character.service';
import { BusinessService } from '../data/services/business.service';
import { mockFamilyMembers, mockFamilyStats } from '../data/mock/family';
import { mockSecurityLevels, mockOperations } from '../data/mock/headquarters';
import { mockTerritories, mockTerritoryStats } from '../data/mock/territory';
import { mockBusinesses } from '../data/mock/businesses';
import { mockRivalGangs } from '../data/mock/rival-gangs';
import { mockRandomEvents } from '../data/mock/random-events';

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

    // Initialize random events with default state
    const initializedEvents = mockRandomEvents.map(event => ({
        ...event,
        triggered: false,
        resolved: false,
    }));

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
        randomEvents: initializedEvents,
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

        // Migration: ensure randomEvents exists (for old save states)
        if (!state.randomEvents || !Array.isArray(state.randomEvents)) {
            setState((prev) => ({
                ...prev,
                randomEvents: mockRandomEvents.map(event => ({
                    ...event,
                    triggered: false,
                    resolved: false,
                })),
                activeEvents: prev.activeEvents || [],
                eventStats: prev.eventStats || {
                    totalTriggered: 0,
                    totalResolved: 0,
                    successfulOutcomes: 0,
                    failedOutcomes: 0,
                    byType: {
                        police_raid: 0,
                        opportunity: 0,
                        member_issue: 0,
                        rival_incident: 0,
                        informant: 0,
                        betrayal: 0,
                        market_shift: 0,
                        territory_threat: 0,
                        lucky_break: 0,
                        inspection: 0,
                    },
                    recentEvents: [],
                },
            }));
        }

        // Migration: ensure inventory exists (for old save states)
        if (!state.inventory || !Array.isArray(state.inventory)) {
            setState((prev) => ({
                ...prev,
                inventory: [],
            }));
        }

        // Migration: ensure eventHistory exists (for old save states)
        if (!state.eventHistory || !Array.isArray(state.eventHistory)) {
            setState((prev) => ({
                ...prev,
                eventHistory: [],
            }));
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

    // Gang event generation every 2-5 minutes (randomized)
    useEffect(() => {
        let currentTimeout: NodeJS.Timeout;

        const generateNextGangEvent = () => {
            // Random interval between 2-5 minutes (120000-300000 ms)
            const randomInterval = 120000 + Math.random() * 180000;

            currentTimeout = setTimeout(() => {
                // Generate gang events inline to avoid dependency issues
                setState((prev) => {
                    const newEvents: typeof prev.gangEvents = [];
                    const now = Date.now();

                    // Iterate through each gang to potentially generate events
                    prev.rivalGangs.forEach((gang) => {
                        // Skip if gang has recent activity
                        if (gang.lastAttack && now - gang.lastAttack < 300000) return; // 5 min cooldown

                        // Calculate event probability based on hostility and aggressiveness
                        const baseChance = gang.aggressiveness;
                        const hostilityModifier = gang.hostility < 0 ? Math.abs(gang.hostility) / 2 : -gang.hostility / 4;
                        const eventProbability = Math.max(0, Math.min(100, baseChance + hostilityModifier));

                        // Roll for event generation
                        if (Math.random() * 100 > eventProbability) return;

                        // Determine event type based on relationship
                        let eventType: 'attack' | 'raid' | 'challenge' | 'offer' | 'peace_offer' | 'betrayal';
                        const roll = Math.random() * 100;

                        if (gang.relationStatus === 'Hostile') {
                            if (roll < 50) eventType = 'attack';
                            else if (roll < 80) eventType = 'raid';
                            else eventType = 'challenge';
                        } else if (gang.relationStatus === 'Allied') {
                            if (roll < 70) eventType = 'offer';
                            else if (gang.hostility < 50) eventType = 'betrayal';
                            else return;
                        } else if (gang.relationStatus === 'Truce') {
                            if (roll < 40) eventType = 'peace_offer';
                            else if (gang.hostility < -10) eventType = 'attack';
                            else return;
                        } else {
                            if (roll < 30) eventType = 'challenge';
                            else if (roll < 60) eventType = 'offer';
                            else eventType = 'attack';
                        }

                        // Select random player territory for attacks/raids
                        const playerTerritories = prev.territories.filter(t => t.status === 'Controlled');
                        const targetTerritory = playerTerritories.length > 0
                            ? playerTerritories[Math.floor(Math.random() * playerTerritories.length)]
                            : undefined;

                        // Create event based on type
                        let event: typeof prev.gangEvents[0] | null = null;

                        switch (eventType) {
                            case 'attack':
                                event = {
                                    id: `event-${now}-${gang.id}`,
                                    type: 'attack',
                                    gangId: gang.id,
                                    timestamp: now,
                                    targetTerritoryId: targetTerritory?.id,
                                    resolved: false,
                                    title: `${gang.name} Territory Attack!`,
                                    description: targetTerritory
                                        ? `${gang.name} is attacking ${targetTerritory.name}! Defend your territory or risk losing control.`
                                        : `${gang.name} is threatening your operations. Respond quickly!`,
                                    strengthRequired: gang.strength * 0.8,
                                    respektChange: -10,
                                    hostilityChange: -15,
                                };
                                break;

                            case 'raid':
                                const raidDemand = Math.floor(gang.wealth * 0.3);
                                event = {
                                    id: `event-${now}-${gang.id}`,
                                    type: 'raid',
                                    gangId: gang.id,
                                    timestamp: now,
                                    resolved: false,
                                    title: `${gang.name} Business Raid`,
                                    description: `${gang.name} is raiding one of your businesses! Pay ${raidDemand} kr or fight back.`,
                                    cashDemand: raidDemand,
                                    strengthRequired: gang.strength * 0.6,
                                    kontanterChange: -raidDemand,
                                    respektChange: -5,
                                    hostilityChange: -10,
                                };
                                break;

                            case 'challenge':
                                event = {
                                    id: `event-${now}-${gang.id}`,
                                    type: 'challenge',
                                    gangId: gang.id,
                                    timestamp: now,
                                    resolved: false,
                                    title: `${gang.name} Issues Challenge`,
                                    description: `${gang.name} has challenged your crew to prove your strength. Win for respect, lose for shame.`,
                                    strengthRequired: gang.strength,
                                    respektChange: 15,
                                    hostilityChange: gang.hostility < 0 ? 10 : -5,
                                };
                                break;

                            case 'offer':
                                const offerAmount = Math.floor(gang.wealth * 0.2);
                                event = {
                                    id: `event-${now}-${gang.id}`,
                                    type: 'offer',
                                    gangId: gang.id,
                                    timestamp: now,
                                    resolved: false,
                                    title: `${gang.name} Business Proposal`,
                                    description: `${gang.name} offers a partnership deal worth ${offerAmount} kr. Accept to improve relations.`,
                                    kontanterChange: offerAmount,
                                    hostilityChange: 20,
                                    respektChange: 5,
                                };
                                break;

                            case 'peace_offer':
                                event = {
                                    id: `event-${now}-${gang.id}`,
                                    type: 'peace_offer',
                                    gangId: gang.id,
                                    timestamp: now,
                                    resolved: false,
                                    title: `${gang.name} Seeks Peace`,
                                    description: `${gang.name} wants to improve relations. Accept their peace offering?`,
                                    hostilityChange: 30,
                                    respektChange: 3,
                                };
                                break;

                            case 'betrayal':
                                event = {
                                    id: `event-${now}-${gang.id}`,
                                    type: 'betrayal',
                                    gangId: gang.id,
                                    timestamp: now,
                                    targetTerritoryId: targetTerritory?.id,
                                    resolved: false,
                                    title: `${gang.name} BETRAYAL!`,
                                    description: `${gang.name} has turned on you! They're attacking ${targetTerritory?.name || 'your operations'} despite your alliance.`,
                                    strengthRequired: gang.strength * 0.9,
                                    respektChange: -15,
                                    kontanterChange: -50000,
                                    hostilityChange: -80,
                                };
                                break;
                        }

                        if (event) {
                            newEvents.push(event);
                        }
                    });

                    // Add new events if any were generated
                    if (newEvents.length === 0) return prev;

                    const updatedGangEvents = [...prev.gangEvents, ...newEvents];
                    const updatedActiveGangEvents = [...prev.activeGangEvents, ...newEvents.map(e => e.id)];

                    // Update gang last attack times
                    const updatedGangs = prev.rivalGangs.map(gang => {
                        const hasNewEvent = newEvents.some(e => e.gangId === gang.id);
                        return hasNewEvent ? { ...gang, lastAttack: now } : gang;
                    });

                    return {
                        ...prev,
                        gangEvents: updatedGangEvents,
                        activeGangEvents: updatedActiveGangEvents,
                        rivalGangs: updatedGangs,
                        gangStats: {
                            ...prev.gangStats,
                            activeEvents: updatedActiveGangEvents.length,
                        },
                    };
                });

                generateNextGangEvent(); // Schedule next event
            }, randomInterval);
        };

        generateNextGangEvent();

        return () => {
            if (currentTimeout) clearTimeout(currentTimeout);
        };
    }, [setState]);

    // Random event trigger check every 3 minutes
    useEffect(() => {
        const triggerCheck = () => {
            setState((prev) => {
                const now = Date.now();
                const newlyTriggeredEvents: string[] = [];

                prev.randomEvents.forEach((event) => {
                    // Skip if already triggered or resolved
                    if (event.triggered || event.resolved) return;

                    // Check if conditions are met
                    if (!checkEventConditions(event, prev)) return;

                    // Roll for probability
                    const roll = Math.random() * 100;
                    if (roll > event.triggerConditions.probability) return;

                    // Trigger the event
                    newlyTriggeredEvents.push(event.id);
                });

                if (newlyTriggeredEvents.length === 0) return prev;

                // Update events
                const updatedEvents = prev.randomEvents.map(event =>
                    newlyTriggeredEvents.includes(event.id)
                        ? { ...event, triggered: true, triggeredAt: now, lastTriggered: now }
                        : event
                );

                return {
                    ...prev,
                    randomEvents: updatedEvents,
                    activeEvents: [...prev.activeEvents, ...newlyTriggeredEvents],
                    eventStats: {
                        ...prev.eventStats,
                        totalTriggered: prev.eventStats.totalTriggered + newlyTriggeredEvents.length,
                    },
                };
            });
        };

        // Run immediately on mount (disabled for testing)
        // triggerCheck();

        // Then run every 3 minutes (180000ms)
        const eventCheckInterval = setInterval(triggerCheck, 180000);

        return () => clearInterval(eventCheckInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        ? { ...g, hostility: Math.max(-100, Math.min(100, g.hostility + (event.hostilityChange || 0))) }
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

    /**
     * Generate random gang events based on gang aggressiveness and relationship
     * Called periodically to create dynamic gang interactions
     */
    const generateGangEvents = useCallback(() => {
        setState((prev) => {
            const newEvents: typeof prev.gangEvents = [];
            const now = Date.now();

            // Iterate through each gang to potentially generate events
            prev.rivalGangs.forEach((gang) => {
                // Skip if gang has recent activity
                if (gang.lastAttack && now - gang.lastAttack < 300000) return; // 5 min cooldown

                // Calculate event probability based on hostility and aggressiveness
                const baseChance = gang.aggressiveness;
                const hostilityModifier = gang.hostility < 0 ? Math.abs(gang.hostility) / 2 : -gang.hostility / 4;
                const eventProbability = Math.max(0, Math.min(100, baseChance + hostilityModifier));

                // Roll for event generation
                if (Math.random() * 100 > eventProbability) return;

                // Determine event type based on relationship
                let eventType: 'attack' | 'raid' | 'challenge' | 'offer' | 'peace_offer' | 'betrayal';
                const roll = Math.random() * 100;

                if (gang.relationStatus === 'Hostile') {
                    // Hostile gangs: attacks, raids, challenges
                    if (roll < 50) eventType = 'attack';
                    else if (roll < 80) eventType = 'raid';
                    else eventType = 'challenge';
                } else if (gang.relationStatus === 'Allied') {
                    // Allied gangs: offers, potential betrayals
                    if (roll < 70) eventType = 'offer';
                    else if (gang.hostility < 50) eventType = 'betrayal'; // Low hostility allies might betray
                    else return; // Skip event for stable allies
                } else if (gang.relationStatus === 'Truce') {
                    // Truce gangs: peace offers, potential attacks if relations sour
                    if (roll < 40) eventType = 'peace_offer';
                    else if (gang.hostility < -10) eventType = 'attack';
                    else return;
                } else {
                    // Neutral gangs: mix of events
                    if (roll < 30) eventType = 'challenge';
                    else if (roll < 60) eventType = 'offer';
                    else eventType = 'attack';
                }

                // Select random player territory for attacks/raids
                const playerTerritories = prev.territories.filter(t => t.status === 'Controlled');
                const targetTerritory = playerTerritories.length > 0
                    ? playerTerritories[Math.floor(Math.random() * playerTerritories.length)]
                    : undefined;

                // Create event based on type
                let event: typeof prev.gangEvents[0] | null = null;

                switch (eventType) {
                    case 'attack':
                        event = {
                            id: `event-${now}-${gang.id}`,
                            type: 'attack',
                            gangId: gang.id,
                            timestamp: now,
                            targetTerritoryId: targetTerritory?.id,
                            resolved: false,
                            title: `${gang.name} Territory Attack!`,
                            description: targetTerritory
                                ? `${gang.name} is attacking ${targetTerritory.name}! Defend your territory or risk losing control.`
                                : `${gang.name} is threatening your operations. Respond quickly!`,
                            strengthRequired: gang.strength * 0.8,
                            respektChange: -10,
                            hostilityChange: -15,
                        };
                        break;

                    case 'raid':
                        const raidDemand = Math.floor(gang.wealth * 0.3);
                        event = {
                            id: `event-${now}-${gang.id}`,
                            type: 'raid',
                            gangId: gang.id,
                            timestamp: now,
                            resolved: false,
                            title: `${gang.name} Business Raid`,
                            description: `${gang.name} is raiding one of your businesses! Pay ${raidDemand} kr or fight back.`,
                            cashDemand: raidDemand,
                            strengthRequired: gang.strength * 0.6,
                            kontanterChange: -raidDemand,
                            respektChange: -5,
                            hostilityChange: -10,
                        };
                        break;

                    case 'challenge':
                        event = {
                            id: `event-${now}-${gang.id}`,
                            type: 'challenge',
                            gangId: gang.id,
                            timestamp: now,
                            resolved: false,
                            title: `${gang.name} Issues Challenge`,
                            description: `${gang.name} has challenged your crew to prove your strength. Win for respect, lose for shame.`,
                            strengthRequired: gang.strength,
                            respektChange: 15,
                            hostilityChange: gang.hostility < 0 ? 10 : -5,
                        };
                        break;

                    case 'offer':
                        const offerAmount = Math.floor(gang.wealth * 0.2);
                        event = {
                            id: `event-${now}-${gang.id}`,
                            type: 'offer',
                            gangId: gang.id,
                            timestamp: now,
                            resolved: false,
                            title: `${gang.name} Business Proposal`,
                            description: `${gang.name} offers a partnership deal worth ${offerAmount} kr. Accept to improve relations.`,
                            kontanterChange: offerAmount,
                            hostilityChange: 20,
                            respektChange: 5,
                        };
                        break;

                    case 'peace_offer':
                        event = {
                            id: `event-${now}-${gang.id}`,
                            type: 'peace_offer',
                            gangId: gang.id,
                            timestamp: now,
                            resolved: false,
                            title: `${gang.name} Seeks Peace`,
                            description: `${gang.name} wants to improve relations. Accept their peace offering?`,
                            hostilityChange: 30,
                            respektChange: 3,
                        };
                        break;

                    case 'betrayal':
                        event = {
                            id: `event-${now}-${gang.id}`,
                            type: 'betrayal',
                            gangId: gang.id,
                            timestamp: now,
                            targetTerritoryId: targetTerritory?.id,
                            resolved: false,
                            title: `${gang.name} BETRAYAL!`,
                            description: `${gang.name} has turned on you! They're attacking ${targetTerritory?.name || 'your operations'} despite your alliance.`,
                            strengthRequired: gang.strength * 0.9,
                            respektChange: -15,
                            kontanterChange: -50000,
                            hostilityChange: -80,
                        };
                        break;
                }

                if (event) {
                    newEvents.push(event);
                }
            });

            // Add new events if any were generated
            if (newEvents.length === 0) return prev;

            const updatedGangEvents = [...prev.gangEvents, ...newEvents];
            const updatedActiveGangEvents = [...prev.activeGangEvents, ...newEvents.map(e => e.id)];

            // Update gang last attack times
            const updatedGangs = prev.rivalGangs.map(gang => {
                const hasNewEvent = newEvents.some(e => e.gangId === gang.id);
                return hasNewEvent ? { ...gang, lastAttack: now } : gang;
            });

            return {
                ...prev,
                gangEvents: updatedGangEvents,
                activeGangEvents: updatedActiveGangEvents,
                rivalGangs: updatedGangs,
                gangStats: {
                    ...prev.gangStats,
                    activeEvents: updatedActiveGangEvents.length,
                },
            };
        });
    }, [setState]);

    // ===== Random Events =====

    /**
     * Check if an event's trigger conditions are met
     */
    const checkEventConditions = useCallback((event: GameEvent, gameState: GameState): boolean => {
        const { triggerConditions } = event;
        const { player, territories, businesses, operations, chapter } = gameState;

        // Check heat thresholds
        if (triggerConditions.minHeat !== undefined && player.polisbevakning < triggerConditions.minHeat) return false;
        if (triggerConditions.maxHeat !== undefined && player.polisbevakning > triggerConditions.maxHeat) return false;

        // Check cash thresholds
        if (triggerConditions.minKontanter !== undefined && player.kontanter < triggerConditions.minKontanter) return false;
        if (triggerConditions.maxKontanter !== undefined && player.kontanter > triggerConditions.maxKontanter) return false;

        // Check respect thresholds
        if (triggerConditions.minRespekt !== undefined && player.respekt < triggerConditions.minRespekt) return false;
        if (triggerConditions.maxRespekt !== undefined && player.respekt > triggerConditions.maxRespekt) return false;

        // Check asset requirements
        const controlledCount = territories.filter(t => t.status === 'Controlled').length;
        if (triggerConditions.controlledTerritories !== undefined && controlledCount < triggerConditions.controlledTerritories) return false;

        const ownedCount = businesses.filter(b => b.status === 'owned').length;
        if (triggerConditions.ownedBusinesses !== undefined && ownedCount < triggerConditions.ownedBusinesses) return false;

        const activeOpsCount = gameState.activeOperations.length;
        if (triggerConditions.activeOperations !== undefined && activeOpsCount < triggerConditions.activeOperations) return false;

        const memberCount = chapter.members.length;
        if (triggerConditions.familyMembers !== undefined && memberCount < triggerConditions.familyMembers) return false;

        // Check level requirements
        if (triggerConditions.minLevel !== undefined && player.level < triggerConditions.minLevel) return false;
        if (triggerConditions.maxLevel !== undefined && player.level > triggerConditions.maxLevel) return false;

        // Check cooldown
        if (triggerConditions.cooldown && event.lastTriggered) {
            const timeSinceLastTrigger = (Date.now() - event.lastTriggered) / 1000 / 60; // minutes
            if (timeSinceLastTrigger < triggerConditions.cooldown) return false;
        }

        return true;
    }, []);

    /**
     * Check and trigger events based on game state
     */
    const checkEventTriggers = useCallback(() => {
        setState((prev) => {
            const now = Date.now();
            const newlyTriggeredEvents: string[] = [];

            prev.randomEvents.forEach((event) => {
                // Skip if already triggered or resolved
                if (event.triggered || event.resolved) return;

                // Check if conditions are met
                if (!checkEventConditions(event, prev)) return;

                // Roll for probability
                const roll = Math.random() * 100;
                if (roll > event.triggerConditions.probability) return;

                // Trigger the event
                newlyTriggeredEvents.push(event.id);
            });

            if (newlyTriggeredEvents.length === 0) return prev;

            // Update events
            const updatedEvents = prev.randomEvents.map(event =>
                newlyTriggeredEvents.includes(event.id)
                    ? { ...event, triggered: true, triggeredAt: now, lastTriggered: now }
                    : event
            );

            return {
                ...prev,
                randomEvents: updatedEvents,
                activeEvents: [...prev.activeEvents, ...newlyTriggeredEvents],
                eventStats: {
                    ...prev.eventStats,
                    totalTriggered: prev.eventStats.totalTriggered + newlyTriggeredEvents.length,
                },
            };
        });
    }, [setState, checkEventConditions]);

    /**
     * Manually trigger a specific event (for testing or special cases)
     */
    const triggerEvent = useCallback((eventId: string) => {
        setState((prev) => {
            const event = prev.randomEvents.find(e => e.id === eventId);
            if (!event || event.triggered) return prev;

            const now = Date.now();
            const updatedEvents = prev.randomEvents.map(e =>
                e.id === eventId
                    ? { ...e, triggered: true, triggeredAt: now, lastTriggered: now }
                    : e
            );

            return {
                ...prev,
                randomEvents: updatedEvents,
                activeEvents: [...prev.activeEvents, eventId],
                eventStats: {
                    ...prev.eventStats,
                    totalTriggered: prev.eventStats.totalTriggered + 1,
                    byType: {
                        ...prev.eventStats.byType,
                        [event.type]: prev.eventStats.byType[event.type] + 1,
                    },
                },
            };
        });
    }, [setState]);

    /**
     * Resolve an event with a chosen action
     */
    const resolveEvent = useCallback((eventId: string, choiceId: string) => {
        setState((prev) => {
            const event = prev.randomEvents.find(e => e.id === eventId);
            if (!event || !event.triggered || event.resolved) return prev;

            const choice = event.choices.find(c => c.id === choiceId);
            if (!choice) return prev;

            // Determine success/failure
            const roll = Math.random() * 100;
            const success = choice.successChance === undefined || roll <= choice.successChance;
            const consequences = success ? choice.successConsequences : (choice.failureConsequences || choice.successConsequences);

            // Apply consequences
            let newState = { ...prev };
            const now = Date.now();

            // Resource changes
            if (consequences.kontanterChange) {
                newState.player = {
                    ...newState.player,
                    kontanter: Math.max(0, newState.player.kontanter + consequences.kontanterChange),
                };
            }
            if (consequences.respektChange) {
                newState.player = {
                    ...newState.player,
                    respekt: Math.max(0, newState.player.respekt + consequences.respektChange),
                };
            }
            if (consequences.inflytandeChange) {
                newState.player = {
                    ...newState.player,
                    inflytande: Math.max(0, newState.player.inflytande + consequences.inflytandeChange),
                };
            }
            if (consequences.heatChange) {
                newState.player = {
                    ...newState.player,
                    polisbevakning: Math.max(0, Math.min(100, newState.player.polisbevakning + consequences.heatChange)),
                };
            }
            if (consequences.experienceChange) {
                newState.player = {
                    ...newState.player,
                    experience: newState.player.experience + consequences.experienceChange,
                };
            }

            // Gang relations
            if (consequences.gangHostilityChange) {
                newState.rivalGangs = newState.rivalGangs.map(gang =>
                    consequences.gangHostilityChange?.[gang.id]
                        ? { ...gang, hostility: Math.max(-100, Math.min(100, gang.hostility + consequences.gangHostilityChange[gang.id])) }
                        : gang
                );
            }

            // Operations shutdown
            if (consequences.operationsShutdown) {
                // This would require additional state management
                // For now, just note it in the event
            }

            // Update event status
            newState.randomEvents = newState.randomEvents.map(e =>
                e.id === eventId
                    ? { ...e, resolved: true, resolvedAt: now, choiceSelected: choiceId, success }
                    : e
            );

            // Remove from active events
            newState.activeEvents = newState.activeEvents.filter(id => id !== eventId);

            // Update event stats
            const historyEntry = {
                eventId: event.id,
                type: event.type,
                title: event.title,
                triggeredAt: event.triggeredAt || now,
                resolvedAt: now,
                choiceId,
                choiceLabel: choice.label,
                success,
                consequences,
            };

            newState.eventStats = {
                ...newState.eventStats,
                totalResolved: newState.eventStats.totalResolved + 1,
                successfulOutcomes: success ? newState.eventStats.successfulOutcomes + 1 : newState.eventStats.successfulOutcomes,
                failedOutcomes: !success ? newState.eventStats.failedOutcomes + 1 : newState.eventStats.failedOutcomes,
                recentEvents: [historyEntry, ...newState.eventStats.recentEvents].slice(0, 10), // Keep last 10
            };

            return newState;
        });
    }, [setState]);

    /**
     * Dismiss an event without taking action
     */
    const dismissEvent = useCallback((eventId: string) => {
        setState((prev) => ({
            ...prev,
            randomEvents: prev.randomEvents.map(e =>
                e.id === eventId
                    ? { ...e, resolved: true, resolvedAt: Date.now() }
                    : e
            ),
            activeEvents: prev.activeEvents.filter(id => id !== eventId),
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
        purchaseBusiness,
        upgradeBusiness,
        assignManagerToBusiness,
        removeManagerFromBusiness,
        updateGangRelation,
        resolveGangEvent,
        attackGang,
        negotiateWithGang,
        generateGangEvents,
        triggerEvent,
        resolveEvent,
        dismissEvent,
        checkEventTriggers,
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
