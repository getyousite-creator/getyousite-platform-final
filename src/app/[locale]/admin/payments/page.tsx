"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ExternalLink, Mail, Clock, ShieldAlert, Search, Layers } from "lucide-react";
import { approvePaymentRequestAction, rejectPaymentRequestAction, getPendingRequestsAction } from "@/app/actions/admin-actions";
import { seedLegendarySitesAction } from "@/app/actions/seed-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PaymentRequest {
    id: string;
    method: string;
    amount: number;
    receipt_url: string;
    created_at: string;
    profiles?: {
        email: string;
    };
}

export default function AdminPaymentsPage() {
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [filter, setFilter] = useState("");
    const router = useRouter();

    // HARDCODED COMMANDER EMAIL
    const AUTHORIZED_EMAIL = "u110877386@getyousite.com"; // Commander's official email

    const fetchRequests = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const data = (await getPendingRequestsAction()) as PaymentRequest[];
            setRequests(data);
        } catch {
            toast.error("Failed to load requests.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const checkAuth = React.useCallback(async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.email !== AUTHORIZED_EMAIL) {
            setIsAuthorized(false);
            toast.error("UNAUTHORIZED ACCESS: Command center locked.");
            setTimeout(() => router.push("/"), 2000);
        } else {
            setIsAuthorized(true);
            fetchRequests();
        }
    }, [router, fetchRequests, AUTHORIZED_EMAIL]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleApprove = async (id: string) => {
        const result = await approvePaymentRequestAction(id, "Approved by Admin");
        if (result.success) {
            toast.success("Payment Approved. User activated.");
            fetchRequests();
        } else {
            toast.error("Failed to approve.");
        }
    };

    const handleReject = async (id: string) => {
        const result = await rejectPaymentRequestAction(id, "Proof invalid/fake");
        if (result.success) {
            toast.warning("Payment Rejected.");
            fetchRequests();
        } else {
            toast.error("Failed to reject.");
        }
    };

    const handleSeedShowcase = async () => {
        setIsLoading(true);
        const result = await seedLegendarySitesAction();
        if (result.success) {
            toast.success("Showcase Seeded with 5 Legendary Sites.");
            fetchRequests(); // Refresh just in case
        } else {
            toast.error("Seeding failed.");
        }
        setIsLoading(false);
    };

    if (isAuthorized === false) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-8">
                <div className="text-center space-y-6">
                    <ShieldAlert className="w-20 h-20 text-red-500 mx-auto animate-pulse" />
                    <h1 className="text-4xl font-black text-white italic tracking-tighter">ACCESS DENIED</h1>
                    <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Unauthorized credentials detected. Security protocols engaged.</p>
                </div>
            </div>
        );
    }

    if (isAuthorized === null || isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-8">
                <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-950 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center">
                                <ShieldAlert className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-black italic tracking-tighter">PAYMENT COMMANDER</h1>
                        </div>
                        <p className="text-zinc-500 font-medium uppercase text-[10px] tracking-widest">Sovereign Management Interface</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <Button
                            onClick={handleSeedShowcase}
                            variant="outline"
                            className="bg-zinc-950 text-white border-zinc-800 hover:bg-zinc-800 h-10 px-6 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all"
                        >
                            <Layers className="w-3.5 h-3.5 mr-2" /> Seed Showcase
                        </Button>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                            <input
                                type="text"
                                placeholder="Filter by Email / Method..."
                                className="bg-white border border-zinc-100 rounded-2xl pl-12 pr-6 h-14 w-full md:w-80 text-sm font-bold shadow-sm focus:ring-2 ring-zinc-100 outline-none transition-all"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {requests.filter(r => (r.method || "").includes(filter) || (r.profiles?.email || "").includes(filter)).map((req) => (
                            <motion.div
                                key={req.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-500 group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="px-4 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400">
                                        {req.method} Flow
                                    </div>
                                    <div className="text-2xl font-black text-emerald-500">
                                        ${req.amount}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-100/50">
                                        <Mail className="w-4 h-4 text-zinc-400" />
                                        <span className="text-xs font-bold truncate">{req.profiles?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-100/50">
                                        <Clock className="w-4 h-4 text-zinc-400" />
                                        <span className="text-xs font-bold">{new Date(req.created_at).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="relative aspect-video rounded-2xl bg-zinc-100 overflow-hidden mb-8 border border-zinc-200 cursor-zoom-in" onClick={() => window.open(req.receipt_url, '_blank')}>
                                    {req.receipt_url ? (
                                        <Image
                                            src={req.receipt_url}
                                            alt="Receipt"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                                            unoptimized // Since these are dynamic user uploads from Supabase
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-300">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest">
                                        <ExternalLink className="w-4 h-4 mr-2" /> View Full Reçu
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => handleReject(req.id)}
                                        className="h-14 rounded-2xl bg-white border-2 border-zinc-100 text-zinc-400 hover:border-red-500 hover:text-red-500 transition-all font-black uppercase tracking-widest text-[10px]"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" /> Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleApprove(req.id)}
                                        className="h-14 rounded-2xl bg-zinc-950 text-white hover:bg-emerald-600 transition-all font-black uppercase tracking-widest text-[10px]"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Activate Pro
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {requests.length === 0 && (
                        <div className="col-span-full h-96 border-2 border-dashed border-zinc-100 rounded-[40px] flex flex-col items-center justify-center gap-4 text-zinc-300">
                            <CheckCircle2 className="w-12 h-12 opacity-20" />
                            <span className="text-xs font-black uppercase tracking-widest">No Pending Operations</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

