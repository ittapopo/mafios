/**
 * Mock Random Events Data
 *
 * Nordic-themed random encounters that add dynamism to gameplay
 */

import { GameEvent } from '@/app/lib/types';

export const mockRandomEvents: Omit<GameEvent, 'triggered' | 'triggeredAt' | 'resolved'>[] = [
    // ==================== POLICE RAIDS ====================
    {
        id: 'event-police-raid-clubhouse',
        type: 'police_raid',
        title: 'Polisen Razzia!',
        description: 'Svensk polis har fått tips om illegal verksamhet i ert klubbhus. De planerar en razzia imorgon.',
        flavorText: 'En konfidentiell källa varnar dig. Polisen är på väg.',
        icon: 'ShieldAlert',
        severity: 'critical',
        triggerConditions: {
            minHeat: 60,
            probability: 30,
            cooldown: 30, // 30 minutes
        },
        choices: [
            {
                id: 'hide-evidence',
                label: 'Gömma bevis',
                description: 'Snabbt gömma vapen och droger. Kräver 3000 kr för smugglare.',
                requiredKontanter: 3000,
                successChance: 70,
                successConsequences: {
                    kontanterChange: -3000,
                    heatChange: -30,
                    respektChange: 5,
                },
                failureConsequences: {
                    kontanterChange: -3000,
                    heatChange: -10,
                    respektChange: -5,
                    equipmentGain: [], // Lost some equipment
                },
            },
            {
                id: 'bribe-police',
                label: 'Muta polisen',
                description: 'Betala 8000 kr för att "tappa" bevismaterial.',
                requiredKontanter: 8000,
                successChance: 85,
                successConsequences: {
                    kontanterChange: -8000,
                    heatChange: -40,
                    inflytandeChange: 5,
                },
                failureConsequences: {
                    kontanterChange: -8000,
                    heatChange: -5,
                    respektChange: -10,
                },
            },
            {
                id: 'do-nothing',
                label: 'Ta risken',
                description: 'Låt dem komma. Kanske hittar de ingenting.',
                successChance: 40,
                successConsequences: {
                    heatChange: -5,
                },
                failureConsequences: {
                    heatChange: 20,
                    respektChange: -10,
                    kontanterChange: -5000,
                    operationsShutdown: true,
                    operationsShutdownDuration: 120, // 2 hours
                },
            },
        ],
    },

    {
        id: 'event-police-patrol',
        type: 'police_raid',
        title: 'Polispatrull spotted',
        description: 'Ökad polisbevakning i era territorier. De håller koll på er verksamhet.',
        icon: 'Eye',
        severity: 'medium',
        triggerConditions: {
            minHeat: 40,
            controlledTerritories: 2,
            probability: 25,
            cooldown: 20,
        },
        choices: [
            {
                id: 'lay-low',
                label: 'Ligg lågt',
                description: 'Pausera operationer i 30 minuter för att undvika uppmärksamhet.',
                successChance: 100,
                successConsequences: {
                    heatChange: -20,
                    operationsShutdown: true,
                    operationsShutdownDuration: 30,
                },
            },
            {
                id: 'business-as-usual',
                label: 'Fortsätt som vanligt',
                description: 'Ignorera polisen och fortsätt era operationer.',
                successChance: 50,
                successConsequences: {
                    respektChange: 5,
                },
                failureConsequences: {
                    heatChange: 30,
                    kontanterChange: -2000,
                },
            },
        ],
    },

    // ==================== OPPORTUNITIES ====================
    {
        id: 'event-opportunity-smuggle',
        type: 'opportunity',
        title: 'Smugglingsaffär',
        description: 'En rysk kontakt erbjuder ett jobb: smuggla Baltiksprit till Stockholm. Stort profit, hög risk.',
        flavorText: 'Rysk maffia vill samarbeta. Detta kan vara början på något stort.',
        icon: 'Package',
        severity: 'high',
        triggerConditions: {
            minRespekt: 50,
            maxHeat: 40,
            minLevel: 3,
            probability: 15,
            cooldown: 60,
        },
        choices: [
            {
                id: 'accept-job',
                label: 'Ta jobbet',
                description: 'Smuggla Baltiksprit. Kräver 5000 kr i förväg.',
                requiredKontanter: 5000,
                requiredLevel: 3,
                successChance: 65,
                successConsequences: {
                    kontanterChange: 15000, // Net +10k
                    respektChange: 15,
                    experienceChange: 50,
                    heatChange: 15,
                    inflytandeChange: 10,
                },
                failureConsequences: {
                    kontanterChange: -5000,
                    heatChange: 40,
                    respektChange: -10,
                },
            },
            {
                id: 'decline',
                label: 'Tacka nej',
                description: 'För riskabelt just nu.',
                successChance: 100,
                successConsequences: {},
            },
        ],
    },

    {
        id: 'event-opportunity-dealership',
        type: 'opportunity',
        title: 'Bilhandlare till salu',
        description: 'En bilhandlare i Södertälje är till salu. Perfekt för tvätta pengar.',
        icon: 'Car',
        severity: 'medium',
        triggerConditions: {
            minKontanter: 25000,
            minRespekt: 30,
            ownedBusinesses: 1,
            probability: 20,
            cooldown: 90,
        },
        choices: [
            {
                id: 'buy-dealership',
                label: 'Köp bilhandeln',
                description: 'Investera 25000 kr för legitim verksamhet.',
                requiredKontanter: 25000,
                successChance: 100,
                successConsequences: {
                    kontanterChange: -25000,
                    inflytandeChange: 15,
                    respektChange: 10,
                    // Note: Business would be added via special logic
                },
            },
            {
                id: 'pass',
                label: 'Låt gå',
                description: 'Inte intresserad just nu.',
                successChance: 100,
                successConsequences: {},
            },
        ],
    },

    {
        id: 'event-opportunity-informant',
        type: 'informant',
        title: 'Polisinformant',
        description: 'En korrupt polis erbjuder information om rivalernas planer för 4000 kr.',
        flavorText: 'Han vet när Odin\'s Wolves planerar nästa attack.',
        icon: 'UserSearch',
        severity: 'medium',
        triggerConditions: {
            minKontanter: 4000,
            minInflytande: 20,
            probability: 18,
            cooldown: 45,
        },
        choices: [
            {
                id: 'buy-intel',
                label: 'Köp information',
                description: 'Betala 4000 kr för värdefull information.',
                requiredKontanter: 4000,
                successChance: 100,
                successConsequences: {
                    kontanterChange: -4000,
                    inflytandeChange: 10,
                    respektChange: 5,
                    gangHostilityChange: {
                        'gang-odins-wolves': 20, // Better relations due to prep
                    },
                },
            },
            {
                id: 'refuse',
                label: 'Neka',
                description: 'Kan inte lita på en korrupt polis.',
                successChance: 100,
                successConsequences: {},
            },
        ],
    },

    // ==================== MEMBER ISSUES ====================
    {
        id: 'event-member-loyalty',
        type: 'member_issue',
        title: 'Medlem ifrågasätter ledarskap',
        description: 'En av era members är missnöjd och överväger att lämna klubben.',
        flavorText: 'Lojaliteten testat. Vad gör du?',
        icon: 'UserX',
        severity: 'high',
        triggerConditions: {
            familyMembers: 3,
            minHeat: 30,
            probability: 12,
            cooldown: 60,
        },
        choices: [
            {
                id: 'pay-respect',
                label: 'Ge bonus',
                description: 'Betala 3000 kr för att visa uppskattning.',
                requiredKontanter: 3000,
                successChance: 80,
                successConsequences: {
                    kontanterChange: -3000,
                    memberLoyaltyChange: {}, // Would target specific member
                    respektChange: 5,
                },
                failureConsequences: {
                    kontanterChange: -3000,
                    memberLoss: [], // Member leaves anyway
                    respektChange: -10,
                },
            },
            {
                id: 'threaten',
                label: 'Hota medlemmen',
                description: 'Visa vem som är boss. Riskabelt.',
                requiredRespekt: 50,
                successChance: 60,
                successConsequences: {
                    respektChange: 10,
                    memberLoyaltyChange: {},
                },
                failureConsequences: {
                    memberLoss: [],
                    respektChange: -15,
                    inflytandeChange: -10,
                },
            },
            {
                id: 'let-go',
                label: 'Låt hen gå',
                description: 'Acceptera att medlemmen lämnar.',
                successChance: 100,
                successConsequences: {
                    memberLoss: [],
                    respektChange: -5,
                },
            },
        ],
    },

    {
        id: 'event-member-request',
        type: 'member_issue',
        title: 'Medlemmen behöver hjälp',
        description: 'En lojal medlem har problem med skulder. Han ber om 2000 kr.',
        icon: 'HandHeart',
        severity: 'low',
        triggerConditions: {
            familyMembers: 2,
            minKontanter: 2000,
            probability: 15,
            cooldown: 40,
        },
        choices: [
            {
                id: 'help-member',
                label: 'Hjälp medlemmen',
                description: 'Betala 2000 kr. Ökar lojalitet.',
                requiredKontanter: 2000,
                successChance: 100,
                successConsequences: {
                    kontanterChange: -2000,
                    memberLoyaltyChange: {},
                    respektChange: 5,
                },
            },
            {
                id: 'refuse-help',
                label: 'Neka hjälp',
                description: 'Varje man för sig själv.',
                successChance: 100,
                successConsequences: {
                    memberLoyaltyChange: {},
                    respektChange: -3,
                },
            },
        ],
    },

    // ==================== MARKET SHIFTS ====================
    {
        id: 'event-market-boom',
        type: 'market_shift',
        title: 'Ekonomisk boom',
        description: 'Stockholms nattliv blomstrar. Era barer och klubbar tjänar mer.',
        flavorText: 'Turister flödar in. Detta är vår tid.',
        icon: 'TrendingUp',
        severity: 'low',
        triggerConditions: {
            ownedBusinesses: 2,
            probability: 10,
            cooldown: 120,
        },
        choices: [
            {
                id: 'capitalize',
                label: 'Dra nytta',
                description: 'Öka priserna tillfälligt.',
                successChance: 100,
                successConsequences: {
                    kontanterChange: 5000,
                    inflytandeChange: 10,
                },
            },
        ],
    },

    {
        id: 'event-market-recession',
        type: 'market_shift',
        title: 'Ekonomisk kris',
        description: 'Lågkonjunktur slår hårt. Färre kunder, mindre intäkter.',
        icon: 'TrendingDown',
        severity: 'medium',
        triggerConditions: {
            ownedBusinesses: 1,
            probability: 8,
            cooldown: 120,
        },
        choices: [
            {
                id: 'weather-storm',
                label: 'Rida ut stormen',
                description: 'Vänta tills det blir bättre.',
                successChance: 100,
                successConsequences: {
                    kontanterChange: -3000,
                },
            },
            {
                id: 'diversify',
                label: 'Diversifiera',
                description: 'Investera 5000 kr i nya intäktskällor.',
                requiredKontanter: 5000,
                successChance: 70,
                successConsequences: {
                    kontanterChange: -2000, // Net better than doing nothing
                    inflytandeChange: 5,
                },
                failureConsequences: {
                    kontanterChange: -5000,
                },
            },
        ],
    },

    // ==================== LUCKY BREAKS ====================
    {
        id: 'event-lucky-find',
        type: 'lucky_break',
        title: 'Oväntat fynd',
        description: 'Era män hittade en kassaskåp från ett gammalt brott. 8000 kr inuti!',
        icon: 'Vault',
        severity: 'low',
        triggerConditions: {
            probability: 5,
            cooldown: 180,
        },
        choices: [
            {
                id: 'take-money',
                label: 'Ta pengarna',
                description: 'Gratis pengar!',
                successChance: 100,
                successConsequences: {
                    kontanterChange: 8000,
                    respektChange: 5,
                },
            },
        ],
    },

    {
        id: 'event-lucky-weapon',
        type: 'lucky_break',
        title: 'Vapenleverans',
        description: 'En vän i hamnen gav er ett tips. Nytt vapen tillgängligt!',
        flavorText: 'Ingen frågor ställda.',
        icon: 'Package',
        severity: 'low',
        triggerConditions: {
            minLevel: 2,
            probability: 6,
            cooldown: 150,
        },
        choices: [
            {
                id: 'accept-weapon',
                label: 'Ta vapnet',
                description: 'Alltid användbart.',
                successChance: 100,
                successConsequences: {
                    equipmentGain: ['weapon-smuggled-pistol'],
                    respektChange: 3,
                    heatChange: 5,
                },
            },
        ],
    },

    // ==================== BETRAYALS ====================
    {
        id: 'event-betrayal-informant',
        type: 'betrayal',
        title: 'Förrädare upptäckt!',
        description: 'En av era members har pratat med polisen. Vad gör ni?',
        flavorText: 'Förräderi straffas hårt i MC-världen.',
        icon: 'UserX',
        severity: 'critical',
        triggerConditions: {
            familyMembers: 3,
            minHeat: 50,
            probability: 8,
            cooldown: 90,
        },
        choices: [
            {
                id: 'expel-traitor',
                label: 'Sparka ut förrädaren',
                description: 'Tar bort medlemmen från klubben.',
                successChance: 100,
                successConsequences: {
                    memberLoss: [],
                    respektChange: 10,
                    heatChange: -20,
                },
            },
            {
                id: 'silence-traitor',
                label: 'Tysta förrädaren',
                description: 'Permanent lösning. Mycket riskabelt.',
                requiredRespekt: 70,
                successChance: 50,
                successConsequences: {
                    memberLoss: [],
                    respektChange: 20,
                    heatChange: -30,
                    inflytandeChange: 10,
                },
                failureConsequences: {
                    memberLoss: [],
                    respektChange: -20,
                    heatChange: 60,
                    kontanterChange: -10000,
                },
            },
        ],
    },

    // ==================== TERRITORY THREATS ====================
    {
        id: 'event-territory-challenge',
        type: 'territory_threat',
        title: 'Territoriellt hot',
        description: 'Lokala småkriminella testar era gränser. Visa styrka eller låt gå?',
        icon: 'MapPin',
        severity: 'medium',
        triggerConditions: {
            controlledTerritories: 2,
            probability: 20,
            cooldown: 50,
        },
        choices: [
            {
                id: 'show-force',
                label: 'Visa styrka',
                description: 'Skicka meddelande till alla.',
                requiredRespekt: 30,
                successChance: 75,
                successConsequences: {
                    respektChange: 15,
                    inflytandeChange: 10,
                    heatChange: 10,
                },
                failureConsequences: {
                    respektChange: -10,
                    territoryLoss: [],
                    heatChange: 15,
                },
            },
            {
                id: 'negotiate-peace',
                label: 'Förhandla fred',
                description: 'Betala 2000 kr för fred.',
                requiredKontanter: 2000,
                successChance: 90,
                successConsequences: {
                    kontanterChange: -2000,
                    inflytandeChange: -5,
                },
                failureConsequences: {
                    kontanterChange: -2000,
                    respektChange: -10,
                },
            },
            {
                id: 'ignore-threat',
                label: 'Ignorera',
                description: 'Låt dem prata.',
                successChance: 40,
                successConsequences: {},
                failureConsequences: {
                    respektChange: -15,
                    territoryLoss: [],
                },
            },
        ],
    },

    // ==================== INSPECTIONS ====================
    {
        id: 'event-tax-inspection',
        type: 'inspection',
        title: 'Skattekontroll',
        description: 'Skatteverket granskar era företag. Misstänker penningtvätt.',
        icon: 'FileSearch',
        severity: 'high',
        triggerConditions: {
            ownedBusinesses: 2,
            minKontanter: 50000,
            probability: 12,
            cooldown: 80,
        },
        choices: [
            {
                id: 'hire-accountant',
                label: 'Anlita revisor',
                description: 'Betala 6000 kr för professionell hjälp.',
                requiredKontanter: 6000,
                successChance: 85,
                successConsequences: {
                    kontanterChange: -6000,
                    heatChange: -10,
                },
                failureConsequences: {
                    kontanterChange: -6000,
                    heatChange: 20,
                    businessLoss: [],
                },
            },
            {
                id: 'falsify-books',
                label: 'Förfalska böcker',
                description: 'Riskabelt men gratis.',
                successChance: 55,
                successConsequences: {
                    heatChange: -5,
                },
                failureConsequences: {
                    heatChange: 40,
                    kontanterChange: -15000,
                    respektChange: -15,
                    businessLoss: [],
                },
            },
        ],
    },
];
