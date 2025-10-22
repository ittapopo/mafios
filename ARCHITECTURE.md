# Architecture Documentation

## Overview

This document describes the architectural improvements implemented to make the Mafios project more maintainable, scalable, and future-proof.

## Project Structure

```
mafios/
├── app/
│   ├── components/                    # App-level components
│   │   ├── ErrorBoundary.tsx         # Error boundary for error handling
│   │   ├── LoadingSpinner.tsx        # Reusable loading component
│   │   └── index.ts
│   ├── lib/
│   │   ├── types/                    # Type definitions (organized by domain)
│   │   │   ├── routes.ts            # Route types
│   │   │   ├── navigation.ts        # Navigation component types
│   │   │   ├── game/                # Game entity types
│   │   │   │   ├── character.ts
│   │   │   │   ├── headquarters.ts
│   │   │   │   ├── business.ts
│   │   │   │   ├── family.ts
│   │   │   │   ├── territory.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts             # Main type exports
│   │   ├── data/                    # Data layer
│   │   │   ├── mock/                # Mock data for development
│   │   │   │   ├── character.ts
│   │   │   │   ├── business.ts
│   │   │   │   ├── headquarters.ts
│   │   │   │   ├── family.ts
│   │   │   │   └── territory.ts
│   │   │   └── services/            # Data access services
│   │   │       ├── character.service.ts
│   │   │       ├── business.service.ts
│   │   │       └── index.ts
│   │   ├── contexts/                # React contexts
│   │   │   ├── RouteContext.tsx     # Centralized routing state
│   │   │   └── index.ts
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useTimer.ts          # Timer hook with cleanup
│   │   │   ├── useLocalStorage.ts   # LocalStorage persistence hook
│   │   │   └── index.ts
│   │   ├── types.ts                 # Legacy types (deprecated, for backward compatibility)
│   │   └── utils.ts
│   ├── dashboard/                   # Dashboard feature
│   │   └── ...
│   └── ...
├── components/                       # Shared UI components
│   └── ...
├── tailwind.config.ts               # Tailwind with design tokens
└── ...
```

## Key Architectural Improvements

### 1. Domain-Driven Type Organization

**Before:**
- Single `app/lib/types.ts` file with all types mixed together

**After:**
- Types organized by domain in `app/lib/types/`
- Clear separation: routes, navigation, game entities
- Easier to find and maintain types
- Better tree-shaking and code splitting

**Usage:**
```typescript
import { Route, NavItem, Character } from '@/app/lib/types';
```

### 2. Data Layer Separation

**Before:**
- Hard-coded data directly in components
- No separation of concerns
- Difficult to test and maintain

**After:**
- Mock data in `app/lib/data/mock/`
- Service layer in `app/lib/data/services/`
- Easy to swap mock data with real API calls

**Usage:**
```typescript
import { CharacterService } from '@/app/lib/data/services';

const equipment = CharacterService.getEquipment();
```

### 3. Design Tokens in Tailwind

**Before:**
- Hard-coded hex colors throughout codebase (`#2A241D`, etc.)
- Difficult to maintain consistent theming

**After:**
- Semantic color tokens in `tailwind.config.ts`
- Easy to change theme globally
- Better developer experience with autocomplete

**Usage:**
```tsx
// Before:
<div className="bg-[#2A241D] text-[#D4C5B2]">

// After:
<div className="bg-mafia-bg text-mafia-text-primary">
```

**Available Tokens:**
- `mafia-bg`, `mafia-bg-dark`, `mafia-bg-darker` - Background colors
- `mafia-text-primary`, `mafia-text-secondary`, `mafia-text-muted` - Text colors
- `mafia-accent`, `mafia-accent-light`, `mafia-accent-dark` - Accent colors
- `mafia-border`, `mafia-border-light`, `mafia-border-dark` - Border colors
- `mafia-status-success`, `mafia-status-warning`, `mafia-status-danger`, `mafia-status-info` - Status colors

### 4. Routing Context

**Before:**
- Props drilling for route state
- `handleRouteChange` callback passed through multiple components

**After:**
- Centralized routing state with Context API
- No props drilling
- Easy to extend with route history, transitions, etc.

**Usage:**
```typescript
import { useRoute } from '@/app/lib/hooks';

function MyComponent() {
  const { currentRoute, navigateTo } = useRoute();

  return (
    <button onClick={() => navigateTo('/headquarters')}>
      Go to HQ
    </button>
  );
}
```

### 5. Custom Hooks

Reusable logic extracted into hooks:

