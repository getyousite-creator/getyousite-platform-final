/**
 * AI-Driven Insights - Smart Statistics Cards
 * 
 * Not just numbers - intelligent interpretations powered by Gemini
 * Example: "Traffic up 10% → Suggest improving CTA on product page"
 */

"use client";

import React from "react";
import { LineChart, Line, AreaChart, Area, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface InsightCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        direction: "up" | "down" | "neutral";
    };
    chartData?: Array<{ date: string; value: number }>;
    aiInsight?: string;
    loading?: boolean;
}

export interface AIInsight {
    metric: string;
    insight: string;
    recommendation: string;
    confidence: number;
}

// ============================================================================
// INSIGHT CARD COMPONENT
// ============================================================================

export const AIInsightCard: React.FC<InsightCardProps> = ({
    title,
    value,
    change,
    chartData,
    aiInsight,
    loading = false,
}) => {
    if (loading) {
        return <LoadingCard />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-[12px] p-6 hover:bg-white/[0.07] transition-colors"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-neutral-slate">{title}</h3>
                {change && (
                    <div
                        className={`flex items-center gap-1 text-sm ${
                            change.direction === "up"
                                ? "text-success"
                                : change.direction === "down"
                                ? "text-error"
                                : "text-neutral-slate"
                        }`}
                    >
                        {change.direction === "up" && <TrendingUpIcon />}
                        {change.direction === "down" && <TrendingDownIcon />}
                        <span>{Math.abs(change.value)}%</span>
                    </div>
                )}
            </div>

            {/* Value */}
            <div className="text-3xl font-bold text-white mb-4">{value}</div>

            {/* Mini Chart */}
            {chartData && chartData.length > 0 && (
                <div className="h-16 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="0%"
                                        stopColor="#059669"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#059669"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#059669"
                                fill="url(#gradient)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* AI Insight */}
            {aiInsight && (
                <div className="bg-primary/10 border border-primary/20 rounded-[8px] p-3">
                    <div className="flex items-start gap-2">
                        <AIIcon />
                        <p className="text-xs text-neutral-slate leading-relaxed">
                            {aiInsight}
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// ============================================================================
// LOADING STATE
// ============================================================================

function LoadingCard() {
    return (
        <div className="bg-white/5 border border-white/10 rounded-[12px] p-6 animate-pulse">
            <div className="h-4 bg-neutral-slate/20 rounded w-24 mb-4" />
            <div className="h-8 bg-neutral-slate/20 rounded w-32 mb-4" />
            <div className="h-16 bg-neutral-slate/20 rounded mb-4" />
            <div className="h-12 bg-neutral-slate/20 rounded" />
        </div>
    );
}

// ============================================================================
// ICONS
// ============================================================================

function TrendingUpIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    );
}

function TrendingDownIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
            <polyline points="17 18 23 18 23 12" />
        </svg>
    );
}

function AIIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="text-accent-neon flex-shrink-0">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1v-1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
            <circle cx="12" cy="13" r="3" />
        </svg>
    );
}

// ============================================================================
// INSIGHTS GENERATOR (Server-Side)
// ============================================================================

/**
 * Generate AI insights from metrics data
 * This would call Gemini API in production
 */
export async function generateAIInsights(metrics: {
    traffic: number;
    conversions: number;
    bounceRate: number;
    avgSessionDuration: number;
}): Promise<AIInsight[]> {
    // In production, this calls Gemini API
    // For now, return simulated insights

    const insights: AIInsight[] = [];

    if (metrics.traffic > 0) {
        insights.push({
            metric: "traffic",
            insight: `Traffic increased by ${metrics.traffic}% this week`,
            recommendation: "Consider optimizing CTA buttons on product pages to capitalize on increased traffic",
            confidence: 0.87,
        });
    }

    if (metrics.bounceRate > 50) {
        insights.push({
            metric: "bounceRate",
            insight: `Bounce rate is ${metrics.bounceRate}%, above industry average`,
            recommendation: "Improve page load speed and above-the-fold content engagement",
            confidence: 0.92,
        });
    }

    if (metrics.conversions < 2) {
        insights.push({
            metric: "conversions",
            insight: `Conversion rate at ${metrics.conversions}% - below target`,
            recommendation: "A/B test checkout flow and simplify form fields",
            confidence: 0.85,
        });
    }

    return insights;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    AIInsightCard,
    generateAIInsights,
};
