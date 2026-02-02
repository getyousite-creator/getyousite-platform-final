"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

/**
 * SOVEREIGN ANALYTICS PROVIDER
 * Logic: Critical monitoring for Core Web Vitals and User Engagement.
 * Required for Phase 3.3 Performance Audit constraint.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            {/* Speed Insights: Real-world performance monitoring */}
            <SpeedInsights />
            {/* Analytics: Basic traffic and engagement tracking */}
            <Analytics />
        </>
    );
}
