"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Rocket, Globe, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getStoreStatusAction } from '@/app/actions/store-actions';

export default function SuccessPage({ params }: { params: { siteId: string, locale: string } }) {
    const [status, setStatus] = useState<'verifying' | 'deploying' | 'active' | 'pending_payment'>('verifying');
    const [liveUrl, setLiveUrl] = useState<string | null>(null);

    useEffect(() => {
        let pollCount = 0;
        const checkStatus = async () => {
            const result = await getStoreStatusAction(params.siteId);

            if (result.success && result.data) {
                const data = result.data;
                if (data.status === 'deployed') {
                    setStatus('active');
                    setLiveUrl(data.deployment_url ?? null);
                    return true;
                } else if (data.status === 'paid' || data.status === 'deploying') {
                    setStatus('deploying');
                } else if (data.status === 'pending_payment') {
                    setStatus('verifying');
                }
            }
            return false;
        };

        const interval = setInterval(async () => {
            const isDone = await checkStatus();
            pollCount++;
            if (isDone || pollCount > 60) clearInterval(interval); // Timeout after 5 mins
        }, 5000);

        checkStatus();
        return () => clearInterval(interval);
    }, [params.siteId]);

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-2xl w-full space-y-12 text-center">
                {/* STATUS ICON */}
                <div className="relative inline-block">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30"
                    >
                        {status === 'active' ? (
                            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                        ) : (
                            <Rocket className="w-12 h-12 text-blue-400 animate-pulse" />
                        )}
                    </motion.div>
                    {status === 'active' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full -z-10"
                        />
                    )}
                </div>

                {/* CELEBRATION TEXT */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                        {status === 'active' ? "Empire Live" : "Orchestrating..."}
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-md mx-auto">
                        {status === 'active'
                            ? "Your sovereign digital infrastructure is now active and deployed to the global network."
                            : "Verifying financial entitlement and syncing blueprint with Sovereign Cloud nodes."}
                    </p>
                </div>

                {/* DEPLOYMENT SPECS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SpecCard label="ID_CODE" value={params.siteId?.slice(0, 8).toUpperCase()} icon={<Shield size={14} />} />
                    <SpecCard label="STATUS" value={status.toUpperCase()} icon={<Globe size={14} />} color={status === 'active' ? 'text-emerald-400' : 'text-blue-400'} />
                    <SpecCard label="REGION" value="EU_CENTRAL_1" icon={<ExternalLink size={14} />} />
                </div>

                {/* FINAL ACTIONS */}
                {status === 'active' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-8 space-y-4"
                    >
                        <Button
                            className="w-full h-16 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-zinc-200 shadow-2xl"
                            asChild
                        >
                            <a href={liveUrl || `https://${params.siteId}.getyousite.com`} target="_blank" rel="noopener noreferrer">
                                Visit Live Empire <ExternalLink size={16} className="ml-2" />
                            </a>
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full text-zinc-500 hover:text-white uppercase text-[10px] font-bold tracking-widest mt-4"
                            asChild
                        >
                            <Link href="/">Return to Control Center</Link>
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function SpecCard({ label, value, icon, color = "text-white" }: any) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-2">
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                {icon}
                {label}
            </div>
            <div className={`text-sm font-bold truncate ${color}`}>
                {value}
            </div>
        </div>
    );
}
