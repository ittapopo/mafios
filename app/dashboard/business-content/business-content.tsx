import { CrimeItem } from "./crime-item/crime-item";

export const BusinessContent = () => {
    const crimeTiers = [
        { name: "Petty Theft", duration: 30, reward: 100, risk: "Low" },
        { name: "Pickpocketing", duration: 60, reward: 250, risk: "Low" },
        { name: "Grand Theft Auto", duration: 180, reward: 1000, risk: "Medium" },
        { name: "Bank Robbery", duration: 300, reward: 5000, risk: "High" },
        { name: "Drug Trafficking", duration: 600, reward: 15000, risk: "Very High" },
        { name: "Elite Heist", duration: 1200, reward: 50000, risk: "Extreme" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {crimeTiers.map((crime, index) => (
                <CrimeItem key={index} crime={crime} />
            ))}
        </div>
    );
};
