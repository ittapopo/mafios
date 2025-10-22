/**
 * Centralized type exports
 *
 * This file provides a single import point for all application types.
 * Types are organized by domain for better maintainability.
 */

// Routing types
export * from './routes';

// Navigation types
export * from './navigation';

// Game entity types
export * from './game';

// Backward compatibility - deprecated, use specific imports
/** @deprecated Use specific imports from './routes' instead */
export type { Route } from './routes';

/** @deprecated Use NavItem from './navigation' instead */
export type { NavItem as NavigationItem } from './navigation';
