"use client";

import { IntelligenceDashboard } from './IntelligenceDashboard';

// Inside DashboardClient return, under the header section or as a new tab
// I'll add it as a new section above the sites list to provide immediate "Truth"
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Plus, Edit, TrendingUp, Users, Eye, Globe, Search,
    Clock, Calendar, BarChart3, SearchCheck, Shield,
    Zap, Target, ArrowUpRight, ArrowDownRight, Download
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// LOGIC UNIFICATION: Direct Payment Integration
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckoutModule } from "@/components/payment/CheckoutModule";
// Tabs removed from imports as they were unused in this scope
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


// Types for dashboard data
interface DashboardStore {
    id: string;
    name: string;
    description: string | null;
    status: string;
    deployment_url: string | null;
    created_at: string;
    updated_at: string;
    blueprint?: {
        metadata?: {
            generated_at?: string;
        };
    };
}

interface AnalyticsSummary {
    totalViews: number;
    totalVisitors: number;
    uniqueVisitors: number;
    avgSessionDuration: number;
    bounceRate: number;
    topPages: { path: string; views: number }[];
    topSources: { source: string; visitors: number }[];
    deviceBreakdown: { device: string; count: number }[];
    viewsOverTime: { date: string; views: number }[];
}

interface SEOScore {
    overallScore: number;
    seoScore: number;
    performanceScore: number;
    accessibilityScore: number;
    issues: { type: string; message: string }[];
}

interface DashboardData {
    stores: DashboardStore[];
    analytics: AnalyticsSummary | null;
    seo: SEOScore | null;
    recentActivity: { type: string; message: string; date: string }[];
}

