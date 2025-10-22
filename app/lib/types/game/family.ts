/**
 * Family-related game types
 */

export interface FamilyStats {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
}

export type MemberStatus = 'Active' | 'Inactive' | 'On Mission' | 'Deceased';
export type MemberAction = 'Trade' | 'Negotiate' | 'Command' | 'Study' | 'Train' | 'Quest' | 'Counsel' | 'Scheme' | 'Influence';

export interface FamilyMember {
    id: string;
    role: string;
    name: string;
    status: MemberStatus;
    traits: string[];
    loyalty: number;
    power: number;
    actions: MemberAction[];
    skills: {
        combat: number;
        stealth: number;
        charisma: number;
    };
}
