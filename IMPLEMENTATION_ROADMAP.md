# Implementation Roadmap - From Prototype to Playable Game

**Strategic plan for implementing all placeholder features and making the game functional**

---

## Current State Assessment

### What Works ✅
- Responsive layout (mobile to desktop)
- Nordic theme and visual design
- Navigation and routing
- Crime timer functionality (UI only)
- Territory selection (UI only)
- Component architecture

### What Doesn't Work ❌
- 6 routes incomplete (/defense + 5 social features)
- 10+ buttons without handlers
- All data is hardcoded in components (not using services)
- No game state management
- No persistence
- No actual game mechanics (rewards, progression, etc.)
- Stats never update

---

## Priority Categories

### 🔴 **P0 - Critical (MVP Blockers)**
Features absolutely required for a minimal playable experience

### 🟠 **P1 - High Priority**
Core gameplay features that make the game engaging

### 🟡 **P2 - Medium Priority**
Enhancement features that improve the experience

### 🟢 **P3 - Low Priority**
Nice-to-have features for future releases

---

## Phase 1: Foundation (Week 1-2)
**Goal:** Connect existing UI to data layer, enable basic state management

### 🔴 P0 - Critical

#### 1.1 Global Game State
**Problem:** No centralized state management
**Solution:** Implement React Context or Zustand for game state

```typescript
// app/lib/contexts/GameContext.tsx
interface GameState {
  player: {
    name: string;
    kontanter: number;    // Cash
    inflytande: number;   // Influence
    respekt: number;      // Respect
    polisbevakning: number; // Heat
  };
  chapter: {
    name: string;
    members: FamilyMember[];
    territories: Territory[];
  };
  operations: Operation[];
  equipment: EquipmentItemType[];
}
```

**Files to create:**
- `app/lib/contexts/GameContext.tsx`
- `app/lib/hooks/useGameState.ts`

**Effort:** 2-3 days
**Dependencies:** None
**Impact:** High - enables all other features

---

#### 1.2 Connect Components to Services
**Problem:** Components have hardcoded data instead of using services
**Solution:** Replace hardcoded arrays with service calls

**Priority files to update:**
1. **CharacterProfile** → Use `CharacterService.getEquipment()`
2. **MaterialStatus** → Use `CharacterService.getMaterials()`
3. **BusinessContent** → Use `BusinessService.getCrimeTiers()`
4. **FamilyMembers** → Use service (to be created)
5. **SecurityStatus** → Use service (to be created)
6. **TerritoryContent** → Use service (to be created)

**Example refactor:**
```typescript
// Before (hardcoded):
const equipment = [
  { slot: 'Weapon', label: 'CZ Scorpion', ... }
];

// After (service-based):
import { CharacterService } from '@/app/lib/data/services';
const equipment = CharacterService.getEquipment();
```

**Effort:** 3-4 days
**Dependencies:** Services exist, just need to wire up
**Impact:** High - removes code duplication, enables data updates

---

#### 1.3 Implement LocalStorage Persistence
**Problem:** Game state resets on page reload
**Solution:** Use `useLocalStorage` hook (already created)

**What to persist:**
- Player stats (cash, influence, respect, heat)
- Chapter data
- Territory control
- Equipment
- Operation status

**Files to update:**
- `app/lib/contexts/GameContext.tsx` - Add persistence layer

**Effort:** 1 day
**Dependencies:** 1.1 (Game State)
**Impact:** High - enables progression

---

### 🟠 P1 - High Priority

#### 1.4 Make Crime Operations Functional
**Problem:** Crimes only log to console, don't update game state
**Solution:** Implement reward system and state updates

**Features:**
- Award kontanter (cash) on completion
- Risk-based success/failure
- Heat (polisbevakning) increase
- Update top stats display

**Files to update:**
- `app/dashboard/business-content/crime-item/crime-item.tsx`
- `app/lib/data/services/business.service.ts`

**Effort:** 2 days
**Dependencies:** 1.1 (Game State)
**Impact:** High - core gameplay loop

---

#### 1.5 Top Stats Live Updates
**Problem:** Stats are hardcoded and never change
**Solution:** Connect to game state

**Files to update:**
- `app/dashboard/top-stats/stat-card.tsx`

**Stats to track:**
- Respekt (Respect) - changes from completing operations
- Inflytande (Influence) - changes from family actions
- Kontanter (Cash) - changes from crimes
- Family size - changes from recruitment
- Territory count - changes from expansion

**Effort:** 1 day
**Dependencies:** 1.1 (Game State)
**Impact:** High - player feedback

---

## Phase 2: Core Gameplay (Week 3-4)
**Goal:** Implement essential game mechanics

### 🟠 P1 - High Priority

