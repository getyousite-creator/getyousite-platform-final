"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Rocket, Globe, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
// unused imports: getStoreStatusAction, activateStoreSimulationAction
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SuccessPage({
    params,
}: {
    params: Promise<{ siteId: string; locale: string }>;
}) {
    const paramsU = React.use(params);
    const siteId = paramsU.siteId;
    const [status, setStatus] = useState<"verifying" | "deploying" | "active" | "pending_payment">(
        "verifying",
    );
    const [liveUrl, setLiveUrl] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const isSimulated = searchParams.get("simulated") === "true";
    const t = useTranslations("Success");

    useEffect(() => {
        let pollCount = 0;
        const checkStatus = async () => {
            if (!siteId) return false;
            const { getStoreStatusAction } = await import("@/app/actions/store-actions");
            const result = await getStoreStatusAction(siteId);

            if (result.success && result.data) {
                const data = result.data;
                if (data.status === "deployed") {
                    setStatus("active");
                    setLiveUrl(data.deployment_url ?? null);

                    // PROTOCOL: TRACK CONVERSION TRUTH
                    const { trackEventAction } = await import("@/app/actions/analytics-actions");
                    trackEventAction(siteId, "/success", "monetization_conversion", {
                        amount: "49.00",
                        currency: "USD",
                    }).catch(() => {});

                    return true;
                } else if (data.status === "paid" || data.status === "deploying") {
                    setStatus("deploying");
                } else if (data.status === "pending_payment") {
                    setStatus("verifying");
                }
            }
            return false;
        };

        // Simulation Trigger
        if (isSimulated && siteId) {
            import("@/app/actions/store-actions").then(({ activateStoreSimulationAction }) => {
                activateStoreSimulationAction(siteId).then(() => {
                    checkStatus();
                });
            });
        }

        const interval = setInterval(async () => {
            const isDone = await checkStatus();
            pollCount++;
            if (isDone || pollCount > 60) clearInterval(interval);
        }, 5000);

        checkStatus();
        return () => clearInterval(interval);
    }, [siteId, isSimulated]);

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
                        {status === "active" ? (
                            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                        ) : (
                            <Rocket className="w-12 h-12 text-blue-400 animate-pulse" />
                        )}
                    </motion.div>
                    {status === "active" && (
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
                        {status === "active" ? t("emp_live") : t("orchestrating")}
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-md mx-auto">
                        {status === "active" ? t("active_msg") : t("verifying_msg")}
                    </p>
                </div>

                {/* DEPLOYMENT SPECS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SpecCard
                        label={t("id_code")}
                        value={siteId?.slice(0, 8).toUpperCase()}
                        icon={<Shield size={14} />}
                    />
                    <SpecCard
                        label={t("status")}
                        value={status.toUpperCase()}
                        icon={<Globe size={14} />}
                        color={status === "active" ? "text-emerald-400" : "text-blue-400"}
                    />
                    <SpecCard
                        label={t("region")}
                        value="EU_CENTRAL_1"
                        icon={<ExternalLink size={14} />}
                    />
                </div>

                {/* FINAL ACTIONS */}
                {status === "active" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-8 space-y-4"
                    >
                        <Button
                            className="w-full h-16 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-zinc-200 shadow-2xl"
                            asChild
                        >
                            <a
                                href={liveUrl || `https://${siteId}.getyousite.com`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t("visit_live")} <ExternalLink size={16} className="ml-2" />
                            </a>
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full text-zinc-500 hover:text-white uppercase text-[10px] font-bold tracking-widest mt-4"
                            asChild
                        >
                            <Link href="/">{t("return_dashboard")}</Link>
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

interface SpecCardProps {
    label: string;
    value: string | undefined | null;
    icon: React.ReactNode;
    color?: string;
}

function SpecCard({ label, value, icon, color = "text-white" }: SpecCardProps) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-2">
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                {icon}
                {label}
            </div>
            <div className={`text-sm font-bold truncate ${color}`}>{value}</div>
        </div>
    );
}
