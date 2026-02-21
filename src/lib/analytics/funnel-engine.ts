/**
 * Advanced Funnel & Retention Engine
 * 
 * Features:
 * - Conversion Funnel tracking (Prompt → Preview → Publish)
 * - Friction Point detection (>30s without action)
 * - Retention analysis
 * - Cohort analysis
 */

import { PrismaClient } from '@prisma/client';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FunnelStep {
    step: number;
    name: string;
    users: number;
    conversionRate: number;
    avgTimeToComplete: number;
    dropOffRate: number;
}

export interface FrictionPoint {
    sessionId: string;
    step: string;
    timeSpent: number;
    actionCount: number;
    flagged: boolean;
    reason: string;
}

export interface RetentionMetrics {
    day1: number;
    day7: number;
    day30: number;
    cohort: string;
}

export interface UserJourney {
    userId: string;
    sessionId: string;
    steps: Array<{
        step: string;
        timestamp: Date;
        duration: number;
        actions: number;
    }>;
    completed: boolean;
    totalTime: number;
}

// ============================================================================
// FUNNEL ENGINE
// ============================================================================

export class FunnelEngine {
    private prisma: PrismaClient;
    
    // Funnel definition
    private funnelSteps = [
        'site_generation_started',
        'first_preview_generated',
        'edit_mode_entered',
        'content_modified',
        'preview_refreshed',
        'publish_clicked',
        'site_published',
    ];

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    /**
     * Calculate conversion funnel
     */
    async calculateFunnel(startDate: Date, endDate: Date): Promise<FunnelStep[]> {
        const steps: FunnelStep[] = [];
        
        for (let i = 0; i < this.funnelSteps.length; i++) {
            const stepName = this.funnelSteps[i];
            
            // Count users who completed this step
            const stepCount = await this.prisma.analyticsEvent.groupBy({
                by: ['sessionId'],
                where: {
                    eventType: stepName,
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                _count: true,
            });
            
            const users = stepCount.length;
            const totalUsers = i === 0 ? users : steps[i - 1].users;
            const conversionRate = totalUsers > 0 ? (users / totalUsers) * 100 : 0;
            
            // Calculate average time to complete
            const avgTime = await this.calculateAvgTimeToStep(stepName, startDate, endDate);
            
            // Calculate drop-off rate
            const prevUsers = i === 0 ? 0 : steps[i - 1].users;
            const dropOffRate = prevUsers > 0 ? ((prevUsers - users) / prevUsers) * 100 : 0;
            
            steps.push({
                step: i + 1,
                name: this.formatStepName(stepName),
                users,
                conversionRate,
                avgTimeToComplete: avgTime,
                dropOffRate,
            });
        }
        
        return steps;
    }

    /**
     * Calculate average time to complete a step
     */
    private async calculateAvgTimeToStep(
        stepName: string,
        startDate: Date,
        endDate: Date
    ): Promise<number> {
        const events = await this.prisma.analyticsEvent.findMany({
            where: {
                eventType: stepName,
                createdAt: { gte: startDate, lte: endDate },
            },
            orderBy: { createdAt: 'asc' },
            select: {
                sessionId: true,
                createdAt: true,
            },
        });
        
        if (events.length === 0) return 0;
        
        // Calculate time from session start to this step
        const times = await Promise.all(
            events.map(async (event) => {
                const sessionStart = await this.prisma.analyticsEvent.findFirst({
                    where: {
                        sessionId: event.sessionId,
                        eventType: 'session_started',
                    },
                    orderBy: { createdAt: 'asc' },
                });
                
                if (!sessionStart) return 0;
                return event.createdAt.getTime() - sessionStart.createdAt.getTime();
            })
        );
        
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        return avgTime / 1000; // Convert to seconds
    }

    /**
     * Detect friction points
     */
    async detectFrictionPoints(thresholdSeconds: number = 30): Promise<FrictionPoint[]> {
        // Find sessions where user spent >30s on a step without action
        const frictionSessions = await this.prisma.$queryRaw<FrictionPoint[]>`
            WITH step_durations AS (
                SELECT 
                    session_id,
                    event_type,
                    EXTRACT(EPOCH FROM (
                        LEAD(created_at) OVER (PARTITION BY session_id ORDER BY created_at) 
                        - created_at
                    )) as duration_seconds,
                    COUNT(*) OVER (PARTITION BY session_id, event_type) as action_count
                FROM "AnalyticsEvent"
                WHERE created_at >= NOW() - INTERVAL '7 days'
            )
            SELECT 
                session_id as "sessionId",
                event_type as "step",
                duration_seconds as "timeSpent",
                action_count as "actionCount",
                (duration_seconds > ${thresholdSeconds}) as "flagged",
                CASE 
                    WHEN duration_seconds > ${thresholdSeconds} THEN 'User stuck for >30s without action'
                    ELSE 'Normal'
                END as "reason"
            FROM step_durations
            WHERE duration_seconds > ${thresholdSeconds}
            ORDER BY duration_seconds DESC
            LIMIT 1000
        `;
        
        return frictionSessions;
    }

    /**
     * Get user journey
     */
    async getUserJourney(sessionId: string): Promise<UserJourney | null> {
        const events = await this.prisma.analyticsEvent.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
        });
        
