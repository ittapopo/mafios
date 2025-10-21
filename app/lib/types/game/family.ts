/**
 * Family-related game types
 */

export interface FamilyStats {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
}

export type MemberStatus = 'Active' | 'Inactive' | 'On Mission' | 'Deceased';

export interface FamilyMember {
    role: string;
    name: string;
    status: MemberStatus;
    traits: string[];
    loyalty: number;
    skills: {
        combat: number;
        stealth: number;
        charisma: number;
    };
}
