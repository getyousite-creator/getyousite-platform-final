"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LivePreview } from "@/components/engine/LivePreview";
import { SITE_TEMPLATES } from "@/lib/templates";
import { SiteBlueprint } from "@/lib/schemas";
import { useLocale } from "next-intl";
import { applyPersonaMicrocopy } from "@/lib/ai/persona-microcopy";
import TrustLayer from "@/components/trust/TrustLayer";
import { trackExperimentEvent } from "@/lib/analytics/experiment-tracker";

const TRIAL_SECONDS = 5 * 60;
type ExperimentVariant = "control" | "trust_first";

function pickExperimentVariant(seed: string): ExperimentVariant {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) % 9973;
    }
    return hash % 2 === 0 ? "control" : "trust_first";
}

function cloneBlueprint(blueprint: SiteBlueprint): SiteBlueprint {
    return JSON.parse(JSON.stringify(blueprint)) as SiteBlueprint;
}

function applyEdits(
    base: SiteBlueprint,
    edits: {
        headline: string;
        subheadline: string;
        primaryColor: string;
        businessContext: string;
        locale: string;
    },
): SiteBlueprint {
    const next = cloneBlueprint(base);

    next.theme.primary = edits.primaryColor;
    next.theme.accent = edits.primaryColor;

    const heroSection = next.layout.find(
        (section) => section.type === "hero" || section.type === "HERO_PRIME",
    );
    if (heroSection) {
        heroSection.content.headline = edits.headline;
        heroSection.content.subheadline = edits.subheadline;
    }

    return applyPersonaMicrocopy(
        next,
        {
            businessName: edits.businessContext.split(" ").slice(0, 3).join(" ") || "My Brand",
            niche: edits.businessContext,
            vision: edits.businessContext,
        },
        edits.locale,
    );
}

