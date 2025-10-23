"use client";

import { useState } from "react";
import { CrimeItem } from "./crime-item/crime-item";
import { BusinessManagement } from "./business-management/business-management";
import { BusinessService } from "@/app/lib/data/services";

export const BusinessContent = () => {
    const [activeTab, setActiveTab] = useState<'businesses' | 'crimes'>('businesses');
    const crimeTiers = BusinessService.getCrimeTiers();

    return (
        <div className="bg-nordic-bg">
            {/* Tab Navigation */}
            <div className="border-b border-nordic-border bg-nordic-card">
                <div className="flex gap-1 p-2">
                    <button
                        onClick={() => setActiveTab('businesses')}
                        className={`px-6 py-3 rounded-t font-semibold transition-all ${
                            activeTab === 'businesses'
                                ? 'bg-nordic-bg text-nordic-accent border-b-2 border-nordic-accent'
                                : 'text-nordic-text-secondary hover:text-nordic-text-primary'
                        }`}
                    >
                        Business Fronts
                    </button>
                    <button
                        onClick={() => setActiveTab('crimes')}
                        className={`px-6 py-3 rounded-t font-semibold transition-all ${
                            activeTab === 'crimes'
                                ? 'bg-nordic-bg text-nordic-accent border-b-2 border-nordic-accent'
                                : 'text-nordic-text-secondary hover:text-nordic-text-primary'
                        }`}
                    >
                        Criminal Operations
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'businesses' && <BusinessManagement />}

            {activeTab === 'crimes' && (
                <div className="p-6">
                    <h2 className="text-nordic-text-primary text-2xl font-bold mb-6">Criminal Operations</h2>
                    <div className="space-y-8">
                        {crimeTiers.map((tier) => (
                            <div key={tier.tier}>
                                <h3 className="text-nordic-text-secondary text-lg font-semibold mb-4">{tier.tier}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {tier.crimes.map((crime) => (
                                        <CrimeItem key={crime.name} crime={crime} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
