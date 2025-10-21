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

### Routing System
The application uses a **custom client-side routing system** instead of Next.js App Router:
- Main dashboard page: `app/dashboard/page.tsx` - client component managing all routes
- Routes defined in `app/lib/types.ts` as the `Route` type
- Navigation handled via state (`currentRoute`) and route change callbacks
- Route types: `/character`, `/headquarters`, `/family`, `/business`, `/territory`, `/defense`

**Important**: When adding new routes or pages, update the Route type in `app/lib/types.ts` and the switch statement in `app/dashboard/page.tsx`.

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
- **Shared components**: `components/` directory (navigation items, UI primitives)
- **Feature components**: Colocated within their respective `app/dashboard/*-content/` directories
- **UI primitives**: `components/ui/` (button, etc.) using shadcn/ui patterns
- **Navigation**: Reusable `NavigationItem` component in `components/navigation/`

### Type System
All shared types are centralized in `app/lib/types.ts`:
- Route definitions
- Component prop interfaces
- Game entity types (Equipment, Security, Operations, etc.)
- Navigation item structures

### Styling
- TailwindCSS with custom color palette for mafia theme
- Primary colors: `#2A241D` (background), `#1A150F` (darker), `#D4C5B2`, `#B8A99A`, `#8B7355` (text/accents)
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
1. Add route to `Route` type in `app/lib/types.ts`
2. Create content component in `app/dashboard/[route-name]-content/`
3. Add case to switch statement in `app/dashboard/page.tsx:18-33`
4. Add navigation item to appropriate navigation bar

### Component Conventions
- Use `"use client"` directive for components with interactivity
- Prefer functional components with TypeScript interfaces for props
- Colocate sub-components within feature directories
- Import types from `@/app/lib/types`

### File Organization
- Feature-based organization within `app/dashboard/`
- Each content area has its own folder with main component and sub-components
- Shared utilities in `app/lib/`
- Reusable UI components in `components/`
