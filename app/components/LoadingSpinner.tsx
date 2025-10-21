/**
 * Loading Spinner Component
 *
 * Reusable loading indicator for async operations
 */

import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
    fullScreen?: boolean;
}

/**
 * Loading Spinner Component
 *
 * @param size - Size of the spinner (sm, md, lg)
 * @param message - Optional loading message
 * @param fullScreen - Whether to display fullscreen
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    message,
    fullScreen = false,
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div
                className={`${sizeClasses[size]} border-4 border-mafia-border-light border-t-mafia-accent rounded-full animate-spin`}
            />
            {message && (
                <p className="text-mafia-text-secondary text-sm">{message}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen bg-mafia-bg flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return spinner;
};
