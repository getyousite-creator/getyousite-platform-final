"use client";

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

/**
 * Global Error Boundary
 * 
 * Catches React errors in the component tree and displays a user-friendly
 * fallback UI instead of a white screen.
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // In production, you would send this to an error tracking service
        // Example: Sentry.captureException(error, { extra: errorInfo });

        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback from props
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen bg-black flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full bg-zinc-900 rounded-2xl border border-red-500/20 p-12 space-y-8">
                        {/* Error Icon */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white tracking-tight">
                                    Something Went Wrong
                                </h1>
                                <p className="text-zinc-400 text-sm mt-1">
                                    An unexpected error occurred in the application
                                </p>
                            </div>
                        </div>

                        {/* Error Details (Development Only) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="bg-black/50 rounded-lg p-6 border border-zinc-800">
                                <p className="text-red-400 font-mono text-xs mb-2">
                                    Error Message:
                                </p>
                                <p className="text-zinc-300 font-mono text-sm break-all">
                                    {this.state.error.message}
                                </p>

                                {this.state.error.stack && (
                                    <>
                                        <p className="text-red-400 font-mono text-xs mt-4 mb-2">
                                            Stack Trace:
                                        </p>
                                        <pre className="text-zinc-400 font-mono text-xs overflow-x-auto">
                                            {this.state.error.stack}
                                        </pre>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors"
                            >
                                Go Home
                            </button>
                        </div>

                        {/* Production Message */}
                        {process.env.NODE_ENV === 'production' && (
                            <p className="text-zinc-500 text-xs">
                                Error ID: {Date.now().toString(36)}
                                <br />
                                If this problem persists, please contact support with this error ID.
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Functional wrapper for easier usage
 */
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    fallback?: React.ReactNode
) {
    return function WithErrorBoundaryWrapper(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
}
