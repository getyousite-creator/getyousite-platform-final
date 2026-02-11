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
                <div className="p-10 rounded-[32px] bg-card/5 border border-border flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-card/5 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                            Premium Mandate Required
                        </h3>
                        <p className="text-[10px] text-muted-foreground max-w-[240px]">
                            This feature is gated behind the Pro subscription protocol.
                        </p>
                    </div>
                    <Link href="/pricing">
                        <Button
                            variant="premium"
                            size="sm"
                            className="h-9 px-6 text-[9px] font-black uppercase tracking-widest"
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
