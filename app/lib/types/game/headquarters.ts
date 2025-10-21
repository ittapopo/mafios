/**
 * Headquarters-related game types
 */

export type SecurityStatus = 'Compromised' | 'Secured' | 'Maximum Security';

export interface SecurityLevel {
    area: string;
    level: number;
    status: SecurityStatus;
    description: string;
}

export type OperationType = 'Income' | 'Defense' | 'Offense';
export type OperationStatus = 'Active' | 'Cooldown' | 'Ready';

export interface Operation {
    name: string;
    type: OperationType;
    status: OperationStatus;
    efficiency: number;
}
