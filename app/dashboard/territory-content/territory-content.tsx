import { useState } from "react";

export const TerritoryContent = () => {
    const mapImage = "/Lost_Heaven_Map.webp"; // Path to the map image

    const territories = [
        { name: "Chinatown", position: { top: "15%", left: "30%" }, bonus: "+10% Income", debuff: "+5% Risk" },
        { name: "Little Italy", position: { top: "40%", left: "25%" }, bonus: "+5% Reputation", debuff: "None" },
        { name: "Downtown", position: { top: "35%", left: "50%" }, bonus: "+15% Income", debuff: "+10% Risk" },
        { name: "Oakwood", position: { top: "60%", left: "70%" }, bonus: "-5% Risk", debuff: "-10% Income" },
        { name: "Central Island", position: { top: "50%", left: "40%" }, bonus: "+20% Reputation", debuff: "+10% Risk" }
    ];

    const [selectedTerritory, setSelectedTerritory] = useState(null);

    const selectTerritory = (territory) => {
        setSelectedTerritory(territory);
    };

    return (
        <div className="relative w-full h-screen">
            <img src={mapImage} alt="Territory Map" className="absolute w-full h-full object-cover" />

            {territories.map((territory, index) => (
                <div
                    key={index}
                    onClick={() => selectTerritory(territory)}
                    className="absolute bg-[#8B7355] text-[#D4C5B2] p-2 rounded-lg cursor-pointer hover:bg-[#A08765]"
                    style={{
                        top: territory.position.top,
                        left: territory.position.left,
                        transform: "translate(-50%, -50%)"
                    }}
                >
                    {territory.name}
                </div>
            ))}

            {selectedTerritory && (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[#1A150F] p-4 rounded-lg border-2 border-[#8B7355] text-[#D4C5B2] w-96">
                    <h3 className="text-lg font-medium mb-2">{selectedTerritory.name}</h3>
                    <p className="text-sm">Bonus: {selectedTerritory.bonus}</p>
                    <p className="text-sm">Debuff: {selectedTerritory.debuff}</p>
                    <button
                        onClick={() => setSelectedTerritory(null)}
                        className="w-full py-2 mt-3 text-sm font-medium bg-[#8B7355] rounded-lg hover:bg-[#A08765]"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};