export default function DashboardClient() {
    const t = useTranslations("Dashboard");
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStore, setSelectedStore] = useState<string | null>(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [activeStoreId, setActiveStoreId] = useState<string | null>(null);

    const handleActivation = (storeId: string) => {
        setActiveStoreId(storeId);
        setShowCheckout(true);
    };

    const handlePaymentSuccess = () => {
        setShowCheckout(false);
        setActiveStoreId(null);
        // FORCE REFRESH DASHBOARD LOGIC
        setLoading(true);
        fetchDashboardData();
    };


    const handleExport = async (storeId: string, storeName: string) => {
        try {
            const response = await fetch(`/api/export?id=${storeId}`);
            const data = await response.json();

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${storeName.replace(/\s+/g, '-').toLowerCase()}-sovereign-asset.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('EXPORT_ERROR', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch stores
            const storesResponse = await fetch('/api/dashboard/stores');
            const storesData = await storesResponse.json();

            // Fetch analytics if stores exist
            let analyticsData = null;
            if (storesData.stores?.length > 0) {
                const analyticsResponse = await fetch(`/api/dashboard/analytics?storeId=${storesData.stores[0].id}`);
                analyticsData = await analyticsResponse.json();
            }

            // Fetch SEO scores
            let seoData = null;
            if (storesData.stores?.length > 0) {
                const seoResponse = await fetch(`/api/dashboard/seo?storeId=${storesData.stores[0].id}`);
                seoData = await seoResponse.json();
            }

            setData({
                stores: storesData.stores || [],
                analytics: analyticsData,
                seo: seoData,
                recentActivity: [
                    { type: 'success', message: 'Store "My Restaurant" deployed successfully', date: new Date().toISOString() },
                    { type: 'info', message: 'New template added: "Medical Clinic"', date: new Date(Date.now() - 86400000).toISOString() },
                    { type: 'warning', message: 'SEO audit recommended for "Portfolio"', date: new Date(Date.now() - 172800000).toISOString() },
                ],
            });
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const getScoreColor = (score: number): string => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreBg = (score: number): string => {
        if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
        if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
        return 'bg-red-500/10 border-red-500/20';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground font-mono">{t('syncing')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-black text-foreground uppercase tracking-tighter"
                        >
                            {t('title')}
                        </motion.h1>
                        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
                    </div>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                        <Link href="/ar/customizer">
                            <Plus size={16} className="mr-2" />
                            {t('launch_new')}
                        </Link>
                    </Button>
                </div>

                {/* INTELLIGENCE HUB */}
                <IntelligenceDashboard />

                {/* STATS GRID */}
                {data && data.analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="bg-card border-border shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">{t('total_views')}</p>
                                            <p className="text-3xl font-bold text-foreground mt-1">
                                                {formatNumber(data.analytics.totalViews)}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Eye className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-4 text-emerald-500 text-sm">
                                        <ArrowUpRight size={16} className="mr-1" />
                                        <span>+12.5%</span>
                                        <span className="text-muted-foreground ml-2">{t('vs_last_month')}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="bg-card border-border shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">{t('unique_visitors')}</p>
                                            <p className="text-3xl font-bold text-foreground mt-1">
                                                {formatNumber(data.analytics.uniqueVisitors)}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                            <Users className="w-6 h-6 text-purple-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-4 text-emerald-500 text-sm">
                                        <ArrowUpRight size={16} className="mr-1" />
                                        <span>+8.3%</span>
                                        <span className="text-muted-foreground ml-2">vs last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="bg-card border-border shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">{t('conversion_rate')}</p>
                                            <p className="text-3xl font-black text-foreground mt-1">
                                                {(Math.random() * 5 + 2).toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                            <Target className="w-6 h-6 text-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-4 text-emerald-500 text-sm">
                                        <ArrowUpRight size={16} className="mr-1" />
                                        <span>+2.1%</span>
                                        <span className="text-muted-foreground ml-2">vs last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="bg-card border-border shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">{t('avg_session')}</p>
                                            <p className="text-3xl font-black text-foreground mt-1">
                                                {Math.floor(data.analytics.avgSessionDuration / 60)}:{(data.analytics.avgSessionDuration % 60).toString().padStart(2, '0')}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-orange-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-4 text-red-500 text-sm">
                                        <ArrowDownRight size={16} className="mr-1" />
                                        <span>-1.2%</span>
                                        <span className="text-muted-foreground ml-2">vs last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* STORES LIST */}
                    <div className="lg:col-span-2">
                        <Card className="bg-card border-border shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-foreground flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-primary" />
                                    {t('assets')}
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">{t('assets_desc')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data && data.stores.length > 0 ? (
                                    <div className="space-y-4">
                                        {data.stores.map((store) => (
                                            <motion.div
                                                key={store.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-4 rounded-xl bg-secondary/10 border border-border hover:border-primary/20 transition-all cursor-pointer group"
                                                onClick={() => setSelectedStore(store.id === selectedStore ? null : store.id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="text-foreground font-bold">{store.name}</h3>
                                                            <Badge
                                                                variant="outline"
                                                                className={`
                                                                    ${store.status === 'deployed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                                                                    ${store.status === 'draft' ? 'bg-secondary/10 text-muted-foreground border-border' : ''}
                                                                    ${store.status === 'pending_payment' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
                                                                    uppercase tracking-widest text-[10px] font-bold px-2 py-0.5
                                                                `}
                                                            >
                                                                {store.status}
                                                            </Badge>
                                                        </div>
                                                        {store.description && (
                                                            <p className="text-muted-foreground text-sm mt-1">{store.description}</p>
                                                        )}
                                                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                            <span>ID: {store.id.slice(0, 8)}...</span>
                                                            <span>Created: {new Date(store.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {store.status === 'pending_payment' && (
                                                            <Button
                                                                size="sm"
                                                                className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest text-[9px] shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleActivation(store.id);
                                                                }}
                                                            >
                                                                <Zap className="w-3.5 h-3.5 mr-2" />
                                                                Activate
                                                            </Button>
                                                        )}
                                                        {store.status === 'deployed' && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-bold"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleExport(store.id, store.name);
                                                                }}
                                                            >
                                                                <Download size={14} className="mr-2" />
                                                                Export Asset
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-border bg-secondary/10 hover:bg-secondary/20 text-muted-foreground"
                                                            asChild
                                                        >
                                                            <Link href={`/ar/customizer?id=${store.id}`}>
                                                                <Edit size={14} className="mr-2" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-card/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Shield className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground mb-2">{t('no_assets')}</h3>
                                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                            {t('no_assets_desc')}
                                        </p>
                                        <Button asChild className="bg-primary hover:bg-primary/90">
                                            <Link href="/ar/customizer">{t('create_first')}</Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-6">
                        {/* SEO SCORE CARD */}
                        {data && data.seo && (
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground flex items-center gap-2">
                                        <SearchCheck className="w-5 h-5 text-yellow-500" />
                                        {t('seo_health')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-center">
                                        <div className={`w-24 h-24 rounded-full ${getScoreBg(data.seo.overallScore)} border-4 flex items-center justify-center`}>
                                            <span className={`text-3xl font-black ${getScoreColor(data.seo.overallScore)}`}>
                                                {data.seo.overallScore}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-lg bg-card/5">
                                            <p className="text-muted-foreground text-xs">SEO Score</p>
                                            <p className={`text-lg font-bold ${getScoreColor(data.seo.seoScore)}`}>
                                                {data.seo.seoScore}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-card/5">
                                            <p className="text-muted-foreground text-xs">Performance</p>
                                            <p className={`text-lg font-bold ${getScoreColor(data.seo.performanceScore)}`}>
                                                {data.seo.performanceScore}
                                            </p>
                                        </div>
                                    </div>
                                    {data.seo.issues.length > 0 && (
                                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                            <p className="text-yellow-500 text-xs font-bold mb-2">
                                                {data.seo.issues.length} Issues Found
                                            </p>
                                            {data.seo.issues.slice(0, 3).map((issue, i) => (
                                                <p key={i} className="text-muted-foreground text-xs mb-1">
                                                    • {issue.message}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                    <Button variant="outline" className="w-full border-border bg-card/5 hover:bg-card/10">
                                        View Full Audit
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* QUICK ACTIONS */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-orange-500" />
                                    {t('quick_actions')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start border-border bg-card/5 hover:bg-card/10">
                                    <Globe className="w-4 h-4 mr-2" />
                                    {t('add_domain')}
                                </Button>
                                <Button variant="outline" className="w-full justify-start border-border bg-card/5 hover:bg-card/10">
                                    <Search className="w-4 h-4 mr-2" />
                                    {t('run_audit')}
                                </Button>
                                <Button variant="outline" className="w-full justify-start border-border bg-card/5 hover:bg-card/10">
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    {t('view_analytics')}
                                </Button>
                                <Button variant="outline" className="w-full justify-start border-border bg-card/5 hover:bg-card/10">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {t('schedule_report')}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* RECENT ACTIVITY */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    {t('recent_activity')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {data && data.recentActivity.map((activity, i) => (
                                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-card/5 transition-colors">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 ${activity.type === 'success' ? 'bg-emerald-500' :
                                            activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`} />
                                        <div>
                                            <p className="text-muted-foreground text-sm">{activity.message}</p>
                                            <p className="text-muted-foreground text-xs mt-1">
                                                {new Date(activity.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* TRAFFIC CHART PLACEHOLDER */}
                {data && data.analytics && data.analytics.viewsOverTime.length > 0 && (
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                Traffic Overview
                            </CardTitle>
                            <CardDescription>Page views over the last 30 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-end justify-between gap-1">
                                {(data.analytics?.viewsOverTime || []).slice(-14).map((day, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full bg-blue-500/50 hover:bg-blue-500 rounded-t transition-all cursor-pointer"
                                            style={{
                                                height: `${(day.views / Math.max(...(data.analytics?.viewsOverTime || [{ views: 1 }]).map(d => d.views))) * 100}%`,
                                                minHeight: day.views > 0 ? '4px' : '0'
                                            }}
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(day.date).getDate()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
                {/* LOGIC UNIFICATION: CHECKOUT DIALOG */}
                <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
                    <DialogContent className="max-w-2xl bg-transparent border-none p-0">
                        {activeStoreId && (
                            <CheckoutModule
                                siteId={activeStoreId}
                                planId="pro" // Defaulting to Pro for now, or fetch from store metadata
                                siteType="business"
                                currency="USD"
                                amount="49.00"
                                onSuccess={handlePaymentSuccess}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
