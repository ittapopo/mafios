# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a mafia-themed game dashboard application built with Next.js 15 (canary), React 19 (RC), and TypeScript. The project features a single-page application with client-side routing that simulates a mafia organization management interface.

## Commands

### Development
```bash
pnpm run dev        # Start development server
pnpm run build      # Build production bundle
pnpm start          # Start production server
```

Note: This project uses `pnpm` as the package manager (use `pn` as shorthand).

## Architecture

**NOTE:** The architecture has been significantly improved. See `ARCHITECTURE.md` for full details.

### Routing System
The application uses a **custom client-side routing system** with Context API:
- Main dashboard page: `app/dashboard/page.tsx` - wrapped in `RouteProvider`
- Routes defined in `app/lib/types/routes.ts`
- Navigation handled via `useRoute()` hook - no more props drilling!
- Route types: `/character`, `/headquarters`, `/family`, `/business`, `/territory`, `/defense`

**Important**: When adding new routes:
1. Add route to `Route` type in `app/lib/types/routes.ts`
2. Create content component in `app/dashboard/[route-name]-content/`
3. Add case to switch statement in `app/dashboard/page.tsx`
4. Add navigation item to appropriate navigation bar

### Layout Structure
The dashboard follows a three-column layout pattern:
- **Left**: Navigation bar (`left-navigation-bar/`) with main menu items
- **Center**: Main content area with top stats grid and dynamic content based on current route
- **Right**: Secondary navigation bar (`right-navigation-bar/`) for messages, notifications, etc.

### Content Organization
Each route has its own content component organized in feature folders:
- `character-content/` - Character profile and material status
- `headquarters-content/` - Security status and operations center
- `family-content/` - Family dynasty stats and members
- `business-content/` - Crime operations and business management
- `territory-content/` - Territory control and management

Pattern: Each content folder contains a main component and sub-components for specific features.

### Component Structure
- **App components**: `app/components/` (ErrorBoundary, LoadingSpinner)
- **Shared components**: `components/` directory (navigation items, UI primitives)
- **Feature components**: Colocated within their respective `app/dashboard/*-content/` directories
- **UI primitives**: `components/ui/` (button, etc.) using shadcn/ui patterns
- **Navigation**: Reusable `NavigationItem` component in `components/navigation/`

### Type System
Types are **organized by domain** in `app/lib/types/`:
- `routes.ts` - Route definitions
- `navigation.ts` - Navigation component types
- `game/` - Game entity types organized by feature
  - `character.ts` - Equipment, Rarity, MaterialStatus
  - `headquarters.ts` - SecurityLevel, Operation
  - `business.ts` - Crime types
  - `family.ts` - FamilyMember, FamilyStats
  - `territory.ts` - Territory types
- `index.ts` - Barrel export for all types

**Import pattern**: `import { Route, NavItem, Character } from '@/app/lib/types'`

### Data Layer
Separation of data from presentation:
- **Mock data**: `app/lib/data/mock/` - Organized by feature
- **Services**: `app/lib/data/services/` - Data access layer
  - `CharacterService` - Character data
  - `BusinessService` - Crime/business data
  - Easy to swap mock data with real API calls later

**Usage**: `import { CharacterService } from '@/app/lib/data/services'`

### State Management
- **Routing**: Context API via `RouteProvider` and `useRoute()` hook
- **Component state**: React hooks (useState, useReducer)
- **Future**: Can add Zustand/Redux if needed

### Custom Hooks
Reusable logic extracted to `app/lib/hooks/`:
- `useRoute()` - Access routing context
- `useTimer()` - Timer with proper cleanup (fixes memory leaks!)
- `useLocalStorage()` - Persist state to localStorage

### Error Handling
- `ErrorBoundary` component wraps the entire dashboard
- Graceful error handling with fallback UI
- Located in `app/components/ErrorBoundary.tsx`

### Styling
- TailwindCSS with **design tokens** for mafia theme
- Use semantic tokens instead of hex colors:
  - `bg-mafia-bg`, `bg-mafia-bg-dark` (instead of `bg-[#2A241D]`)
  - `text-mafia-text-primary`, `text-mafia-text-secondary` (instead of `text-[#D4C5B2]`)
  - `border-mafia-border`, `border-mafia-border-light`
  - `mafia-status-success`, `mafia-status-danger`, etc.
- Global styles in `components/ui/global.css`
- Path alias `@/` configured for root directory imports

### Key Dependencies
- **Next.js 15 (canary)** - React framework
- **React 19 (RC)** - UI library
- **NextAuth** (beta) - Authentication (configured but not actively used)
- **Vercel Postgres** - Database integration (configured but not actively used)
- **Lucide React** - Icon library
- **shadcn/ui** - UI component patterns
- **Zod** - Schema validation

## Development Notes

### Adding New Routes
1. Add route to `Route` type in `app/lib/types/routes.ts`
2. Create content component in `app/dashboard/[route-name]-content/`
3. Add case to switch statement in `app/dashboard/page.tsx`
4. Add navigation item to appropriate navigation bar

### Component Conventions
- Use `"use client"` directive for components with interactivity
- Prefer functional components with TypeScript interfaces for props
- Colocate sub-components within feature directories
- Import types from `@/app/lib/types`
- Use `useRoute()` hook instead of props for navigation
- Use design tokens (`bg-mafia-bg`) instead of hex colors
- Extract reusable logic to custom hooks

### File Organization
- Feature-based organization within `app/dashboard/`
- Each content area has its own folder with main component and sub-components
- Shared utilities in `app/lib/`
- Reusable UI components in `components/`
- Types organized by domain in `app/lib/types/`
- Mock data in `app/lib/data/mock/`
- Services in `app/lib/data/services/`
- Custom hooks in `app/lib/hooks/`

### Best Practices
1. **Always use design tokens** for colors (not hex codes)
2. **Use services for data access** (not hard-coded data in components)
3. **Extract reusable logic to hooks** (see `useTimer` example)
4. **Wrap new features in ErrorBoundary** if they might fail
5. **Use TypeScript strictly** - all types should be defined
6. **Follow the established patterns** - consistency is key
