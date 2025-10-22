"use client";

import { CrimeItem } from "./crime-item/crime-item";
import { BusinessService } from "@/app/lib/data/services";

export const BusinessContent = () => {
    const crimeTiers = BusinessService.getCrimeTiers();

    return (
        <div className="bg-nordic-bg p-6">
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
    );
};
