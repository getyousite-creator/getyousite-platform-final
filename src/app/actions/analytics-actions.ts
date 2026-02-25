'use server';

import { PrismaClient } from '@prisma/client';
import { ActionResult } from './auth-actions';

const prisma = new PrismaClient();

/**
 * SOVEREIGN VISIT PROTOCOL
 * Logic: Logs the initial contact point of a visitor.
 */
export async function trackVisitAction(siteId: string, path: string, referrer?: string): Promise<ActionResult> {
    try {
        await prisma.analytics.create({
            data: {
                siteId,
                eventType: 'VISIT_INITIALIZED',
                path,
                referrer,
                eventData: { timestamp: new Date().toISOString() }
            }
        });
        return { success: true };
    } catch (error) {
        console.error("[DIP] Visit Tracking Error:", error);
        return { success: false, error: "Visit registration failed" };
    }
}

/**
 * SOVEREIGN HEARTBEAT PROTOCOL
 * Logic: Confirms user presence and calculates precise engagement duration.
 */
export async function trackHeartbeatAction(siteId: string): Promise<ActionResult> {
    try {
        await prisma.analytics.create({
            data: {
                siteId,
                eventType: 'HEARTBEAT_PULSE',
                eventData: { timestamp: new Date().toISOString() }
            }
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: "Pulse failure" };
    }
}

/**
 * SOVEREIGN EVENT PROTOCOL
 * Logic: Captures discrete interactions (Clicks, Resonance, Logic Interaction).
 */
export async function trackEventAction(siteId: string, path: string, eventType: string, metadata: any = {}): Promise<ActionResult> {
    try {
        await prisma.analytics.create({
            data: {
                siteId,
                path,
                eventType,
                eventData: metadata
            }
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: "Event propagation failed" };
    }
}

/**
 * STRATEGIC ANALYTICS AGGREGATOR (Visionary Engine)
 * Logic: Synthesizes high-status insights from raw data streams.
 */
export async function getAnalyticsSummaryAction(siteId: string): Promise<ActionResult<any>> {
    try {
        // 1. RAW DATA RETRIEVAL
        const events = await prisma.analytics.findMany({
            where: { siteId },
            orderBy: { createdAt: 'desc' },
            take: 1000 // Last 1000 events for real-time synthesis
        });

        // 2. FUNNEL SYNTHESIS
        const totalVisits = events.filter(e => e.eventType === 'VISIT_INITIALIZED').length;
        const totalResonance = events.filter(e => e.eventType === 'section_resonance').length;
        const totalInteractions = events.filter(e => e.eventType === 'logic_interaction').length;

        // 3. PERFORMANCE RATIOS
        const conversionRate = totalVisits > 0 ? (totalInteractions / totalVisits) * 100 : 0;
        const bounceRate = totalVisits > 0 ? (events.filter(e => e.eventType === 'session_end' && (e.eventData as any)?.duration < 5).length / totalVisits) * 100 : 0;

        // 4. STRATEGIC INSIGHTS (Pattern Recognition Logic)
        const insights = [];

        if (conversionRate > 5) {
            insights.push({ id: 'acc_01', type: 'positive', text: `Strong Architectural Traction: ${conversionRate.toFixed(1)}% of visitors are engaging with CTA logic.` });
        } else {
            insights.push({ id: 'acc_02', type: 'warning', text: "Conversion Friction Detected: User intent is stalling before the final synthesis directive." });
        }

        if (bounceRate < 20) {
            insights.push({ id: 'res_01', type: 'positive', text: "High Resonance Depth: Users are spending clinical time analyzing the content nodes." });
        }

        return {
            success: true,
            data: {
                totalViews: totalVisits,
                totalInteractions,
                totalResonance,
                conversionRate,
                bounceRate,
                insights
            }
        };
    } catch (error) {
        console.error("[DIP] Analytics Synthesis Error:", error);
        return { success: false, error: "Strategic synthesis failed" };
    }
}
