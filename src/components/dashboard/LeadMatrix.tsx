"use client";

import React, { useEffect, useState } from 'react';
import { getStoreLeadsAction, updateLeadStatusAction } from '@/actions/lead-actions';
import { Mail, User, Clock, CheckCircle, Archive, Trash2, ExternalLink, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';

export function LeadMatrix() {
    const t = useTranslations("Dashboard.leads");
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshLeads = async () => {
        setLoading(true);
        const data = await getStoreLeadsAction();
        setLeads(data);
        setLoading(false);
    };

    useEffect(() => {
        refreshLeads();
    }, []);

    const handleStatusUpdate = async (leadId: string, status: any) => {
        const res = await updateLeadStatusAction(leadId, status);
        if (res.success) {
            toast.success(`${t('title')} updated`);
            refreshLeads();
        }
    };

    if (loading) return (
        <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/5 animate-pulse">
            <MessageSquare className="w-12 h-12 text-[#00D09C]/20 mx-auto mb-4" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('loading')}</span>
        </div>
    );

    return (
        <div className="space-y-8 sovereign">
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tightest text-white">{t('title')}</h2>
                    <p className="text-[10px] text-blue-400 uppercase tracking-widest mt-2 flex items-center gap-2 font-bold">
                        <Mail className="w-3 h-3" />
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {leads.length === 0 ? (
                    <div className="p-20 text-center bg-[#051423]/30 rounded-[40px] border border-dashed border-white/10">
                        <Mail className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                        <h3 className="text-lg font-black uppercase text-zinc-600 italic">{t('no_data')}</h3>
                        <p className="text-[10px] text-zinc-700 uppercase tracking-widest mt-2 font-bold">{t('no_data_desc')}</p>
                    </div>
                ) : (
                    leads.map((lead) => (
                        <div key={lead.id} className={`p-6 rounded-[32px] border transition-all flex flex-col md:flex-row gap-6 items-start md:items-center ${lead.status === 'new' ? 'bg-[#00D09C]/5 border-[#00D09C]/20 shadow-[0_0_20px_rgba(0,208,156,0.05)]' : 'bg-[#051423]/50 border-white/5'
                            }`}>
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                        <User className="w-6 h-6 text-[#00D09C]" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                                            {lead.full_name || t('anonymous')}
                                            {lead.status === 'new' && <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-ping" />}
                                        </h4>
                                        <p className="text-xs text-blue-200/50 font-medium">{lead.email}</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-[#051423]/50 border border-white/5 text-xs text-blue-100 leading-relaxed font-medium italic">
                                    "{lead.message || t('no_message')}"
                                </div>

                                <div className="flex flex-wrap gap-4 text-[9px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                        <Clock className="w-3 h-3" />
                                        {formatDistanceToNow(new Date(lead.created_at))} {t('ago')}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-blue-400">
                                        <ExternalLink className="w-3 h-3" />
                                        {t('node')} {lead.stores?.name}
                                    </div>
                                </div>
                            </div>

                            <div className="flex md:flex-col gap-2 w-full md:w-auto">
                                <button
                                    onClick={() => handleStatusUpdate(lead.id, 'contacted')}
                                    className="flex-1 md:w-32 py-3 rounded-xl bg-[#00D09C] text-[#0A2540] text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                >
                                    {t('contacted')}
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(lead.id, 'archived')}
                                    className="flex-1 md:w-32 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    {t('archive')}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
