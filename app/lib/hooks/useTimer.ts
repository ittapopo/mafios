/**
 * useTimer Hook
 *
 * Reusable timer logic with proper cleanup.
 * Extracted from CrimeItem component to promote reusability.
 */

import { useState, useEffect, useRef } from 'react';

interface UseTimerOptions {
    onComplete?: () => void;
}

interface UseTimerReturn {
    timeLeft: number;
    isRunning: boolean;
    start: (duration: number) => void;
    stop: () => void;
    reset: () => void;
}

/**
 * Custom hook for managing countdown timers
 *
 * @param options - Configuration options
 * @returns Timer state and control functions
 *
 * @example
 * const { timeLeft, isRunning, start } = useTimer({
 *   onComplete: () => console.log('Timer completed!')
 * });
 *
 * // Start a 60 second timer
 * start(60);
 */
export const useTimer = (options: UseTimerOptions = {}): UseTimerReturn => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { onComplete } = options;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Handle timer countdown
    useEffect(() => {
        if (!isRunning) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    setIsRunning(false);

                    // Call completion callback if provided
                    if (onComplete) {
                        onComplete();
                    }

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRunning, onComplete]);

    const start = (duration: number) => {
        // Clear any existing timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        setTimeLeft(duration);
        setIsRunning(true);
    };

    const stop = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIsRunning(false);
    };

    const reset = () => {
        stop();
        setTimeLeft(0);
    };

    return {
        timeLeft,
        isRunning,
        start,
        stop,
        reset,
    };
};
