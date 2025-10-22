# Development Roadmap - Updated Strategic Plan

**Last Updated:** 2025-10-22
**Current Status:** Phase 2 Complete (75% of core gameplay functional)

---

## ✅ Completed Phases

### Phase 1: Foundation (COMPLETE)
- ✅ 1.1 Global Game State (GameContext with localStorage persistence)
- ✅ 1.2 Connect Components to Services
- ✅ 1.3 LocalStorage Persistence
- ✅ 1.4 Crime Operations Functional (risk-based success, rewards, heat)
- ✅ 1.5 Top Stats Live Updates

### Phase 2: Core Gameplay (COMPLETE)
- ✅ 2.1 Family Member Management (9 actions, power-scaled rewards, cooldowns)
- ✅ 2.2 Territory Control Mechanics (attack/defend, passive income)
- ✅ 2.3 Defense Route (security upgrades, heat reduction)
- ✅ 2.4 Equipment System (buy/sell/equip, rarity-based pricing, inventory)
- ✅ 2.5 Operations Center (6 operations, start/stop, upgrade, member assignment, passive income)

---

## 📊 Current Game Entities (Ready for Database)

### Player Entity ✅ COMPLETE
```typescript
{
  name, level, chapter, rank,
  kontanter, inflytande, respekt, polisbevakning,
  experience, experienceToNext,
  playTime, lastSaved
}
```

### Equipment Entity ✅ COMPLETE
```typescript
{
  id, slot, label, stats, rarity, price, equipped,
  // Inventory: equipped vs owned items
}
```

### Territory Entity ✅ COMPLETE
```typescript
{
  id, name, district, description,
  status, control, income, defenseLevel
}
```

### Operation Entity ✅ COMPLETE
```typescript
{
  id, name, type, status, efficiency,
  level, maxLevel, description,
  incomePerTick, heatReductionPerTick,
  upgradeCost, activationCost,
  assignedMemberIds, maxMembers
}
```

### Family Member Entity ✅ COMPLETE
```typescript
{
  id, name, role, status, traits, loyalty, power,
  actions: MemberAction[],
  skills: { combat, stealth, charisma }
}
```

### Crime Entity ✅ COMPLETE
```typescript
{
  id, name, description, tier,
  reward, risk, duration, difficulty,
  requiredLevel, experience, heatGain, respectGain
}
```

---

## 🎯 Phase 3: Complete Remaining Game Entities (PRIORITY)
**Goal:** Finish all gameplay features before database integration

### 3.1 Business Management System ⏳ NEW
**Priority:** P1 - High
**Effort:** 3-4 days

**Problem:** Businesses exist conceptually but aren't implemented
**Solution:** Create business ownership and income generation system

**Features:**
- Purchase businesses (bars, clubs, auto shops, etc.)
- Business types with different income rates and requirements
- Upgrade businesses to increase income
- Hire managers (assign family members)
- Business heat levels and police raids
- Laundering dirty money through businesses

**New Entity:**
```typescript
interface Business {
  id: string;
  name: string;
  type: BusinessType; // 'bar' | 'club' | 'auto_shop' | 'laundry' | 'restaurant'
  location: string;
  description: string;

  // Ownership
  owned: boolean;
  purchasePrice: number;

  // Income
  incomePerTick: number;
  level: number;
  maxLevel: number;
  upgradeCost: number;

  // Management
  managerId?: string; // Assigned family member
  heatLevel: number;

  // Laundering
  launderingCapacity?: number; // For laundering fronts
}
```

**Files to create:**
- `app/lib/types/game/business.ts`
- `app/lib/data/mock/businesses.ts`
- `app/dashboard/business-content/business-management/business-management.tsx`

---

### 3.2 Rival Gangs & Conflicts ⏳ NEW
**Priority:** P1 - High
**Effort:** 4-5 days

**Problem:** No opposition or conflict mechanics
**Solution:** Implement rival gang system with attacks and diplomacy

**Features:**
- 3-4 rival MC chapters (Hells Angels, Bandidos, etc.)
- Rival gang stats (territory, strength, hostility)
- Random events (attacks on territories, members)
- Diplomacy options (truces, alliances, betrayals)
- Turf wars trigger automatically based on territory expansion
- Defend against raids

