
type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic';

interface EquipmentItem {
    slot: string;
    label: string;
    stats: string;
    rarity: Rarity;
}

interface SecurityLevel {
    area: string;
    level: number;
    status: 'Compromised' | 'Secured' | 'Maximum Security';
    description: string;
}

interface Operation {
    name: string;
    type: 'Income' | 'Defense' | 'Offense';
    status: 'Active' | 'Cooldown' | 'Ready';
    efficiency: number;
}