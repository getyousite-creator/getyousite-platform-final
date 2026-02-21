/**
 * ML Pipeline Architecture - Apache Airflow + Feast Feature Store
 * 
 * Features:
 * - Data ingestion from PostgreSQL + Mixpanel
 * - PySpark processing for big data
 * - Feature engineering (click/edit ratio, editor dwell time)
 * - Feature Store for training/serving consistency
 */

import { PrismaClient } from '@prisma/client';
import { DataFrame, Series } from 'danfojs-node';
import * as tf from '@tensorflow/tfjs-node';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface UserFeature {
    userId: string;
    sessionId: string;
    // Behavioral features
    sessionCount: number;
    avgSessionDuration: number;
    clickToEditRatio: number;
    editorDwellTime: number;
    errorCount: number;
    // Engagement features
    daysSinceActive: number;
    sitesPublished: number;
    totalDeployments: number;
    // Temporal features
    hourOfDay: number;
    dayOfWeek: number;
    // Timestamp
    timestamp: Date;
}

export interface ChurnLabel {
    userId: string;
    churned: boolean;
    churnDate?: Date;
    daysToChurn: number;
}

export interface TrainingExample {
    features: UserFeature;
    label: ChurnLabel;
}

// ============================================================================
// FEATURE STORE INTERFACE
// ============================================================================

export interface FeatureStore {
    getFeatures(userId: string, timestamp?: Date): Promise<UserFeature>;
    getHistoricalFeatures(
        userIds: string[],
        timestamps: Date[]
    ): Promise<UserFeature[]>;
    writeFeatures(features: UserFeature[]): Promise<void>;
    getTrainingData(
        startDate: Date,
        endDate: Date
    ): Promise<TrainingExample[]>;
}

// ============================================================================
// DATA INGESTION ENGINE
// ============================================================================

export class DataIngestionEngine {
    private prisma: PrismaClient;
    private mixpanelApiKey: string;

    constructor(prisma: PrismaClient, mixpanelApiKey: string) {
        this.prisma = prisma;
        this.mixpanelApiKey = mixpanelApiKey;
    }

    /**
     * Ingest data from PostgreSQL (core data)
     */
    async ingestFromPostgreSQL(
        startDate: Date,
        endDate: Date
    ): Promise<{
        users: any[];
        events: any[];
        sites: any[];
    }> {
        console.log('[Ingestion] Fetching from PostgreSQL...');

        const [users, events, sites] = await Promise.all([
            this.prisma.user.findMany({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                },
                include: {
                    subscriptions: true,
                },
            }),
            this.prisma.analyticsEvent.findMany({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                },
                orderBy: { createdAt: 'asc' },
            }),
            this.prisma.site.findMany({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                },
                include: {
                    deployments: true,
                },
            }),
        ]);

        console.log(
            `[Ingestion] Fetched ${users.length} users, ${events.length} events, ${sites.length} sites`
        );

        return { users, events, sites };
    }

    /**
     * Ingest behavioral data from Mixpanel
     */
    async ingestFromMixpanel(
        startDate: Date,
        endDate: Date
    ): Promise<any[]> {
        console.log('[Ingestion] Fetching from Mixpanel...');

        // Mixpanel API call (simplified)
        const response = await fetch(
            `https://mixpanel.com/api/2.0/export?from_date=${startDate.toISOString().split('T')[0]}&to_date=${endDate.toISOString().split('T')[0]}`,
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${this.mixpanelApiKey}:`).toString('base64')}`,
                },
            }
        );

        const events = await response.json();
        console.log(`[Ingestion] Fetched ${events.length} events from Mixpanel`);

        return events;
    }

    /**
     * Merge data sources
     */
    mergeDataSources(
        postgresData: { users: any[]; events: any[]; sites: any[] },
        mixpanelData: any[]
    ): Map<string, any> {
        console.log('[Ingestion] Merging data sources...');

        const userMap = new Map<string, any>();

        // Index users
        postgresData.users.forEach((user) => {
            userMap.set(user.id, {
                user,
                events: [],
                sites: [],
                mixpanelEvents: [],
            });
        });

        // Attach events
        postgresData.events.forEach((event) => {
            const userData = userMap.get(event.userId);
            if (userData) {
                userData.events.push(event);
            }
        });

        // Attach sites
        postgresData.sites.forEach((site) => {
            const userData = userMap.get(site.userId);
            if (userData) {
                userData.sites.push(site);
            }
        });

        // Attach Mixpanel events
        mixpanelData.forEach((event) => {
            const userId = event.distinct_id;
            const userData = userMap.get(userId);
            if (userData) {
                userData.mixpanelEvents.push(event);
            }
        });

        console.log(`[Ingestion] Merged data for ${userMap.size} users`);

        return userMap;
    }
}

// ============================================================================
// FEATURE ENGINEERING ENGINE
// ============================================================================