**`useTimer`** - Timer with proper cleanup
```typescript
import { useTimer } from '@/app/lib/hooks';

const { timeLeft, isRunning, start, stop } = useTimer({
  onComplete: () => console.log('Done!')
});

start(60); // Start 60 second timer
```

**`useLocalStorage`** - Persist state to localStorage
```typescript
import { useLocalStorage } from '@/app/lib/hooks';

const [name, setName] = useLocalStorage('playerName', 'Don Vittorio');
```

**`useRoute`** - Access routing context
```typescript
import { useRoute } from '@/app/lib/hooks';

const { currentRoute, navigateTo } = useRoute();
```

### 6. Error Boundaries

**Before:**
- No error handling
- App could crash with white screen

**After:**
- `ErrorBoundary` component wraps the app
- Graceful error handling with fallback UI
- User can refresh to recover

**Usage:**
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 7. Loading States

Reusable loading spinner component:

```tsx
import { LoadingSpinner } from '@/app/components';

<LoadingSpinner size="lg" message="Loading..." fullScreen />
```

## Migration Guide

### Updating Components to Use New Architecture

1. **Import types from new location:**
```typescript
// Old:
import { Route } from '../lib/types';

// New (works the same, but types are better organized):
import { Route } from '@/app/lib/types';
```

2. **Use routing context instead of props:**
```typescript
// Old:
interface Props {
  onRouteChange: (route: Route) => void;
  currentRoute: Route;
}

// New:
import { useRoute } from '@/app/lib/hooks';

function MyComponent() {
  const { currentRoute, navigateTo } = useRoute();
  // No more props needed!
}
```

3. **Use design tokens instead of hex colors:**
```tsx
// Old:
<div className="bg-[#2A241D] text-[#D4C5B2]">

// New:
<div className="bg-mafia-bg text-mafia-text-primary">
```

4. **Use service layer for data:**
```typescript
// Old:
const equipment = [
  { slot: 'Weapon', label: 'Thompson', ... },
  // ...
];

// New:
import { CharacterService } from '@/app/lib/data/services';
const equipment = CharacterService.getEquipment();
```

## Bug Fixes

### Memory Leak in CrimeItem

**Issue:** Timer intervals were not cleaned up on component unmount, causing memory leaks.

**Fix:** Extracted timer logic to `useTimer` hook with proper cleanup using `useEffect`.

**Location:** `app/dashboard/business-content/crime-item/crime-item.tsx`

### Missing Route Implementation

**Issue:** `/defense` route was defined in types but not implemented in dashboard switch statement.

**Fix:** Added placeholder implementation for `/defense` route.

**Location:** `app/dashboard/page.tsx:34-41`

## Future Enhancements

### Recommended Next Steps

1. **Replace Next.js Custom Routing with App Router**
   - Use Next.js App Router for better SEO and performance
   - File-based routing instead of client-side switch statement

2. **Add State Management**
   - Consider Zustand or Redux for complex global state
   - Currently using Context API (suitable for current scale)

3. **Add API Integration**
   - Replace mock services with real API calls
   - Services already structured to make this easy

4. **Add Testing**
   - Unit tests for services and hooks
   - Component tests with React Testing Library
   - E2E tests with Playwright

5. **Add Animation Library**
   - Framer Motion for page transitions
   - Animations already defined in Tailwind config

6. **Accessibility**
   - Add ARIA labels
   - Keyboard navigation
   - Screen reader support

## Best Practices

### When Adding New Features

1. **Define types first** in appropriate domain folder
2. **Create mock data** in `app/lib/data/mock/`
3. **Create service** in `app/lib/data/services/`
4. **Build component** using service and types
5. **Wrap in ErrorBoundary** if needed
6. **Use design tokens** for styling

### Code Organization

- Keep components small and focused
- Extract reusable logic to hooks
- Use services for data access
- Define types in domain folders
- Use design tokens for theming

### Performance

- Use React.memo for expensive components
- Lazy load routes if needed
- Optimize images and assets
- Monitor bundle size

## Troubleshooting

### Build Errors

If you encounter build errors after the architectural changes:

1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `pnpm install`
3. Rebuild: `pnpm run build`

### Type Errors

The new type system is backward compatible. If you see type errors:

1. Check imports are from `@/app/lib/types`
2. Use specific type imports (e.g., `Route`, `NavItem`)
3. Check the migration guide above

### Runtime Errors

If the app crashes:

1. Check browser console for errors
2. Error boundary will show detailed error info
3. Check if components are wrapped in RouteProvider

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Context API](https://react.dev/reference/react/useContext)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
