import { DollarSign, Shield, Target, Radio } from "lucide-react";

export const OperationsCenter = () => {
    const operations: Operation[] = [
        {
            name: 'Protection Racket',
            type: 'Income',
            status: 'Active',
            efficiency: 85
        },
        {
            name: 'Territory Defense',
            type: 'Defense',
            status: 'Ready',
            efficiency: 100
        },
        {
            name: 'Rival Surveillance',
            type: 'Offense',
            status: 'Cooldown',
            efficiency: 30
        }
    ];

    const getOperationIcon = (type: Operation['type']) => {
        switch (type) {
            case 'Income': return <DollarSign className="h-5 w-5" />;
            case 'Defense': return <Shield className="h-5 w-5" />;
            case 'Offense': return <Target className="h-5 w-5" />;
        }
    };

    return (
        <div className="bg-[#1A150F] p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#D4C5B2] text-xl">Operations Center</h3>
                <Radio className="text-[#D4C5B2] h-6 w-6" />
            </div>
            <div className="grid gap-4">
                {operations.map((op) => (
                    <div key={op.name} className="bg-[#2A241D] p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {getOperationIcon(op.type)}
                                <span className="text-[#D4C5B2]">{op.name}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-sm ${op.status === 'Active' ? 'bg-green-900 text-green-200' :
                                op.status === 'Cooldown' ? 'bg-red-900 text-red-200' :
                                    'bg-yellow-900 text-yellow-200'
                                }`}>
                                {op.status}
                            </span>
                        </div>
                        <div className="w-full bg-[#1A150F] h-2 rounded-full">
                            <div
                                className="bg-[#D4C5B2] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${op.efficiency}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-[#8B7355] text-sm">Efficiency</span>
                            <span className="text-[#D4C5B2] text-sm">{op.efficiency}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};