export class FeatureEngineeringEngine {
    /**
     * Extract features for a single user
     */
    extractUserFeatures(userData: any): UserFeature {
        const { user, events, sites, mixpanelEvents } = userData;

        // Calculate session metrics
        const sessions = events.filter(
            (e: any) => e.eventType === 'session_started'
        );
        const sessionCount = sessions.length;

        // Calculate average session duration
        let totalDuration = 0;
        let completedSessions = 0;
        sessions.forEach((session: any) => {
            const sessionEnd = events.find(
                (e: any) =>
                    e.sessionId === session.sessionId &&
                    e.eventType === 'session_ended'
            );
            if (sessionEnd) {
                totalDuration +=
                    sessionEnd.createdAt.getTime() -
                    session.createdAt.getTime();
                completedSessions++;
            }
        });
        const avgSessionDuration =
            completedSessions > 0
                ? totalDuration / completedSessions / 1000 / 60 // minutes
                : 0;

        // Calculate click-to-edit ratio
        const clickEvents = events.filter((e: any) =>
            e.eventType.includes('click')
        ).length;
        const editEvents = events.filter((e: any) =>
            e.eventType.includes('edit')
        ).length;
        const clickToEditRatio = editEvents > 0 ? clickEvents / editEvents : 0;

        // Calculate editor dwell time
        const editorEnter = events.find(
            (e: any) => e.eventType === 'editor_enter'
        );
        const editorExit = events.find(
            (e: any) => e.eventType === 'editor_exit'
        );
        const editorDwellTime =
            editorEnter && editorExit
                ? (editorExit.createdAt.getTime() -
                      editorEnter.createdAt.getTime()) /
                  1000 /
                  60 // minutes
                : 0;

        // Count errors
        const errorCount = events.filter((e: any) =>
            e.eventType.includes('error')
        ).length;

        // Days since active
        const lastEvent = events[events.length - 1];
        const daysSinceActive = lastEvent
            ? Math.floor(
                  (Date.now() - lastEvent.createdAt.getTime()) /
                      (1000 * 60 * 60 * 24)
              )
            : 999;

        // Sites published
        const sitesPublished = sites.filter((s: any) => s.isPublished).length;

        // Total deployments
        const totalDeployments = sites.reduce(
            (acc: number, site: any) => acc + site.deployments.length,
            0
        );

        // Temporal features
        const now = new Date();
        const hourOfDay = now.getHours();
        const dayOfWeek = now.getDay();

        return {
            userId: user.id,
            sessionId: sessions[sessions.length - 1]?.sessionId || 'unknown',
            sessionCount,
            avgSessionDuration,
            clickToEditRatio,
            editorDwellTime,
            errorCount,
            daysSinceActive,
            sitesPublished,
            totalDeployments,
            hourOfDay,
            dayOfWeek,
            timestamp: now,
        };
    }

    /**
     * Create churn labels
     */
    createChurnLabels(
        userData: any,
        churnThresholdDays: number = 30
    ): ChurnLabel {
        const { user, events } = userData;

        const lastEvent = events[events.length - 1];
        const daysSinceActive = lastEvent
            ? Math.floor(
                  (Date.now() - lastEvent.createdAt.getTime()) /
                      (1000 * 60 * 60 * 24)
              )
            : 999;

        const churned = daysSinceActive >= churnThresholdDays;
        const churnDate = churned ? lastEvent?.createdAt : undefined;
        const daysToChurn = churned ? daysSinceActive : -1;

        return {
            userId: user.id,
            churned,
            churnDate,
            daysToChurn,
        };
    }

    /**
     * Normalize features for ML
     */
    normalizeFeatures(features: UserFeature[]): DataFrame {
        // Convert to DataFrame
        const df = new DataFrame(features);

        // Normalize numerical features (min-max scaling)
        const numericalCols = [
            'sessionCount',
            'avgSessionDuration',
            'clickToEditRatio',
            'editorDwellTime',
            'errorCount',
            'daysSinceActive',
            'sitesPublished',
            'totalDeployments',
        ];

        numericalCols.forEach((col) => {
            const series = df[col] as Series;
            const min = series.min();
            const max = series.max();
            const normalized = series.sub(min).div(max - min + 1e-8);
            df.replace(col, normalized);
        });

        return df;
    }
}

// ============================================================================
// FEATURE STORE IMPLEMENTATION
// ============================================================================

