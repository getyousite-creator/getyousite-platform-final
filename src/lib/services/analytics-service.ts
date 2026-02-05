/**
 * Analytics Service
 * 
 * Advanced analytics tracking and reporting for stores.
 * Supports real-time analytics, traffic sources, user behavior, and conversion tracking.
 */

import { createClient } from '@/lib/supabase/server';
import { AuthService } from './auth-service';

export interface AnalyticsEvent {
    type: string;
    data?: Record<string, any>;
    timestamp?: Date;
}

export interface AnalyticsQuery {
    storeId: string;
    startDate?: Date;
    endDate?: Date;
    granularity?: 'hour' | 'day' | 'week' | 'month';
    metrics?: string[];
    dimensions?: string[];
}

export interface AnalyticsSummary {
    totalViews: number;
    totalVisitors: number;
    uniqueVisitors: number;
    avgSessionDuration: number;
    bounceRate: number;
    topPages: { path: string; views: number }[];
    topSources: { source: string; visitors: number }[];
    deviceBreakdown: { device: string; count: number }[];
    countryBreakdown: { country: string; count: number }[];
    viewsOverTime: { date: string; views: number }[];
}

export const AnalyticsService = {
    /**
     * Track a page view
     */
    async trackPageView(
        storeId: string,
        path: string,
        metadata: {
            device?: string;
            browser?: string;
            os?: string;
            country?: string;
            city?: string;
            referrer?: string;
            source?: string;
            sessionId?: string;
        }
    ): Promise<void> {
        try {
            const supabase = await createClient();

            await supabase.from('analytics').insert({
                store_id: storeId,
                path,
                views: 1,
                visitors: 1,
                unique_visitors: 1,
                device: metadata.device || 'desktop',
                browser: metadata.browser,
                os: metadata.os,
                country: metadata.country,
                city: metadata.city,
                source: metadata.source || 'direct',
                referrer: metadata.referrer,
                timestamp: new Date().toISOString(),
                date: new Date().toISOString().split('T')[0],
            });
        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
    },

    /**
     * Track custom event
     */
    async trackEvent(
        storeId: string,
        path: string,
        event: AnalyticsEvent
    ): Promise<void> {
        try {
            const supabase = await createClient();

            // Store event in analytics
            await supabase.from('analytics').insert({
                store_id: storeId,
                path,
                events: [event],
                date: new Date().toISOString().split('T')[0],
            });
        } catch (error) {
            console.error('Event tracking error:', error);
        }
    },

    /**
     * Get analytics summary for a store
     * Logic Audit: Optimized for scale. 
     */
    async getAnalyticsSummary(
        storeId: string,
        startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: Date = new Date()
    ): Promise<AnalyticsSummary> {
        try {
            const supabase = await createClient();
            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];

            // 1. Fetch Aggregated Metrics via optimized selection
            // In a full production env, we'd use a Postgres View or RPC
            // For now, we perform targeted queries to reduce payload size

            const { data: viewsData } = await supabase
                .from('analytics')
                .select('views, visitors, unique_visitors, path, source, device, country, date')
                .eq('store_id', storeId)
                .gte('date', startStr)
                .lte('date', endStr);

            if (!viewsData || viewsData.length === 0) {
                return this.createEmptySummary();
            }

            // Optimized Aggregation Logic
            let totalViews = 0;
            let totalVisitors = 0;
            let uniqueVisitors = 0;
            const pageViews: Record<string, number> = {};
            const sources: Record<string, number> = {};
            const devices: Record<string, number> = {};
            const countries: Record<string, number> = {};
            const viewsByDate: Record<string, number> = {};

            for (const row of viewsData) {
                totalViews += (row.views || 0);
                totalVisitors += (row.visitors || 0);
                uniqueVisitors += (row.unique_visitors || 0);

                if (row.path) pageViews[row.path] = (pageViews[row.path] || 0) + (row.views || 0);
                if (row.source) sources[row.source] = (sources[row.source] || 0) + (row.visitors || 0);
                if (row.device) devices[row.device] = (devices[row.device] || 0) + 1;
                if (row.country) countries[row.country] = (countries[row.country] || 0) + 1;
                if (row.date) viewsByDate[row.date] = (viewsByDate[row.date] || 0) + (row.views || 0);
            }

            return {
                totalViews,
                totalVisitors,
                uniqueVisitors,
                avgSessionDuration: 0,
                bounceRate: 0,
                topPages: Object.entries(pageViews).map(([path, views]) => ({ path, views })).sort((a, b) => b.views - a.views).slice(0, 10),
                topSources: Object.entries(sources).map(([source, visitors]) => ({ source, visitors })).sort((a, b) => b.visitors - a.visitors).slice(0, 10),
                deviceBreakdown: Object.entries(devices).map(([device, count]) => ({ device, count })).sort((a, b) => b.count - a.count),
                countryBreakdown: Object.entries(countries).map(([country, count]) => ({ country, count })).sort((a, b) => b.count - a.count).slice(0, 10),
                viewsOverTime: Object.entries(viewsByDate).map(([date, views]) => ({ date, views })).sort((a, b) => a.date.localeCompare(b.date))
            };
        } catch (error) {
            console.error('Analytics summary error:', error);
            return this.createEmptySummary();
        }
    },

    createEmptySummary(): AnalyticsSummary {
        return {
            totalViews: 0,
            totalVisitors: 0,
            uniqueVisitors: 0,
            avgSessionDuration: 0,
            bounceRate: 0,
            topPages: [],
            topSources: [],
            deviceBreakdown: [],
            countryBreakdown: [],
            viewsOverTime: [],
        };
    },

    /**
     * Get real-time visitors count
     */
    async getRealTimeVisitors(storeId: string): Promise<number> {
        try {
            const supabase = await createClient();

            // Count visitors in the last 5 minutes
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

            const { count } = await supabase
                .from('analytics')
                .select('*', { count: 'exact', head: true })
                .eq('store_id', storeId)
                .gte('timestamp', fiveMinutesAgo.toISOString());

            return count || 0;
        } catch (error) {
            console.error('Real-time visitors error:', error);
            return 0;
        }
    },

    /**
     * Get traffic sources breakdown
     */
    async getTrafficSources(storeId: string, startDate: Date, endDate: Date) {
        try {
            const supabase = await createClient();

            const { data } = await supabase
                .from('analytics')
                .select('source, medium, campaign, visitors')
                .eq('store_id', storeId)
                .gte('date', startDate.toISOString().split('T')[0])
                .lte('date', endDate.toISOString().split('T')[0]);

            if (!data) return [];

            // Group by source/medium
            const sources: Record<string, { source: string; medium: string; visitors: number }> = {};
            data.forEach(row => {
                const key = `${row.source || 'direct'}/${row.medium || 'none'}`;
                if (!sources[key]) {
                    sources[key] = {
                        source: row.source || 'direct',
                        medium: row.medium || 'none',
                        visitors: 0,
                    };
                }
                sources[key].visitors += row.visitors || 0;
            });

            return Object.values(sources).sort((a, b) => b.visitors - a.visitors);
        } catch (error) {
            console.error('Traffic sources error:', error);
            return [];
        }
    },

    /**
     * Export analytics data
     */
    async exportAnalytics(storeId: string, format: 'csv' | 'json' = 'json') {
        try {
            const supabase = await createClient();

            const { data } = await supabase
                .from('analytics')
                .select('*')
                .eq('store_id', storeId)
                .order('timestamp', { ascending: false });

            if (!data) return null;

            if (format === 'csv') {
                const headers = Object.keys(data[0] || {}).join(',');
                const rows = data.map(row => Object.values(row).join(',')).join('\n');
                return `${headers}\n${rows}`;
            }

            return data;
        } catch (error) {
            console.error('Export analytics error:', error);
            throw error;
        }
    },
};