        if (events.length === 0) return null;
        
        const userId = events[0].userId || 'anonymous';
        const steps = [];
        
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const nextEvent = events[i + 1];
            const duration = nextEvent 
                ? nextEvent.createdAt.getTime() - event.createdAt.getTime()
                : 0;
            
            steps.push({
                step: event.eventType,
                timestamp: event.createdAt,
                duration: duration / 1000, // seconds
                actions: 1,
            });
        }
        
        const totalTime = steps.reduce((a, b) => a + b.duration, 0);
        const completed = events.some(e => e.eventType === 'site_published');
        
        return {
            userId,
            sessionId,
            steps,
            completed,
            totalTime,
        };
    }

    /**
     * Format step name
     */
    private formatStepName(stepName: string): string {
        return stepName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}

// ============================================================================
// RETENTION ENGINE
// ============================================================================

export class RetentionEngine {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    /**
     * Calculate retention metrics
     */
    async calculateRetention(cohort: string = 'all'): Promise<RetentionMetrics> {
        const cohortFilter = cohort === 'all' ? {} : { 
            userMetadata: { path: ['cohort'], equals: cohort }
        };
        
        // Get users who signed up 30+ days ago
        const cohortUsers = await this.prisma.user.findMany({
            where: {
                createdAt: { lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
                ...cohortFilter,
            },
            select: { id: true, createdAt: true },
        });
        
        if (cohortUsers.length === 0) {
            return { day1: 0, day7: 0, day30: 0, cohort };
        }
        
        const totalUsers = cohortUsers.length;
        
        // Calculate day 1 retention
        const day1Active = await this.countActiveUsers(
            cohortUsers.map(u => u.id),
            1
        );
        
        // Calculate day 7 retention
        const day7Active = await this.countActiveUsers(
            cohortUsers.map(u => u.id),
            7
        );
        
        // Calculate day 30 retention
        const day30Active = await this.countActiveUsers(
            cohortUsers.map(u => u.id),
            30
        );
        
        return {
            day1: (day1Active / totalUsers) * 100,
            day7: (day7Active / totalUsers) * 100,
            day30: (day30Active / totalUsers) * 100,
            cohort,
        };
    }

    /**
     * Count active users after N days
     */
    private async countActiveUsers(userIds: string[], days: number): Promise<number> {
        const activeUsers = await this.prisma.analyticsEvent.findMany({
            where: {
                userId: { in: userIds },
                createdAt: {
                    gte: new Date(Date.now() - (days + 1) * 24 * 60 * 60 * 1000),
                    lte: new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000),
                },
            },
            distinct: ['userId'],
        });
        
        return activeUsers.length;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    FunnelEngine,
    RetentionEngine,
};
