/**
 * Application routing types
 */

export type MainRoute = '/character' | '/headquarters' | '/family' | '/business' | '/territory' | '/defense';

export type SecondaryRoute = 'messages' | 'notifications' | 'invites' | 'recruitment' | 'rewards';

export type Route = MainRoute | SecondaryRoute;
