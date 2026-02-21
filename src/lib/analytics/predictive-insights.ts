/**
 * Predictive AI Insights + Privacy Manager
 * 
 * Features:
 * - Churn Prediction with Gemini AI
> - Automated Retention System
> - GDPR Compliance
> - Consent Manager
> - Data Scrubbing
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ChurnPrediction {
    userId: string;
    churnProbability: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    recommendedAction: string;
    timestamp: Date;
}

export interface RetentionAction {
    type: 'smart_tip' | 'discount' | 'feature_highlight' | 'support_offer';
    trigger: string;
    content: string;
    deliveredAt: Date;
}

export interface ConsentStatus {
    userId: string;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
    updatedAt: Date;
}

// ============================================================================
// CHURN PREDICTION ENGINE
// ============================================================================

export class ChurnPredictionEngine {
    private prisma: PrismaClient;
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-3-flash' });
    }

    /**
     * Predict churn for user
     */
    async predictChurn(userId: string): Promise<ChurnPrediction> {
        // Get user behavior data
        const userData = await this.getUserBehaviorData(userId);
        
        // Generate prediction with AI
        const prediction = await this.generateAIPrediction(userData);
        
        // Save prediction
        await this.savePrediction(userId, prediction);
        
        // Trigger retention action if high risk
        if (prediction.riskLevel === 'high' || prediction.riskLevel === 'critical') {
            await this.triggerRetentionAction(userId, prediction);
        }
        
        return prediction;
    }

    /**
     * Get user behavior data
     */
    private async getUserBehaviorData(userId: string): Promise<any> {
        const [user, recentEvents, sites] = await Promise.all([
            this.prisma.user.findUnique({
                where: { id: userId },
                include: { subscriptions: true },
            }),
            this.prisma.analyticsEvent.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 100,
            }),
            this.prisma.site.findMany({
                where: { userId },
                include: { deployments: true },
            }),
        ]);
        
        // Calculate behavioral metrics
        const lastActiveAt = recentEvents[0]?.createdAt || user?.createdAt;
        const daysSinceActive = Math.floor(
            (Date.now() - lastActiveAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        const sitesPublished = sites.filter(s => s.isPublished).length;
        const totalDeployments = sites.reduce((acc, site) => acc + site.deployments.length, 0);
        
        const sessionCount = recentEvents.filter(e => e.eventType === 'session_started').length;
        const avgSessionDuration = this.calculateAvgSessionDuration(recentEvents);
        
        const errorCount = recentEvents.filter(e => e.eventType.includes('error')).length;
        
        return {
            userId,
            daysSinceActive,
            sitesPublished,
            totalDeployments,
            sessionCount,
            avgSessionDuration,
            errorCount,
            subscriptionPlan: user?.subscriptions?.[0]?.plan || 'FREE',
            accountAge: Math.floor(
                (Date.now() - user!.createdAt.getTime()) / (1000 * 60 * 60 * 24)
            ),
        };
    }

    /**
     * Calculate average session duration
     */
    private calculateAvgSessionDuration(events: any[]): number {
        const sessions = events.filter(e => e.eventType === 'session_started');
        if (sessions.length === 0) return 0;
        
        let totalDuration = 0;
        for (const session of sessions) {
            const sessionEnd = events.find(
                e => e.sessionId === session.sessionId && e.eventType === 'session_ended'
            );
            if (sessionEnd) {
                totalDuration += sessionEnd.createdAt.getTime() - session.createdAt.getTime();
            }
        }
        
        return totalDuration / sessions.length / 1000 / 60; // minutes
    }

    /**
     * Generate AI prediction
     */
    private async generateAIPrediction(userData: any): Promise<ChurnPrediction> {
        const prompt = `
Analyze this user behavior data and predict churn probability:

User Data:
- Days since active: ${userData.daysSinceActive}
- Sites published: ${userData.sitesPublished}
- Total deployments: ${userData.totalDeployments}
- Session count (7 days): ${userData.sessionCount}
- Avg session duration: ${userData.avgSessionDuration.toFixed(1)} minutes
- Error count (7 days): ${userData.errorCount}
- Subscription plan: ${userData.subscriptionPlan}
- Account age: ${userData.accountAge} days

Based on this data:
1. Predict churn probability (0-100%)
2. Identify risk factors
3. Recommend retention action
4. Assign risk level (low/medium/high/critical)

Output JSON:
{
  "churnProbability": number,
  "riskLevel": "low|medium|high|critical",
  "factors": ["factor1", "factor2"],
  "recommendedAction": "action description"
}
`.trim();

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const prediction = JSON.parse(response.text());
        
        return {
            userId: userData.userId,
            churnProbability: prediction.churnProbability,
            riskLevel: prediction.riskLevel,
            factors: prediction.factors,
            recommendedAction: prediction.recommendedAction,
            timestamp: new Date(),
        };
    }

    /**
     * Save prediction to database
     */
    private async savePrediction(userId: string, prediction: ChurnPrediction): Promise<void> {
        await this.prisma.churnPrediction.create({
            data: {
                userId,
                churnProbability: prediction.churnProbability,
                riskLevel: prediction.riskLevel,
                factors: prediction.factors,
                recommendedAction: prediction.recommendedAction,
            },
        });
    }

    /**
     * Trigger retention action
     */
    private async triggerRetentionAction(
        userId: string,
        prediction: ChurnPrediction
    ): Promise<void> {
        let action: RetentionAction;
        
        if (prediction.churnProbability > 80) {
            // Critical: Offer discount
            action = {
                type: 'discount',
                trigger: 'high_churn_risk',
                content: 'Special 50% off offer for 3 months',
                deliveredAt: new Date(),
            };
        } else if (prediction.factors.includes('stuck_in_editor')) {
            // Offer smart tip
            action = {
                type: 'smart_tip',
                trigger: 'editor_friction',
                content: 'Tip: Use AI commands to speed up editing',
                deliveredAt: new Date(),
            };
        } else {
            // Offer support
            action = {
                type: 'support_offer',
                trigger: 'general_churn_risk',
                content: 'Need help? Chat with our team now',
                deliveredAt: new Date(),
            };
        }
        
        // Save action
        await this.prisma.retentionAction.create({
            data: {
                userId,
                ...action,
            },
        });
        
        // Deliver action (via email, in-app notification, etc.)
        await this.deliverRetentionAction(userId, action);
    }

    /**
     * Deliver retention action
     */
    private async deliverRetentionAction(
        userId: string,
        action: RetentionAction
    ): Promise<void> {
        // Implementation depends on delivery channel
        console.log(`[Retention] Delivering ${action.type} to user ${userId}`);
    }
}

