import { Shield } from "lucide-react";

export const SecurityStatus = () => {
    const securityLevels: SecurityLevel[] = [
        {
            area: 'Perimeter',
            level: 3,
            status: 'Secured',
            description: 'Armed guards, surveillance, electric fence'
        },
        {
            area: 'Internal',
            level: 4,
            status: 'Maximum Security',
            description: 'Biometric access, panic rooms, escape tunnels'
        },
        {
            area: 'Digital',
            level: 2,
            status: 'Compromised',
            description: 'Firewall breach detected, countermeasures active'
        }
    ];

    return (
        <div className="bg-[#1A150F] p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#D4C5B2] text-xl">Security Status</h3>
                <Shield className="text-[#D4C5B2] h-6 w-6" />
            </div>
            <div className="space-y-4">
                {securityLevels.map((security) => (
                    <div key={security.area} className="border-b border-[#2A241D] pb-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[#B8A99A]">{security.area}</span>
                            <span className={`px-2 py-1 rounded text-sm ${security.status === 'Compromised' ? 'bg-red-900 text-red-200' :
                                security.status === 'Secured' ? 'bg-green-900 text-green-200' :
                                    'bg-blue-900 text-blue-200'
                                }`}>
                                {security.status}
                            </span>
                        </div>
                        <div className="w-full bg-[#2A241D] h-2 rounded-full">
                            <div
                                className="bg-[#D4C5B2] h-2 rounded-full"
                                style={{ width: `${(security.level / 5) * 100}%` }}
                            />
                        </div>
                        <p className="text-[#8B7355] text-sm mt-2">{security.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};