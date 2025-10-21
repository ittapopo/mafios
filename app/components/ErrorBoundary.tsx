"use client";

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary Component
 *
 * Wrap components with this to catch and handle errors gracefully.
 *
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console (in production, send to error tracking service)
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen bg-mafia-bg flex items-center justify-center p-6">
                    <div className="bg-mafia-bg-dark p-8 rounded-lg border-2 border-mafia-status-danger max-w-lg w-full">
                        <h2 className="text-mafia-text-primary text-2xl font-bold mb-4">
                            Something went wrong
                        </h2>
                        <p className="text-mafia-text-secondary mb-6">
                            An unexpected error occurred. Please refresh the page to continue.
                        </p>
                        {this.state.error && (
                            <details className="mb-6">
                                <summary className="text-mafia-text-muted cursor-pointer hover:text-mafia-text-secondary">
                                    Error details
                                </summary>
                                <pre className="mt-2 text-xs text-mafia-status-danger overflow-auto p-4 bg-mafia-bg rounded">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 px-6 bg-mafia-accent text-mafia-text-primary rounded-lg hover:bg-mafia-accent-dark transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
