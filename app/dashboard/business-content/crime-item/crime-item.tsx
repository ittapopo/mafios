import { Clock, DollarSign, ShieldAlert } from "lucide-react";
import { useState } from "react";

export const CrimeItem = ({ crime }: { crime: { name: string; duration: number; reward: number; risk: string } }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const startCrime = () => {
        setIsRunning(true);
        setTimeLeft(crime.duration);
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="bg-[#1A150F] p-6 rounded-lg border-2 border-[#8B7355]/30 hover:border-[#8B7355] transition-colors">
            <h3 className="text-[#D4C5B2] text-lg font-medium mb-2">{crime.name}</h3>
            <div className="text-[#B8A99A] text-sm mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" /> {crime.duration}s
            </div>
            <div className="text-[#B8A99A] text-sm mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> ${crime.reward}
            </div>
            <div className="text-[#B8A99A] text-sm mb-3 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" /> {crime.risk} Risk
            </div>
            <button
                onClick={startCrime}
                disabled={isRunning}
                className="w-full py-2 mt-3 text-sm font-medium text-[#D4C5B2] bg-[#8B7355] rounded-lg disabled:opacity-50"
            >
                {isRunning ? `In Progress (${timeLeft}s)` : "Start Crime"}
            </button>
        </div>
    );
};