function formatTimer(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function PlaygroundTemplatePage() {
    const params = useParams();
    const router = useRouter();
    const locale = useLocale();
    const templateId = params.templateId as string;

    const themes = SITE_TEMPLATES.categories.flatMap((category) => category.themes);
    const selectedTheme = themes.find((theme) => theme.id === templateId);
    const baseBlueprint = selectedTheme?.blueprint || themes[0]?.blueprint;
    const initialHeroSection = baseBlueprint?.layout.find(
        (section) => section.type === "hero" || section.type === "HERO_PRIME",
    );
    const initialHeadline = String(
        initialHeroSection?.content.headline || "Welcome to your new site",
    ).trim();
    const initialSubheadline = String(
        initialHeroSection?.content.subheadline || "Edit this text and make it yours in seconds.",
    ).trim();

    const [remainingSeconds, setRemainingSeconds] = useState(TRIAL_SECONDS);
    const [headline, setHeadline] = useState(initialHeadline);
    const [subheadline, setSubheadline] = useState(initialSubheadline);
    const [primaryColor, setPrimaryColor] = useState(selectedTheme?.primaryColor || "#22d3ee");
    const [businessContext, setBusinessContext] = useState("");

    const expiryTrackedRef = useRef(false);
    const isTrialExpired = remainingSeconds <= 0;
    const experimentVariant = useMemo<ExperimentVariant>(
        () => pickExperimentVariant(`${templateId}:${locale}`),
        [templateId, locale],
    );

    useEffect(() => {
        trackExperimentEvent({
            experimentKey: "exp_playground_cta_v1",
            eventName: "funnel_playground_editor_open",
            variant: experimentVariant,
            locale,
            templateId: templateId,
        });
    }, [experimentVariant, locale, templateId]);

    useEffect(() => {
        trackExperimentEvent({
            experimentKey: "exp_playground_cta_v1",
            eventName: "exp_playground_cta_v1_exposure",
            variant: experimentVariant,
            locale,
            templateId: templateId,
        });
    }, [experimentVariant, locale, templateId]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingSeconds((value) => (value > 0 ? value - 1 : 0));
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (!isTrialExpired || expiryTrackedRef.current) return;
        expiryTrackedRef.current = true;

        trackExperimentEvent({
            experimentKey: "exp_playground_cta_v1",
            eventName: "exp_playground_cta_v1_expired",
            variant: experimentVariant,
            locale,
            templateId: templateId,
        });
    }, [isTrialExpired, experimentVariant, locale, templateId]);

    const previewBlueprint = useMemo(() => {
        if (!baseBlueprint) return null;
        return applyEdits(baseBlueprint, {
            headline,
            subheadline,
            primaryColor,
            businessContext,
            locale,
        });
    }, [baseBlueprint, headline, subheadline, primaryColor, businessContext, locale]);

    const ctaLabel = isTrialExpired
        ? "Sign up to continue"
        : experimentVariant === "trust_first"
          ? "Secure and Publish"
          : "Publish Website";

    const helperText = isTrialExpired
        ? "Trial ended. Sign up to keep editing and publish."
        : experimentVariant === "trust_first"
          ? "Trust and security checks are ready for launch."
          : "No signup required during trial. Signup is requested at publish.";

    if (!previewBlueprint) {
        return (
            <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
                Template not found.
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#020617] text-white p-3 sm:p-4 md:p-8">
            <div className="h-full grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
                <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/playground")}
                        className="text-white/80 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to templates
                    </Button>

                    <div className="flex items-center justify-between rounded-2xl bg-cyan-500/10 border border-cyan-400/30 px-4 py-3">
                        <span className="text-sm font-bold">Trial time</span>
                        <span className="text-sm font-black flex items-center gap-2">
                            <Timer className="w-4 h-4" />
                            {formatTimer(remainingSeconds)}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white/80">Business context</label>
                        <Input
                            value={businessContext}
                            disabled={isTrialExpired}
                            onChange={(event) => setBusinessContext(event.target.value)}
                            className="bg-[#0b1222] border-white/20 disabled:opacity-50"
                            placeholder="Example: modern dental clinic in Rabat"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white/80">Main headline</label>
                        <Input
                            value={headline}
                            disabled={isTrialExpired}
                            onChange={(event) => setHeadline(event.target.value)}
                            className="bg-[#0b1222] border-white/20 disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white/80">Subheadline</label>
                        <Input
                            value={subheadline}
                            disabled={isTrialExpired}
                            onChange={(event) => setSubheadline(event.target.value)}
                            className="bg-[#0b1222] border-white/20 disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white/80">Primary color</label>
                        <input
                            type="color"
                            value={primaryColor}
                            disabled={isTrialExpired}
                            onChange={(event) => setPrimaryColor(event.target.value)}
                            className="w-full h-11 rounded-xl border border-white/20 bg-transparent cursor-pointer disabled:opacity-50"
                        />
                    </div>

                    {experimentVariant === "trust_first" && <TrustLayer compact locale={locale} />}

                    <Button
                        onClick={() => {
                            trackExperimentEvent({
                                experimentKey: "exp_playground_cta_v1",
                                eventName: "funnel_playground_publish_clicked",
                                variant: experimentVariant,
                                locale,
                                templateId: templateId,
                                intent: "publish",
                                metadata: { expired: isTrialExpired },
                            });
                            router.push(
                                `/signup?intent=publish&template=${templateId}&variant=${experimentVariant}`,
                            );
                        }}
                        className={`w-full h-12 font-black ${
                            experimentVariant === "trust_first"
                                ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                                : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                        }`}
                    >
                        {ctaLabel}
                    </Button>

                    <p className="text-xs text-white/60">{helperText}</p>

                    {experimentVariant === "control" && <TrustLayer compact locale={locale} />}
                </aside>

                <section className="rounded-3xl border border-white/10 bg-white overflow-hidden min-h-[70vh]">
                    <LivePreview config={previewBlueprint} isGenerating={false} />
                </section>
            </div>
        </main>
    );
}
