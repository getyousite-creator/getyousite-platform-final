"use client";

import { useAuth } from "@/components/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

interface SubscriptionGateProps {
    children: React.ReactNode;
    requiredTier?: string;
    fallback?: React.ReactNode;
}

export function SubscriptionGate({ children, requiredTier = 'active', fallback }: SubscriptionGateProps) {
    const { profile, isLoading } = useAuth();
    const t = useTranslations("Common");

    if (isLoading) return null;

    const isSubscribed = profile?.subscription_status === 'active';

    if (!isSubscribed) {
        return fallback || (
            <div className="p-10 rounded-[32px] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-zinc-500" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-200">Premium Mandate Required</h3>
                    <p className="text-[10px] text-zinc-500 max-w-[240px]">This feature is gated behind the Pro subscription protocol.</p>
                </div>
                <Link href="/pricing">
                    <Button variant="premium" size="sm" className="h-9 px-6 text-[9px] font-black uppercase tracking-widest">
                        {t('upgrade')}
                    </Button>
                </Link>
            </div>
        );
    }

    return <>{children}</>;
}
