"use client";

import { IntelligenceDashboard } from './IntelligenceDashboard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Plus, Edit, TrendingUp, Users, Eye, Globe, Search,
    Clock, Calendar, BarChart3, SearchCheck, Shield,
    Zap, Target, ArrowUpRight, ArrowDownRight, Download, LogOut, Activity
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckoutModule } from "@/components/payment/CheckoutModule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeadMatrix } from './LeadMatrix';
import { toast } from 'sonner';

// Types for dashboard data
interface DashboardStore {
    id: string;
    name: string;
    description: string | null;
    status: string;
    deployment_url: string | null;
    custom_domain?: string | null;
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
    conversionRate: number;
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

interface DashboardActivity {
    type: string;
    message: string;
    date: string;
}

export default function DashboardClient() {
    const t = useTranslations("Dashboard");
    const params = useParams();
    const locale = params.locale as string || 'en';
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStore, setSelectedStore] = useState<string | null>(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");

    const handleActivation = (storeId: string) => {
        setActiveStoreId(storeId);
        setShowCheckout(true);
    };

    const handlePaymentSuccess = () => {
        setShowCheckout(false);
        setActiveStoreId(null);
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

    const fetchDashboardData = async (targetStoreId?: string) => {
        try {
            const storesResponse = await fetch('/api/dashboard/stores');
            const storesData = await storesResponse.json();
            const stores = storesData.stores || [];

            // Logic: Determine which store to analyze
            const activeId = targetStoreId || stores[0]?.id;
            if (activeId && !selectedStore) setSelectedStore(activeId);

            let analyticsData = null;
            if (activeId) {
                const analyticsResponse = await fetch(`/api/dashboard/analytics?storeId=${activeId}`);
                analyticsData = await analyticsResponse.json();
            }

            let seoData = null;
            if (activeId) {
                const seoResponse = await fetch(`/api/dashboard/seo?storeId=${activeId}`);
                seoData = await seoResponse.json();
            }

            const synthesizedActivity = stores.map((store: DashboardStore): DashboardActivity => ({
                type: store.status === 'deployed' ? 'success' : store.status === 'pending_payment' ? 'warning' : 'info',
                message: store.status === 'deployed'
                    ? `Site "${store.name}" successfully established on global CDN`
                    : store.status === 'pending_payment'
                        ? `Action required: Activate premium nodes for "${store.name}"`
                        : `Neural draft created: "${store.name}"`,
                date: store.updated_at || store.created_at
            })).sort((a: DashboardActivity, b: DashboardActivity) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

            setData({
                stores,
                analytics: analyticsData,
                seo: seoData,
                recentActivity: synthesizedActivity.length > 0 ? synthesizedActivity : [
                    { type: 'info', message: 'Ready for neural synthesis. Launch your first node.', date: new Date().toISOString() }
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

    const formatSessionDuration = (seconds: number): string => {
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#051423] flex items-center justify-center sovereign">
                <div className="text-center">
                    <Zap className="w-12 h-12 text-[#00D09C] animate-pulse mx-auto mb-6" />
                    <p className="text-[#00D09C] text-[10px] font-black uppercase tracking-widest animate-pulse">{t('syncing')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#051423] p-4 md:p-12 sovereign selection:bg-[#00D09C] selection:text-[#051423]">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* SOVEREIGN ID & HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#00D09C]/10 border border-[#00D09C]/20 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-[#00D09C]" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/60 leading-none">
                                {t('status_auth')}
                            </span>
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none"
                        >
                            {t('title')}
                        </motion.h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            onClick={async () => {
                                const { createClient } = await import('@/lib/supabase/client');
                                const supabase = createClient();
                                await supabase.auth.signOut();
                                window.location.href = '/';
                            }}
                            variant="outline"
                            className="h-14 border-white/5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest px-8 rounded-2xl"
                        >
                            {t('sign_out')}
                        </Button>
                        <Button asChild className="h-14 bg-[#00D09C] hover:bg-[#00B085] text-[#0A2540] font-black uppercase tracking-widest px-10 rounded-2xl shadow-[0_0_30px_rgba(0,208,156,0.2)] border-0">
                            <Link href={`/${locale}/customizer`}>
                                <Plus size={18} className="mr-2" />
                                {t('launch_new')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-12">
                    <TabsList className="bg-white/5 border border-white/5 p-1 h-14 rounded-2xl w-fit flex gap-1">
                        <TabsTrigger value="overview" className="h-full px-8 rounded-xl data-[state=active]:bg-[#00D09C] data-[state=active]:text-[#0A2540] text-white/40 text-[10px] font-black uppercase tracking-widest transition-all">
                            {t('overview')}
                        </TabsTrigger>
                        <TabsTrigger value="leads" className="h-full px-8 rounded-xl data-[state=active]:bg-[#00D09C] data-[state=active]:text-[#0A2540] text-white/40 text-[10px] font-black uppercase tracking-widest transition-all">
                            {t('leads_tab')}
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="h-full px-8 rounded-xl data-[state=active]:bg-[#00D09C] data-[state=active]:text-[#0A2540] text-white/40 text-[10px] font-black uppercase tracking-widest transition-all">
                            {t('growth_matrix')}
                        </TabsTrigger>
                        <TabsTrigger value="seo" className="h-full px-8 rounded-xl data-[state=active]:bg-[#00D09C] data-[state=active]:text-[#0A2540] text-white/40 text-[10px] font-black uppercase tracking-widest transition-all">
                            {t('intelligence_tab')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* SITE LIST & INTELLIGENCE MINIFIED */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black italic uppercase text-white">{t('active_nodes')}</h3>
                                    <Badge className="bg-white/5 border-white/10 text-blue-400 uppercase text-[9px] px-3 py-1 font-black tracking-widest">
                                        {t('total_assets')}: {data?.stores.length}
                                    </Badge>
                                </div>

                                <div className="grid gap-4">
                                    {data?.stores.map((store) => (
                                        <div key={store.id} className="p-8 rounded-[40px] bg-white/5 border border-white/5 hover:border-[#00D09C]/40 transition-all group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="flex gap-2">
                                                    {store.status === 'deployed' && (
                                                        <button
                                                            onClick={() => handleExport(store.id, store.name)}
                                                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/${locale}/customizer?id=${store.id}`}
                                                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                                <div className="w-20 h-20 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center text-[#00D09C] font-black text-2xl italic shadow-2xl">
                                                    {store.name.slice(0, 1)}
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-4">
                                                        <h4 className="text-2xl font-black text-white italic tracking-tight">{store.name}</h4>
                                                        <Badge className={`
                                                            ${store.status === 'deployed' ? 'bg-[#00D09C]/10 text-[#00D09C] border-[#00D09C]/20' : 'bg-white/5 text-zinc-500 border-white/5'}
                                                            uppercase text-[8px] font-black tracking-[0.2em] px-3 py-1 rounded-full
                                                        `}>
                                                            {store.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-blue-200/40 text-xs font-medium max-w-md leading-relaxed">
                                                        {store.description || t('no_description')}
                                                    </p>

                                                    {store.status === 'deployed' && (
                                                        <div className="flex items-center gap-4 pt-2">
                                                            <button
                                                                onClick={async () => {
                                                                    const { verifyDomainAction } = await import('@/app/actions/store-actions');
                                                                    const res = await verifyDomainAction(store.id);
                                                                    if (res.success && res.data?.verified) {
                                                                        toast.success("Connection Verified: Node is live on global edge.");
                                                                    } else {
                                                                        toast.error(res.error || "Connection Pending: DNS/SSL propagation in progress.");
                                                                    }
                                                                }}
                                                                className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-[#00D09C]/60 hover:text-[#00D09C] transition-colors"
                                                            >
                                                                <Activity className="w-3 h-3" />
                                                                Check Connectivity
                                                            </button>
                                                            {store.custom_domain && (
                                                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest border-l border-white/10 pl-4">
                                                                    Asset: {store.custom_domain}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {store.status === 'pending_payment' && (
                                                        <button
                                                            onClick={() => handleActivation(store.id)}
                                                            className="flex items-center gap-3 text-[#00D09C] text-[10px] font-black uppercase tracking-widest pt-4 group/btn"
                                                        >
                                                            <Zap className="w-3 h-3 animate-pulse" />
                                                            {t('authorize_deployment')}
                                                            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-xl font-black italic uppercase text-white">{t('recent_activity')}</h3>
                                <div className="space-y-4">
                                    {data?.recentActivity.map((activity, i) => (
                                        <div key={i} className="p-6 rounded-[32px] bg-white/2 border border-white/5 flex gap-4 items-start">
                                            <div className={`w-1.5 h-1.5 rounded-full mt-2 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${activity.type === 'success' ? 'bg-[#00D09C]' : 'bg-blue-400'
                                                }`} />
                                            <div className="space-y-1">
                                                <p className="text-xs text-white/90 font-medium leading-relaxed italic">"{activity.message}"</p>
                                                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{new Date(activity.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="leads" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <LeadMatrix />
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* SELECTOR & HEADER */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h3 className="text-2xl font-black italic uppercase text-white">{t('growth_matrix')}</h3>
                                <p className="text-[10px] text-[#00D09C] uppercase tracking-widest font-bold mt-1">Live behavioral transmission tracking</p>
                            </div>

                            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-4">Target_Asset:</span>
                                <select
                                    value={selectedStore || ""}
                                    onChange={(e) => {
                                        const id = e.target.value;
                                        setSelectedStore(id);
                                        fetchDashboardData(id);
                                    }}
                                    className="bg-transparent text-white font-black uppercase text-[10px] tracking-widest border-none outline-none focus:ring-0 cursor-pointer pr-10"
                                >
                                    {data?.stores.map(s => (
                                        <option key={s.id} value={s.id} className="bg-[#051423]">{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* STATS TILES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: t('total_transmissions'), value: formatNumber(data?.analytics?.totalViews || 0), icon: Eye, color: '#00D09C' },
                                { label: t('unique_operators'), value: formatNumber(data?.analytics?.uniqueVisitors || 0), icon: Users, color: '#6366f1' },
                                { label: t('conversion_velocity'), value: `${(data?.analytics?.conversionRate || 0).toFixed(2)}%`, icon: Target, color: '#f59e0b' },
                                { label: t('attention_span'), value: formatSessionDuration(data?.analytics?.avgSessionDuration || 0), icon: Clock, color: '#ec4899' }
                            ].map((stat, i) => (
                                <div key={stat.label} className="p-8 rounded-[40px] bg-white/5 border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                                    <div className="relative z-10 space-y-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#00D09C]/50 transition-all">
                                            <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                                            <p className="text-4xl font-black text-white italic tracking-tighter mt-1">{stat.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* TIME SERIES */}
                        <div className="p-10 rounded-[40px] bg-white/5 border border-white/5">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h4 className="text-xl font-black italic uppercase text-white">{t('grid_traffic')}</h4>
                                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">{t('transmission_density')}</p>
                                </div>
                            </div>
                            <div className="h-64 flex items-end justify-between gap-3 px-4">
                                {(data?.analytics?.viewsOverTime || []).slice(-20).map((day, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                        <div
                                            className="w-full bg-[#00D09C]/10 group-hover:bg-[#00D09C] group-hover:shadow-[0_0_20px_rgba(0,208,156,0.3)] rounded-t-xl transition-all duration-700"
                                            style={{
                                                height: `${(day.views / (Math.max(...(data?.analytics?.viewsOverTime || [{ views: 1 }]).map(d => d.views)) || 1)) * 100}%`,
                                                minHeight: '4px'
                                            }}
                                        />
                                        <span className="text-[8px] font-black text-white/20 group-hover:text-white transition-colors">
                                            {new Date(day.date).getDate()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="seo" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <IntelligenceDashboard />
                    </TabsContent>
                </Tabs>

                {/* LOGIC UNIFICATION: CHECKOUT DIALOG */}
                <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
                    <DialogContent className="max-w-2xl bg-transparent border-none p-0">
                        {activeStoreId && (
                            <CheckoutModule
                                siteId={activeStoreId}
                                planId="pro"
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