// ============================================================================
// CONSENT MANAGER (GDPR)
// ============================================================================

export class ConsentManager {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    /**
     * Get user consent status
     */
    async getConsent(userId: string): Promise<ConsentStatus> {
        const consent = await this.prisma.consent.findUnique({
            where: { userId },
        });
        
        if (!consent) {
            // Default: only functional cookies
            return {
                userId,
                analytics: false,
                marketing: false,
                functional: true,
                updatedAt: new Date(),
            };
        }
        
        return {
            userId,
            analytics: consent.analyticsConsent,
            marketing: consent.marketingConsent,
            functional: true, // Always allowed
            updatedAt: consent.updatedAt,
        };
    }

    /**
     * Update consent
     */
    async updateConsent(
        userId: string,
        updates: Partial<ConsentStatus>
    ): Promise<ConsentStatus> {
        const consent = await this.prisma.consent.upsert({
            where: { userId },
            create: {
                userId,
                analyticsConsent: updates.analytics ?? false,
                marketingConsent: updates.marketing ?? false,
            },
            update: {
                analyticsConsent: updates.analytics,
                marketingConsent: updates.marketing,
            },
        });
        
        return {
            userId,
            analytics: consent.analyticsConsent,
            marketing: consent.marketingConsent,
            functional: true,
            updatedAt: consent.updatedAt,
        };
    }

    /**
     * Check if tracking is allowed
     */
    async canTrack(userId: string, eventType: string): Promise<boolean> {
        const consent = await this.getConsent(userId);
        
        // Functional events always allowed
        if (eventType.startsWith('functional')) return true;
        
        // Analytics events require analytics consent
        if (eventType.startsWith('analytics')) return consent.analytics;
        
        // Marketing events require marketing consent
        if (eventType.startsWith('marketing')) return consent.marketing;
        
        // Default: allow
        return true;
    }

    /**
     * Delete user data (GDPR Right to be Forgotten)
     */
    async deleteUser(userId: string): Promise<void> {
        // Delete consent
        await this.prisma.consent.delete({
            where: { userId },
        }).catch(() => {});
        
        // Anonymize analytics
        await this.prisma.analyticsEvent.updateMany({
            where: { userId },
            data: {
                userId: 'deleted_user',
                eventData: { scrubbed: true },
            },
        });
        
        // Anonymize user
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                email: `deleted_${userId}@deleted.com`,
                name: 'Deleted User',
                deletedAt: new Date(),
            },
        });
    }

    /**
     * Export user data (GDPR Data Portability)
     */
    async exportUserData(userId: string): Promise<any> {
        const [user, sites, events] = await Promise.all([
            this.prisma.user.findUnique({
                where: { userId },
                include: { subscriptions: true },
            }),
            this.prisma.site.findMany({
                where: { userId },
                include: { deployments: true },
            }),
            this.prisma.analyticsEvent.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        
        return {
            user,
            sites,
            analyticsEvents: events,
            exportedAt: new Date().toISOString(),
        };
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    ChurnPredictionEngine,
    ConsentManager,
};
