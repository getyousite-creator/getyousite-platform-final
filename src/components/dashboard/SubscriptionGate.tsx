"use client";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { Lock, Zap, Crown, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface SubscriptionGateProps {
    children: React.ReactNode;
    tier: 'starter' | 'pro' | 'enterprise'; // Minimum required tier
    fallback?: React.ReactNode;
    title?: string;
    description?: string;
}

const TIER_LEVELS = {
    'starter': 1,
    'pro': 2,
    'enterprise': 3
};

export default function SubscriptionGate({
    children,
    tier = 'pro',
    fallback,
    title = "Premium Feature Locked",
    description = "Upgrade your sovereign clearance to access this module."
}: SubscriptionGateProps) {
    const { user, profile, loading } = useSupabase();
    const router = useRouter();

    if (loading) return <div className="animate-pulse bg-white/5 h-32 rounded-xl" />;

    // Logic: Determine current user tier level
    // Default to 0 (No subscription)
    const currentTierLevel = TIER_LEVELS[profile?.tier as keyof typeof TIER_LEVELS] || 0;
    const requiredTierLevel = TIER_LEVELS[tier];

    const hasAccess = currentTierLevel >= requiredTierLevel;

    if (hasAccess) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    // Cinematic Lock Screen
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#020617]/50 backdrop-blur-sm p-8 text-center group">
            {/* Blurred Content Preview (Optional Visual Trick) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none filter blur-md select-none" aria-hidden="true">
                {children}
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[200px] gap-6">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                    {tier === 'enterprise' ? <Crown className="w-8 h-8 text-yellow-500" /> : <Lock className="w-8 h-8 text-white/40" />}
                </div>

                <div className="space-y-2 max-w-md">
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">{title}</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed">
                        {description} <br />
                        <span className="text-primary/60 text-xs mt-2 block">Required Clearance: {tier.toUpperCase()}</span>
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={() => router.push('/pricing')}
                        className="bg-primary hover:bg-blue-600 text-[#020617] font-bold uppercase tracking-widest px-8 shadow-lg shadow-blue-500/20"
                    >
                        <Zap className="w-4 h-4 mr-2" />
                        Upgrade Access
                    </Button>
                </div>
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        </div>
    );
}
