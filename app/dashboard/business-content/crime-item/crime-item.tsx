"use client";

import { useState } from "react";
import { Clock, DollarSign, ShieldAlert, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { useTimer, useGameState } from "@/app/lib/hooks";
import { Crime } from "@/app/lib/types";

type CrimeStatus = 'idle' | 'running' | 'success' | 'failed';

export const CrimeItem = ({ crime }: { crime: Crime }) => {
    const { addKontanter, addRespekt, addPolisbevakning, addExperience } = useGameState();
    const [status, setStatus] = useState<CrimeStatus>('idle');
    const [earnedReward, setEarnedReward] = useState(0);

    const { timeLeft, isRunning, start } = useTimer({
        onComplete: () => {
            // Calculate success based on risk level
            const successRates = {
                'Low': 0.90,
                'Medium': 0.70,
                'High': 0.50,
                'Very High': 0.30,
            };
            const successRate = successRates[crime.risk];
            const success = Math.random() < successRate;

            if (success) {
                // Award rewards
                addKontanter(crime.reward);
                const respectGain = Math.floor(crime.reward / 100);
                addRespekt(respectGain);

                // Calculate heat gain based on risk
                const heatGain = crime.risk === 'Low' ? 2 :
                                crime.risk === 'Medium' ? 5 :
                                crime.risk === 'High' ? 10 : 15;
                addPolisbevakning(heatGain);

                // Award XP
                const xpGain = Math.floor(crime.duration / 10);
                addExperience(xpGain);

                setEarnedReward(crime.reward);
                setStatus('success');
            } else {
                // Failed - still gain heat but no reward
                const heatGain = crime.risk === 'Low' ? 5 :
                                crime.risk === 'Medium' ? 10 :
                                crime.risk === 'High' ? 15 : 20;
                addPolisbevakning(heatGain);
                setStatus('failed');
            }

            // Reset status after 3 seconds
            setTimeout(() => {
                setStatus('idle');
                setEarnedReward(0);
            }, 3000);
        },
    });

    const startCrime = () => {
        setStatus('running');
        start(crime.duration);
    };

    const getRiskColor = () => {
        switch (crime.risk) {
            case 'Low': return 'text-nordic-status-success';
            case 'Medium': return 'text-nordic-status-warning';
            case 'High': return 'text-orange-400';
            case 'Very High': return 'text-nordic-status-danger';
            default: return 'text-nordic-text-secondary';
        }
    };

    return (
        <div className={`bg-nordic-bg-dark p-6 rounded-lg border-2 transition-all ${
            status === 'success' ? 'border-nordic-status-success animate-pulse' :
            status === 'failed' ? 'border-nordic-status-danger animate-pulse' :
            isRunning ? 'border-nordic-accent' :
            'border-nordic-border hover:border-nordic-border-light'
        }`}>
            <h3 className="text-nordic-text-primary text-lg font-medium mb-3">{crime.name}</h3>

            <div className="space-y-2 mb-4">
                <div className="text-nordic-text-secondary text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{crime.duration}s duration</span>
                </div>
                <div className="text-nordic-text-secondary text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>{crime.reward.toLocaleString()} SEK</span>
                </div>
                <div className={`text-sm flex items-center gap-2 ${getRiskColor()}`}>
                    <ShieldAlert className="h-4 w-4" />
                    <span>{crime.risk} Risk</span>
                </div>
            </div>

            {status === 'success' && (
                <div className="mb-3 p-3 bg-nordic-status-success/20 border border-nordic-status-success rounded-lg flex items-center gap-2 text-nordic-status-success text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Success! +{earnedReward.toLocaleString()} SEK</span>
                </div>
            )}

            {status === 'failed' && (
                <div className="mb-3 p-3 bg-nordic-status-danger/20 border border-nordic-status-danger rounded-lg flex items-center gap-2 text-nordic-status-danger text-sm">
                    <XCircle className="h-4 w-4" />
                    <span>Failed! Heat increased</span>
                </div>
            )}

            <button
                onClick={startCrime}
                disabled={isRunning || status !== 'idle'}
                className={`w-full py-2 text-sm font-medium rounded-lg transition-all ${
                    isRunning ? 'bg-nordic-accent text-white' :
                    status === 'success' ? 'bg-nordic-status-success text-white' :
                    status === 'failed' ? 'bg-nordic-status-danger text-white' :
                    'bg-nordic-accent hover:bg-nordic-accent-muted text-white disabled:opacity-50'
                }`}
            >
                {isRunning ? `In Progress (${timeLeft}s)` :
                 status === 'success' ? 'Success!' :
                 status === 'failed' ? 'Failed!' :
                 'Start Crime'}
            </button>
        </div>
    );
};