**New Entity:**
```typescript
interface RivalGang {
  id: string;
  name: string;
  logo: string;
  description: string;

  // Stats
  strength: number; // Overall power (1-100)
  controlledTerritories: string[]; // Territory IDs
  memberCount: number;

  // Relationship
  hostility: number; // -100 (war) to 100 (alliance)
  relationStatus: 'Hostile' | 'Neutral' | 'Truce' | 'Allied';

  // Activity
  lastAttack?: number; // Timestamp
  nextAttackProbability: number;
}

interface GangEvent {
  id: string;
  type: 'attack' | 'raid' | 'challenge' | 'offer';
  gangId: string;
  targetTerritoryId?: string;
  timestamp: number;
  resolved: boolean;
}
```

**Files to create:**
- `app/lib/types/game/rivals.ts`
- `app/lib/data/mock/rival-gangs.ts`
- `app/dashboard/rivals-content/rivals-content.tsx`
- New route: `/rivals`

---

### 3.3 Missions & Storyline ⏳ NEW
**Priority:** P2 - Medium
**Effort:** 5-6 days

**Problem:** No narrative structure or guided progression
**Solution:** Quest/mission system with story arcs

**Features:**
- Story missions (main storyline progression)
- Side missions (random jobs)
- Mission chains (multi-step objectives)
- Dialogue choices affecting outcomes
- Reputation requirements for unlocking missions
- Mission rewards (cash, equipment, territory access)

**New Entity:**
```typescript
interface Mission {
  id: string;
  title: string;
  description: string;
  storyline: boolean; // Main story vs side mission

  // Requirements
  requiredLevel: number;
  requiredRespekt: number;
  prerequisiteMissions: string[];

  // Objectives
  objectives: MissionObjective[];
  currentStep: number;

  // Rewards
  rewards: {
    kontanter?: number;
    respekt?: number;
    experience?: number;
    equipment?: string[]; // Equipment IDs
    territories?: string[]; // Unlocked territories
  };

  // State
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'failed';
  startedAt?: number;
  completedAt?: number;
}

interface MissionObjective {
  id: string;
  description: string;
  type: 'collect' | 'eliminate' | 'defend' | 'acquire' | 'reach';
  target?: string;
  current: number;
  required: number;
  completed: boolean;
}
```

**Files to create:**
- `app/lib/types/game/missions.ts`
- `app/lib/data/mock/missions.ts`
- `app/dashboard/missions-content/missions-content.tsx`
- New route: `/missions`

---

### 3.4 Events & Random Encounters ⏳ NEW
**Priority:** P2 - Medium
**Effort:** 3-4 days

**Problem:** Game feels static without dynamic events
**Solution:** Random event system with choices and consequences

**Features:**
- Random events triggered by game state (high heat, low cash, etc.)
- Event types: police raids, rival attacks, opportunities, member issues
- Choice-based outcomes
- Event history and consequences
- Notifications for important events

**New Entity:**
```typescript
interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'police_raid' | 'rival_attack' | 'opportunity' | 'member_event' | 'random';

  // Trigger conditions
  triggerConditions: {
    minHeat?: number;
    maxHeat?: number;
    minKontanter?: number;
    controlledTerritories?: number;
    probability: number; // % chance when conditions met
  };

  // Choices
  choices: EventChoice[];

  // State
  triggered: boolean;
  triggeredAt?: number;
  choiceSelected?: string;
  resolved: boolean;
}

interface EventChoice {
  id: string;
  label: string;
  description: string;
  consequences: {
    kontanterChange?: number;
    respektChange?: number;
    heatChange?: number;
    territoryLoss?: string[];
    memberLoss?: string[];
    equipmentGain?: string[];
  };
}
```

**Files to create:**
- `app/lib/types/game/events.ts`
- `app/lib/data/mock/events.ts`
- `app/components/EventModal.tsx`
- Event system in GameContext

---

### 3.5 Skills & Progression System ⏳ NEW
**Priority:** P2 - Medium
**Effort:** 2-3 days

**Problem:** No character development beyond equipment
**Solution:** Skill tree with unlockable abilities

**Features:**
- Skill categories (Combat, Stealth, Business, Leadership)
- Skill points earned through leveling
- Passive bonuses (increased crime success, lower heat, higher income)
- Active abilities (special operations, instant heat reduction)
- Skill requirements for certain operations