#### 2.1 Family Member Management
**Problem:** "Manage Dynasty" and action buttons do nothing
**Solution:** Implement member interactions

**Features:**
- Assign members to operations
- Member stat progression (leveling)
- Member actions affect game state:
  - **Trade** → Increases kontanter
  - **Negotiate** → Increases inflytande
  - **Command** → Improves operation efficiency
  - **Study** → Increases member intelligence
  - **Train** → Increases member combat
  - **Quest** → Random rewards
  - **Counsel** → Decreases heat
  - **Scheme** → Rare high-reward operations
  - **Influence** → Increases faction influence

**Files to update:**
- `app/dashboard/family-content/family-members/family-members.tsx`
- Create: `app/lib/data/services/family.service.ts`

**Effort:** 3-4 days
**Dependencies:** 1.1 (Game State)
**Impact:** High - adds depth

---

#### 2.2 Territory Control Mechanics
**Problem:** Territory selection is UI-only, no actual control
**Solution:** Implement territory ownership and income

**Features:**
- Take control of territories (requires resources)
- Defend territories from rivals
- Generate passive income from controlled territories
- Lose territories if heat is too high
- Territory bonuses/debuffs

**Files to update:**
- `app/dashboard/territory-content/territory-content.tsx`
- Create: `app/lib/data/services/territory.service.ts`

**Effort:** 3-4 days
**Dependencies:** 1.1 (Game State)
**Impact:** High - strategic layer

---

#### 2.3 Defense Route Implementation
**Problem:** Shows "Coming soon" placeholder
**Solution:** Build defense management screen

**Features:**
- Clubhouse security upgrades
- Alarm systems
- Guard hiring
- Reduce heat (polisbevakning)
- Prevent territory loss

**Files to create:**
- `app/dashboard/defense-content/defense-content.tsx`
- `app/dashboard/defense-content/security-upgrades/security-upgrades.tsx`

**Effort:** 2-3 days
**Dependencies:** 1.1 (Game State), 2.2 (Territory)
**Impact:** Medium - completes main navigation

---

### 🟡 P2 - Medium Priority

#### 2.4 Equipment System
**Problem:** Equipment is displayed but can't be changed
**Solution:** Implement equipment management

**Features:**
- Buy/sell equipment
- Equip/unequip items
- Equipment bonuses (stats, crime success rate)
- Rarity tiers affect prices

**Files to update:**
- `app/dashboard/character-content/character-profile/character-profile.tsx`
- `app/lib/data/services/character.service.ts`

**Effort:** 2 days
**Dependencies:** 1.1 (Game State)
**Impact:** Medium - customization

---

#### 2.5 Operations Center Functionality
**Problem:** Operations show efficiency but can't be managed
**Solution:** Implement operation management

**Features:**
- Start/stop operations
- Upgrade operation efficiency
- Assign family members to operations
- Operations generate passive income/influence

**Files to update:**
- `app/dashboard/headquarters-content/security-status/operations-center.tsx`
- Create: `app/lib/data/services/operations.service.ts`

**Effort:** 2-3 days
**Dependencies:** 1.1 (Game State), 2.1 (Family)
**Impact:** Medium - passive income

---

## Phase 3: Social Features (Week 5-6)
**Goal:** Implement right sidebar social features

### 🟡 P2 - Medium Priority

#### 3.1 Messages System
**Problem:** Route exists but shows nothing
**Solution:** Build messaging interface

**Features:**
- Inbox for messages
- Messages from rivals (threats, proposals)
- Messages from police (warnings about heat)
- Messages from family members (events)
- Mark as read/unread
- Count badge updates

**Files to create:**
- `app/dashboard/messages-content/messages-content.tsx`
- `app/lib/data/services/messages.service.ts`

**Effort:** 2-3 days
**Dependencies:** 1.1 (Game State)
**Impact:** Medium - narrative depth

---

#### 3.2 Notifications System
**Problem:** Route exists but shows nothing
**Solution:** Build notifications feed

**Features:**
- Crime completion notifications
- Territory attacked notifications
- Family member events
- Resource threshold warnings
- Achievement unlocks

**Files to create:**
- `app/dashboard/notifications-content/notifications-content.tsx`
- `app/lib/data/services/notifications.service.ts`

**Effort:** 2 days
**Dependencies:** 1.1 (Game State)
**Impact:** Medium - player awareness

---

#### 3.3 Invites/Recruitment
**Problem:** Routes exist but show nothing
**Solution:** Build recruitment system

**Invites:**
- Invitations from other players (if multiplayer)
- Alliance proposals
- Chapter merger offers

**Recruitment:**
- Hire new family members
- Costs kontanter and inflytande
- Random traits and skills
- Limited slots

