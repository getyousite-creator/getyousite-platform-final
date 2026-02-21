/**
 * Command Center Dashboard - Real-time Analytics
 * 
 * Metrics:
 * - North Star: Sites Published
 * - Magic Moment: Prompt → Preview time
 * - Efficiency Ratio: AI vs Manual edits
 * - Live user activity
 */

"use client";

import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface DashboardMetrics {
    northStar: {
        sitesPublished: number;
        change24h: number;
    };
    magicMoment: {
        avgTimeToPreview: number; // seconds
        target: number;
        status: 'excellent' | 'good' | 'warning' | 'critical';
    };
    efficiencyRatio: {
        aiEdits: number;
        manualEdits: number;
        ratio: number;
    };
    activeUsers: {
        current: number;
        peak24h: number;
    };
    conversionFunnel: Array<{
        step: string;
        users: number;
        rate: number;
    }>;
    retentionMetrics: {
        day1: number;
        day7: number;
        day30: number;
    };
}

// ============================================================================
// COMMAND CENTER DASHBOARD
// ============================================================================

export function CommandCenterDashboard() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds

    useEffect(() => {
        fetchMetrics();
        
        const interval = setInterval(fetchMetrics, refreshInterval);
        return () => clearInterval(interval);
    }, []);

    const fetchMetrics = async () => {
        try {
            const response = await fetch('/api/analytics/dashboard');
            const data = await response.json();
            setMetrics(data);
            setLoading(false);
        } catch (error) {
            console.error('[Dashboard] Failed to fetch metrics:', error);
        }
    };

    if (loading || !metrics) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Command Center</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-muted-foreground">Live</span>
                    </div>
                    <button
                        onClick={fetchMetrics}
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* North Star Metric */}
            <Card>
                <CardHeader>
                    <CardTitle>North Star Metric: Sites Published</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-5xl font-bold">
                        {metrics.northStar.sitesPublished}
                    </div>
                    <div className={`text-sm mt-2 ${
                        metrics.northStar.change24h >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                    }`}>
                        {metrics.northStar.change24h >= 0 ? '+' : ''}
                        {metrics.northStar.change24h}% from last 24h
                    </div>
                </CardContent>
            </Card>

            {/* Magic Moment */}
            <Card>
                <CardHeader>
                    <CardTitle>Magic Moment: Prompt → Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-5xl font-bold">
                        {metrics.magicMoment.avgTimeToPreview.toFixed(1)}s
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={metrics.magicMoment.status} />
                        <span className="text-sm text-muted-foreground">
                            Target: &lt;{metrics.magicMoment.target}s
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Efficiency Ratio */}
            <Card>
                <CardHeader>
                    <CardTitle>Efficiency Ratio: AI vs Manual</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'AI Edits', value: metrics.efficiencyRatio.aiEdits },
                                        { name: 'Manual Edits', value: metrics.efficiencyRatio.manualEdits },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, percent }) => 
                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    <Cell fill="#10b981" />
                                    <Cell fill="#6b7280" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center text-sm text-muted-foreground mt-2">
                        AI Ratio: {metrics.efficiencyRatio.ratio.toFixed(2)}x
                    </div>
                </CardContent>
            </Card>

            {/* Active Users */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-muted-foreground">Current</div>
                            <div className="text-3xl font-bold">
                                {metrics.activeUsers.current}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Peak (24h)</div>
                            <div className="text-3xl font-bold">
                                {metrics.activeUsers.peak24h}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card>
                <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.conversionFunnel}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="step" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="users" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Retention Metrics */}
            <Card>
                <CardHeader>
                    <CardTitle>Retention Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground">Day 1</div>
                            <div className="text-3xl font-bold text-green-600">
                                {metrics.retentionMetrics.day1.toFixed(1)}%
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground">Day 7</div>
                            <div className="text-3xl font-bold text-yellow-600">
                                {metrics.retentionMetrics.day7.toFixed(1)}%
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground">Day 30</div>
                            <div className="text-3xl font-bold text-blue-600">
                                {metrics.retentionMetrics.day30.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function DashboardSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="h-10 bg-muted rounded-md w-48" />
            {[...Array(6)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <div className="h-6 bg-muted rounded-md w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-20 bg-muted rounded-md" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors = {
        excellent: 'bg-green-500',
        good: 'bg-blue-500',
        warning: 'bg-yellow-500',
        critical: 'bg-red-500',
    };
    
    return (
        <div className={`px-2 py-1 rounded text-xs text-white ${colors[status as keyof typeof colors]}`}>
            {status.toUpperCase()}
        </div>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    CommandCenterDashboard,
};