**New Entity:**
```typescript
interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'combat' | 'stealth' | 'business' | 'leadership';

  // Progression
  currentLevel: number;
  maxLevel: number;
  pointCost: number;

  // Requirements
  requiredPlayerLevel: number;
  prerequisiteSkills: string[];

  // Effects
  effects: SkillEffect[];
}

interface SkillEffect {
  type: 'passive' | 'active';
  stat?: string; // Which stat it affects
  value: number; // Bonus value
  description: string;
}

interface PlayerSkills {
  availablePoints: number;
  unlockedSkills: Record<string, number>; // skillId -> level
}
```

**Files to create:**
- `app/lib/types/game/skills.ts`
- `app/lib/data/mock/skills.ts`
- `app/dashboard/character-content/skill-tree/skill-tree.tsx`

---

## 🗄️ Phase 4: Database Integration (AFTER Phase 3)
**Goal:** Replace localStorage with PostgreSQL for production

### 4.1 Database Schema Design
**Effort:** 2-3 days

**Tables to create:**
- `users` - Player authentication
- `players` - Player game state
- `equipment_inventory` - Owned equipment
- `territories` - Territory ownership and control
- `operations` - Active operations
- `businesses` - Owned businesses
- `family_members` - Chapter members
- `missions` - Mission progress
- `events` - Triggered events
- `skills` - Unlocked skills
- `rival_gangs` - Gang relationships
- `game_sessions` - Save states

**Migration Strategy:**
1. Design schema based on completed TypeScript interfaces
2. Create Prisma schema
3. Set up database migrations
4. Create API routes for CRUD operations
5. Replace GameContext localStorage with API calls
6. Add loading states and error handling
7. Implement save slots system

---

### 4.2 Authentication & User Accounts
**Effort:** 3-4 days

**Features:**
- NextAuth integration (already configured)
- User registration/login
- Multiple save slots per user
- Cloud save synchronization
- Session management

---

### 4.3 API Layer
**Effort:** 4-5 days

**Create API routes:**
- `/api/player/*` - Player CRUD
- `/api/equipment/*` - Equipment management
- `/api/territories/*` - Territory operations
- `/api/operations/*` - Operations management
- `/api/businesses/*` - Business operations
- `/api/missions/*` - Mission progress
- `/api/save/*` - Save/load game state

---

## 🎨 Phase 5: Polish & Enhancement
**Goal:** Improve UX and add social features

### 5.1 Achievements System
- 50+ achievements
- Badge collection
- Stat tracking

### 5.2 Leaderboards
- Global rankings
- Chapter comparisons
- Weekly competitions

### 5.3 Social Features (Low Priority)
- Messages (already routed)
- Notifications
- Alliances with other players

### 5.4 Visual Enhancements
- Animations and transitions
- Sound effects
- Music tracks
- Loading screens

---

## 📋 Recommended Next Steps

### Immediate Priority (Phase 3)
1. **Business Management** (3-4 days) - Adds strategic income layer
2. **Rival Gangs** (4-5 days) - Adds conflict and challenge
3. **Events System** (3-4 days) - Makes game feel alive
4. **Missions** (5-6 days) - Adds structure and goals
5. **Skills** (2-3 days) - Adds character progression

**Total Phase 3 Estimate:** 17-22 days

### Then: Database Integration (Phase 4)
- At this point, all entities will be complete
- Database schema will map 1:1 to TypeScript interfaces
- Much easier to design comprehensive database structure
- Can migrate localStorage data to database

---

## 🎯 Why This Order?

1. **Complete game mechanics first** - Know exactly what data needs persistence
2. **Avoid database refactoring** - Design schema once when all entities are known
3. **Rapid prototyping** - localStorage allows fast iteration
4. **Better database design** - Full understanding of relationships and access patterns
5. **Test gameplay balance** - Easier to tweak numbers without database migrations

---

## 📊 Current Progress

**Phase 1:** ✅✅✅✅✅ (100%)
**Phase 2:** ✅✅✅✅✅ (100%)
**Phase 3:** ⬜⬜⬜⬜⬜ (0%)
**Phase 4:** ⬜⬜⬜⬜⬜ (0%)
**Phase 5:** ⬜⬜⬜⬜⬜ (0%)

**Overall:** 40% Complete
