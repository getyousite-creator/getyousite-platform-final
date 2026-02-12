"use client";

import { useAuth } from "@/components/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface SubscriptionGateProps {
    children: React.ReactNode;
    requiredTier?: string;
    fallback?: React.ReactNode;
}

export function SubscriptionGate({
    children,
    requiredTier = "active",
    fallback,
}: SubscriptionGateProps) {
    const { profile, loading } = useAuth();
    const t = useTranslations("Common");

    if (loading) return null;

    // Tier hierarchy: starter < pro < business
    const tierHierarchy: Record<string, number> = {
        starter: 0,
        pro: 1,
        business: 2,
        enterprise: 2, // Alias for business
    };

    const userTier = profile?.plan_id || "starter";
    const userTierLevel = tierHierarchy[userTier] || 0;
    const requiredTierLevel = tierHierarchy[requiredTier] || 0;

    const hasAccess =
        profile?.subscription_status === "active" && userTierLevel >= requiredTierLevel;

    if (!hasAccess) {
        return (
            fallback || (
                <div className="p-12 rounded-[40px] bg-[#051423]/50 border border-white/5 flex flex-col items-center justify-center text-center space-y-6 backdrop-blur-md">
                    <div className="w-16 h-16 rounded-[24px] bg-[#00D09C]/5 border border-[#00D09C]/10 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-[#00D09C]" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">
                            {t("gate_title")}
                        </h3>
                        <p className="text-[10px] text-blue-200/40 uppercase tracking-widest leading-relaxed max-w-[280px] font-bold">
                            {t("gate_desc", { tier: requiredTier.toUpperCase() })}
                        </p>
                    </div>
                    <Link href={`/${locale}/pricing`}>
                        <Button
                            variant="glow"
                            className="h-12 px-10 text-[10px] font-black uppercase tracking-widest rounded-2xl"
                        >
                            {t("upgrade")}
                        </Button>
                    </Link>
                </div>
            )
        );
    }

    return <>{children}</>;
}