**Files to create:**
- `app/dashboard/invites-content/invites-content.tsx`
- `app/dashboard/recruitment-content/recruitment-content.tsx`
- `app/lib/data/services/recruitment.service.ts`

**Effort:** 3-4 days
**Dependencies:** 1.1 (Game State), 2.1 (Family)
**Impact:** Medium - growth mechanic

---

### 🟢 P3 - Low Priority

#### 3.4 Rewards System
**Problem:** Route exists but shows nothing
**Solution:** Build rewards/achievements interface

**Features:**
- Daily login rewards
- Achievement system
- Milestone rewards
- Special events
- Leaderboards (if multiplayer)

**Files to create:**
- `app/dashboard/rewards-content/rewards-content.tsx`
- `app/lib/data/services/rewards.service.ts`

**Effort:** 2-3 days
**Dependencies:** 1.1 (Game State)
**Impact:** Low - retention feature

---

## Phase 4: Polish & Enhancement (Week 7-8)
**Goal:** Improve UX and add polish

### 🟡 P2 - Medium Priority

#### 4.1 Character Image Upload
**Problem:** Shows "Upload" placeholder but no functionality
**Solution:** Implement image upload

**Features:**
- File upload (drag & drop, file input)
- Image preview
- Crop/resize
- Save to localStorage (base64) or cloud storage

**Libraries needed:**
- `react-dropzone` or native file input
- `react-easy-crop` (optional)

**Effort:** 1-2 days
**Dependencies:** None
**Impact:** Low - cosmetic

---

#### 4.2 Animations & Transitions
**Problem:** Some interactions feel static
**Solution:** Add micro-interactions

**Features:**
- Crime completion celebration animation
- Territory capture effect
- Resource gain/loss animations
- Button click feedback
- Toast notifications

**Libraries:**
- Framer Motion (already have keyframes in Tailwind)
- `react-hot-toast` for notifications

**Effort:** 2-3 days
**Dependencies:** None
**Impact:** Medium - feel/polish

---

#### 4.3 Tutorial/Onboarding
**Problem:** No guidance for new players
**Solution:** Build interactive tutorial

**Features:**
- Welcome screen
- First-time user guide
- Tooltips for features
- Progressive disclosure
- Skipable

**Libraries:**
- `react-joyride` or custom modal system

**Effort:** 2-3 days
**Dependencies:** Most features complete
**Impact:** Medium - new player experience

---

### 🟢 P3 - Low Priority

#### 4.4 Sound Effects & Music
**Problem:** Silent experience
**Solution:** Add ambient audio

**Features:**
- Nordic noir background music
- Button click sounds
- Crime completion sounds
- Notification pings
- Mute toggle

**Effort:** 1-2 days
**Dependencies:** None
**Impact:** Low - atmosphere

---

#### 4.5 Accessibility Improvements
**Problem:** Limited accessibility support
**Solution:** Enhance ARIA and keyboard navigation

**Features:**
- Complete ARIA labels
- Keyboard shortcuts
- Focus management
- Screen reader announcements
- High contrast mode
- Font size controls

**Effort:** 2-3 days
**Dependencies:** None
**Impact:** Medium - inclusivity

---

## Phase 5: Advanced Features (Week 9+)
**Goal:** Add depth and replayability

### 🟢 P3 - Low Priority

#### 5.1 Rival Chapters (AI)
**Problem:** No opposition, game is too easy
**Solution:** Implement AI-controlled rival MC chapters

**Features:**
- Rival chapters compete for territories
- Random events (attacks, treaties)
- AI-driven crime operations
- Chapter reputation system

**Effort:** 1-2 weeks
**Dependencies:** Phase 1-3 complete
**Impact:** High - challenge & replayability

---

#### 5.2 Random Events System
**Problem:** Predictable gameplay
**Solution:** Implement random events

**Event types:**
- Police raid (lose resources/members)
- Shipment arrives (bonus resources)
- Rival provocation (territory at risk)
- Informant offer (reduce heat for kontanter)
- Weather affects operations

**Effort:** 1 week
**Dependencies:** Phase 1-2 complete
**Impact:** Medium - variety

---

#### 5.3 Progression System
**Problem:** No long-term goals
**Solution:** Implement rank/prestige system

**Features:**
- MC chapter levels
- Unlock new operations at higher levels
- Prestige reset (New Game+)
- Difficulty tiers
- Leaderboards

**Effort:** 1 week
**Dependencies:** Phase 1-3 complete
**Impact:** High - retention

---

#### 5.4 Multiplayer (Optional)
**Problem:** Single-player only
**Solution:** Add competitive multiplayer

**Features:**
- Real player vs player
- Alliance system
- Territory wars
- Trading between players
- Chat system