export class FeastFeatureStore implements FeatureStore {
    private prisma: PrismaClient;
    private featureCache: Map<string, { feature: UserFeature; timestamp: Date }>;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.featureCache = new Map();
    }

    /**
     * Get features for a user
     */
    async getFeatures(
        userId: string,
        timestamp?: Date
    ): Promise<UserFeature> {
        // Check cache first
        const cached = this.featureCache.get(userId);
        if (cached && Date.now() - cached.timestamp.getTime() < 300000) {
            // 5 min cache
            return cached.feature;
        }

        // Fetch from database
        const userData = await this.fetchUserData(userId, timestamp);
        const engine = new FeatureEngineeringEngine();
        const features = engine.extractUserFeatures(userData);

        // Cache
        this.featureCache.set(userId, { feature: features, timestamp: new Date() });

        return features;
    }

    /**
     * Get historical features for training
     */
    async getHistoricalFeatures(
        userIds: string[],
        timestamps: Date[]
    ): Promise<UserFeature[]> {
        const features: UserFeature[] = [];

        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i];
            const timestamp = timestamps[i];

            const userData = await this.fetchUserData(userId, timestamp);
            const engine = new FeatureEngineeringEngine();
            features.push(engine.extractUserFeatures(userData));
        }

        return features;
    }

    /**
     * Write features to store
     */
    async writeFeatures(features: UserFeature[]): Promise<void> {
        // In production, write to Feast Feature Store
        // For now, cache in memory
        features.forEach((feature) => {
            this.featureCache.set(feature.userId, {
                feature,
                timestamp: new Date(),
            });
        });

        console.log(`[FeatureStore] Wrote ${features.length} features`);
    }

    /**
     * Get training data
     */
    async getTrainingData(
        startDate: Date,
        endDate: Date
    ): Promise<TrainingExample[]> {
        const ingestion = new DataIngestionEngine(
            this.prisma,
            process.env.MIXPANEL_API_KEY || ''
        );
        const featureEngine = new FeatureEngineeringEngine();

        // Ingest data
        const postgresData = await ingestion.ingestFromPostgreSQL(
            startDate,
            endDate
        );
        const mixpanelData = await ingestion.ingestFromMixpanel(
            startDate,
            endDate
        );

        // Merge
        const mergedData = ingestion.mergeDataSources(postgresData, mixpanelData);

        // Create training examples
        const examples: TrainingExample[] = [];

        mergedData.forEach((userData, userId) => {
            const features = featureEngine.extractUserFeatures(userData);
            const label = featureEngine.createChurnLabels(userData);

            examples.push({
                features,
                label,
            });
        });

        console.log(
            `[FeatureStore] Created ${examples.length} training examples`
        );

        return examples;
    }

    /**
     * Fetch user data from database
     */
    private async fetchUserData(
        userId: string,
        timestamp?: Date
    ): Promise<any> {
        const endDate = timestamp || new Date();
        const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days

        const [user, events, sites] = await Promise.all([
            this.prisma.user.findUnique({
                where: { id: userId },
                include: { subscriptions: true },
            }),
            this.prisma.analyticsEvent.findMany({
                where: {
                    userId,
                    createdAt: { gte: startDate, lte: endDate },
                },
                orderBy: { createdAt: 'asc' },
            }),
            this.prisma.site.findMany({
                where: { userId },
                include: { deployments: true },
            }),
        ]);

        return {
            user,
            events,
            sites,
            mixpanelEvents: [], // Would fetch from Mixpanel in production
        };
    }
}

// ============================================================================
// AIRFLOW DAG DEFINITION (Python-style in TypeScript)
// ============================================================================

export interface AirflowTask {
    taskId: string;
    operator: string;
    params: any;
    dependencies?: string[];
}

export class AirflowDAGBuilder {
    private tasks: AirflowTask[] = [];

    addIngestionTask(
        taskId: string,
        startDate: Date,
        endDate: Date
    ): AirflowDAGBuilder {
        this.tasks.push({
            taskId,
            operator: 'PythonOperator',
            params: {
                python_callable: 'ingest_data',
                op_kwargs: {
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                },
            },
        });
        return this;
    }

    addFeatureEngineeringTask(
        taskId: string,
        dependencies?: string[]
    ): AirflowDAGBuilder {
        this.tasks.push({
            taskId,
            operator: 'SparkSubmitOperator',
            params: {
                application: 'feature_engineering.py',
                conf: {
                    'spark.executor.memory': '4g',
                    'spark.driver.memory': '2g',
                },
            },
            dependencies,
        });
        return this;
    }

    addFeatureStoreWriteTask(
        taskId: string,
        dependencies?: string[]
    ): AirflowDAGBuilder {
        this.tasks.push({
            taskId,
            operator: 'BashOperator',
            params: {
                bash_command: 'feast materialize',
            },
            dependencies,
        });
        return this;
    }

    addModelTrainingTask(
        taskId: string,
        dependencies?: string[]
    ): AirflowDAGBuilder {
        this.tasks.push({
            taskId,
            operator: 'PythonOperator',
            params: {
                python_callable: 'train_model',
                op_kwargs: {
                    model_type: 'xgboost',
                    hyperparameters: {
                        max_depth: 6,
                        learning_rate: 0.1,
                        n_estimators: 100,
                    },
                },
            },
            dependencies,
        });
        return this;
    }

    build(): AirflowTask[] {
        return this.tasks;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    DataIngestionEngine,
    FeatureEngineeringEngine,
    FeastFeatureStore,
    AirflowDAGBuilder,
};
