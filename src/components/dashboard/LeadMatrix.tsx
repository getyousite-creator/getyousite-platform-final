"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getStoreLeadsAction, updateLeadStatusAction } from "@/actions/lead-actions";
import {
    Mail,
    User,
    Clock,
    CheckCircle,
    Archive,
    ExternalLink,
    MessageSquare,
    TrendingUp,
    Zap,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

// Type-safe lead interface
interface Lead {
    id: string;
    store_id: string;
    email: string;
    full_name: string | null;
    message: string | null;
    status: "new" | "contacted" | "archived";
    created_at: string;
    stores?: { name: string } | null;
}

// AI-powered lead scoring algorithm
function calculateLeadScore(lead: Lead): number {
    let score = 50; // Base score

    // Message quality scoring
    if (lead.message) {
        const messageLength = lead.message.length;
        if (messageLength > 100) score += 20; // Detailed inquiry
        if (messageLength > 200) score += 10; // Very detailed

        // Intent keywords (high-value signals)
        const highValueKeywords = [
            "price",
            "quote",
            "buy",
            "purchase",
            "contract",
            "urgent",
            "asap",
            "budget",
        ];
        const lowValueKeywords = ["just looking", "maybe", "thinking"];

        highValueKeywords.forEach((keyword) => {
            if (lead.message!.toLowerCase().includes(keyword)) score += 15;
        });

        lowValueKeywords.forEach((keyword) => {
            if (lead.message!.toLowerCase().includes(keyword)) score -= 10;
        });
    }

    // Full name provided = more serious
    if (lead.full_name) score += 15;

    // Recency bonus (newer leads are hotter)
    const hoursOld = (Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60);
    if (hoursOld < 1)
        score += 20; // Less than 1 hour old
    else if (hoursOld < 24) score += 10; // Less than 1 day old

    // Status penalty
    if (lead.status === "contacted") score -= 30;
    if (lead.status === "archived") score -= 50;

    return Math.max(0, Math.min(100, score)); // Clamp between 0-100
}

export function LeadMatrix() {
    const t = useTranslations("Dashboard.leads");
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshLeads = React.useCallback(async () => {
        setLoading(true);
        const data = await getStoreLeadsAction();
        setLeads(data as Lead[]);
        setLoading(false);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            refreshLeads();
        }, 0);
        return () => clearTimeout(timeoutId);
    }, [refreshLeads]);

    const handleStatusUpdate = async (leadId: string, status: "new" | "contacted" | "archived") => {
        const res = await updateLeadStatusAction(leadId, status);
        if (res.success) {
            toast.success(`Lead status updated to ${status}`);
            refreshLeads();
        } else {
            toast.error("Failed to update lead status");
        }
    };

    // AI-powered lead intelligence
    const leadsWithScores = useMemo(() => {
        return leads
            .map((lead) => ({
                ...lead,
                score: calculateLeadScore(lead),
            }))
            .sort((a, b) => b.score - a.score); // Sort by score descending
    }, [leads]);

    // Analytics calculations
    const analytics = useMemo(() => {
        const total = leads.length;
        const newLeads = leads.filter((l) => l.status === "new").length;
        const contacted = leads.filter((l) => l.status === "contacted").length;
        const conversionRate = total > 0 ? ((contacted / total) * 100).toFixed(1) : "0";
        const avgScore =
            leadsWithScores.length > 0
                ? (
                      leadsWithScores.reduce((sum, l) => sum + l.score, 0) / leadsWithScores.length
                  ).toFixed(0)
                : "0";

        return { total, newLeads, contacted, conversionRate, avgScore };
    }, [leads, leadsWithScores]);

    if (loading)
        return (
            <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/5 animate-pulse">
                <MessageSquare className="w-12 h-12 text-[#00D09C]/20 mx-auto mb-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Analyzing Lead Intelligence...
                </span>
            </div>
        );

    return (
        <div className="space-y-8 sovereign">
            {/* AI-Powered Analytics Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#00D09C]/10 to-transparent border border-[#00D09C]/20">
                    <div className="flex items-center justify-between mb-2">
                        <Mail className="w-5 h-5 text-[#00D09C]" />
                        <span className="text-2xl font-black text-white">{analytics.total}</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                        Total Leads
                    </p>
                </div>

                <div className="p-6 rounded-[24px] bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <Zap className="w-5 h-5 text-blue-400" />
                        <span className="text-2xl font-black text-white">{analytics.newLeads}</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                        New & Hot
                    </p>
                </div>

                <div className="p-6 rounded-[24px] bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        <span className="text-2xl font-black text-white">
                            {analytics.conversionRate}%
                        </span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                        Contact Rate
                    </p>
                </div>

                <div className="p-6 rounded-[24px] bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-5 h-5 text-amber-400" />
                        <span className="text-2xl font-black text-white">{analytics.avgScore}</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                        Avg AI Score
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tightest text-white">
                        {t("title")}
                    </h2>
                    <p className="text-[10px] text-blue-400 uppercase tracking-widest mt-2 flex items-center gap-2 font-bold">
                        <Mail className="w-3 h-3" />
                        AI-Powered Lead Intelligence & Prioritization
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {leadsWithScores.length === 0 ? (
                    <div className="p-20 text-center bg-[#051423]/30 rounded-[40px] border border-dashed border-white/10">
                        <Mail className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                        <h3 className="text-lg font-black uppercase text-zinc-600 italic">
                            {t("no_data")}
                        </h3>
                        <p className="text-[10px] text-zinc-700 uppercase tracking-widest mt-2 font-bold">
                            {t("no_data_desc")}
                        </p>
                    </div>
                ) : (
                    leadsWithScores.map((lead) => {
                        // AI Score color coding
                        const scoreColor =
                            lead.score >= 75
                                ? "text-[#00D09C]"
                                : lead.score >= 50
                                  ? "text-amber-400"
                                  : "text-zinc-500";
                        const scoreBg =
                            lead.score >= 75
                                ? "bg-[#00D09C]/10 border-[#00D09C]/30"
                                : lead.score >= 50
                                  ? "bg-amber-500/10 border-amber-500/30"
                                  : "bg-zinc-500/10 border-zinc-500/30";

                        return (
                            <div
                                key={lead.id}
                                className={`p-6 rounded-[32px] border transition-all flex flex-col md:flex-row gap-6 items-start md:items-center ${
                                    lead.status === "new"
                                        ? "bg-[#00D09C]/5 border-[#00D09C]/20 shadow-[0_0_20px_rgba(0,208,156,0.05)]"
                                        : "bg-[#051423]/50 border-white/5"
                                }`}
                            >
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                            <User className="w-6 h-6 text-[#00D09C]" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h4 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                                                    {lead.full_name || t("anonymous")}
                                                    {lead.status === "new" && (
                                                        <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-ping" />
                                                    )}
                                                </h4>
                                                {/* AI Quality Score Badge */}
                                                <div
                                                    className={`px-3 py-1 rounded-full border ${scoreBg} flex items-center gap-1.5`}
                                                >
                                                    <Zap className={`w-3 h-3 ${scoreColor}`} />
                                                    <span
                                                        className={`text-[9px] font-black uppercase ${scoreColor}`}
                                                    >
                                                        {lead.score}/100
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-blue-200/50 font-medium mt-1">
                                                {lead.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-[#051423]/50 border border-white/5 text-xs text-blue-100 leading-relaxed font-medium italic">
                                        &quot;{lead.message || t("no_message")}&quot;
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-[9px] font-black uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5 text-zinc-500">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(lead.created_at))}{" "}
                                            {t("ago")}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-blue-400">
                                            <ExternalLink className="w-3 h-3" />
                                            {t("node")} {lead.stores?.name || "Unknown"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => handleStatusUpdate(lead.id, "contacted")}
                                        className="flex-1 md:w-32 py-3 rounded-xl bg-[#00D09C] text-[#0A2540] text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                    >
                                        {t("contacted")}
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(lead.id, "archived")}
                                        className="flex-1 md:w-32 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                    >
                                        {t("archive")}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