**Technology:**
- Firebase/Supabase for backend
- WebSockets for real-time
- Authentication system

**Effort:** 3-4 weeks
**Dependencies:** All phases complete
**Impact:** Very High - but complex

---

## Minimum Viable Product (MVP)

To get to a **playable game** quickly, focus on these features:

### MVP Scope (Phase 1 + Core Phase 2)
**Timeline: 4 weeks**

✅ **Must Have:**
1. Global game state (Game Context)
2. Connect all components to services
3. LocalStorage persistence
4. Functional crime operations (with rewards)
5. Live updating stats
6. Basic family member actions
7. Territory control mechanics
8. Defense route implementation

❌ **Can Wait:**
- Social features (messages, notifications, invites, rewards)
- Advanced animations
- Sound effects
- Tutorial
- Multiplayer
- Rival chapters
- Random events

---

## Technical Debt to Address

### High Priority
1. **Remove hardcoded data from components** → Use services
2. **Implement global state** → Context or Zustand
3. **Add persistence** → LocalStorage
4. **Wire up button handlers** → Connect to game logic

### Medium Priority
5. **Add error boundaries** → Already have ErrorBoundary, use it more
6. **Implement loading states** → Use LoadingSpinner
7. **Add form validation** → If adding inputs
8. **Optimize re-renders** → React.memo, useMemo

### Low Priority
9. **Remove console.logs** → Use proper logging
10. **Add unit tests** → Jest + React Testing Library
11. **Add E2E tests** → Playwright
12. **Performance monitoring** → React DevTools Profiler

---

## Implementation Strategy

### Week-by-Week Plan

**Week 1: Foundation**
- Day 1-2: Game Context + state management
- Day 3-4: Connect services to components
- Day 5: LocalStorage persistence

**Week 2: Core Mechanics**
- Day 1-2: Crime rewards system
- Day 3: Live stats updates
- Day 4-5: Basic family actions

**Week 3: Gameplay Depth**
- Day 1-3: Territory mechanics
- Day 4-5: Defense route

**Week 4: Equipment & Operations**
- Day 1-2: Equipment system
- Day 3-5: Operations management

**Week 5-6: Social (if time permits)**
- Messages
- Notifications
- Recruitment

**Week 7-8: Polish**
- Animations
- Tutorial
- Bug fixes

---

## Success Metrics

### MVP Complete When:
- [ ] Player can complete crimes and earn kontanter
- [ ] Stats update in real-time
- [ ] Game state persists across reloads
- [ ] Player can control territories
- [ ] Family members can perform actions
- [ ] Defense systems work
- [ ] All 6 main routes functional
- [ ] No hardcoded data in components

### Full V1 Complete When:
- [ ] All social features implemented
- [ ] Animations and polish complete
- [ ] Tutorial available
- [ ] Sound effects added
- [ ] Accessibility compliant
- [ ] No known critical bugs

---

## Risk Assessment

### High Risk
- **State management complexity** → Mitigate: Start simple with Context, migrate to Zustand if needed
- **Scope creep** → Mitigate: Stick to MVP, defer nice-to-haves
- **Performance issues** → Mitigate: Profile early, optimize as needed

### Medium Risk
- **Data structure changes** → Mitigate: Design schemas upfront
- **Browser compatibility** → Mitigate: Test in multiple browsers
- **Mobile performance** → Mitigate: Optimize for mobile early

### Low Risk
- **UI consistency** → Mitigate: Have design system (already done)
- **Code quality** → Mitigate: Use TypeScript, ESLint

---

## Next Steps

### Immediate Actions (This Week)
1. **Create Game Context** (`app/lib/contexts/GameContext.tsx`)
2. **Define state interface** (GameState type)
3. **Update CharacterProfile** to use CharacterService
4. **Update BusinessContent** to use BusinessService
5. **Implement crime reward logic**

### Short Term (Next 2 Weeks)
6. Connect all remaining components to services
7. Implement LocalStorage persistence
8. Make stats live update
9. Add family member action handlers
10. Build territory control system

### Medium Term (Next Month)
11. Complete defense route
12. Build social features
13. Add equipment management
14. Implement operations center

### Long Term (2+ Months)
15. Add rival chapters
16. Random events
17. Progression system
18. Consider multiplayer

---

## Conclusion

The roadmap prioritizes getting to a **playable MVP in 4 weeks** by focusing on:
1. **Foundation** (state, services, persistence)
2. **Core gameplay** (crimes, territories, family)
3. **Essential routes** (defense)

Social features, polish, and advanced mechanics can be added incrementally after the MVP is functional.

**Start with Phase 1, complete MVP before adding nice-to-haves.**
