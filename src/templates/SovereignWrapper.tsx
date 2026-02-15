"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { SiteBlueprint, Section } from "@/lib/schemas";
import { useTranslations } from "next-intl";
import styles from "@/styles/isolation.module.css";
import { Shield, CloudCheck, HardDrive, TrendingUp, LucideIcon } from "lucide-react";
import { ComponentLibrary } from "@/components/engine/ComponentLibrary";

interface SovereignWrapperProps {
    children?: (props: {
        settings: {
            primaryColor: string;
            secondaryColor: string;
            fontFamily: string;
            [key: string]: any;
        };
        blueprint: SiteBlueprint | null;
        onOpen: (title: string) => void;
        pulse: number;
        primary: string;
        secondary: string;
        meta?: { id: string; name: string };
    }) => React.ReactNode;
    meta?: { id: string; name: string };
}

/**
 * SOVEREIGN WRAPPER (Structural Hardening)
 * Centralizes hook logic and serves as the Layout Orchestrator's execution environment.
 */
export default function SovereignWrapper({ children, meta }: SovereignWrapperProps) {
    const t = useTranslations("wrapper");
    const { settings, blueprint, updatePulse: pulse } = useTemplateEditor();
    const modal = useLaunchModal();

    // Contextual Open Logic
    const handleOpen = (title: string) => {
        modal.onOpen(title, meta);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pulse}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={styles.canvasRoot}
                style={{ fontFamily: settings.fontFamily }}
            >
                {/* PERSISTENCE HUB: ARCHITECTURAL STATUS BAR */}
                <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center gap-3 px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-2xl pointer-events-auto cursor-help"
                        title="Quantum Shield Active"
                    >
                        <Shield className="w-3 h-3 text-blue-400" />
                        <span>{t("shield")}</span>
                    </motion.div>

                    {blueprint && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-3 px-4 py-2 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-green-400 shadow-2xl"
                        >
                            <CloudCheck className="w-3 h-3" />
                            <span>{t("sync")}</span>
                        </motion.div>
                    )}

                    {blueprint?.economic_impact && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="flex items-center gap-3 px-4 py-2 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 shadow-2xl"
                        >
                            <TrendingUp className="w-3 h-3" />
                            <span>{t("asset_valuation")}: {blueprint.economic_impact.estimated_savings}</span>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 px-4 py-2 bg-purple-500/10 backdrop-blur-md border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-400 shadow-2xl"
                    >
                        <HardDrive className="w-3 h-3" />
                        <span>{t("state_persistent")}</span>
                    </motion.div>
                </div>

                {/* 
                  SOVEREIGN RENDER PROTOCOL:
                  If a template (children) is provided, it handles the core aesthetic.
                  We then automatically inject "Strategic Sections" that the hardcoded template 
                  cannot interpret (CINEMATIC_VIDEO, SMART_FORM, etc.)
                */}
                {children ? (
                    <>
                        {children({
                            settings,
                            blueprint,
                            onOpen: handleOpen,
                            pulse,
                            primary: settings.primaryColor,
                            secondary: settings.secondaryColor,
                            meta
                        })}

                        {/* STRATEGIC AUTO-INJECTION CIRCUIT */}
                        {blueprint && (
                            <div className="sovereign-injections">
                                {blueprint.layout.map((section: Section) => {
                                    // Logic: Only auto-inject specialized types to avoid cluttering core aesthetic
                                    const specializedTypes = [
                                        'CINEMATIC_VIDEO',
                                        'SMART_FORM',
                                        'APPOINTMENT_WIDGET',
                                        'LIVE_PRICING',
                                        'LEGAL_NOTICE',
                                        'COUNTDOWN_LOGIC'
                                    ];

                                    if (specializedTypes.includes(section.type)) {
                                        return <BlueprintSectionRenderer key={section.id} section={section} storeId={meta?.id} />;
                                    }
                                    return null;
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    blueprint && (
                        <div className="blueprint-composition-root">
                            {blueprint.layout.map((section: Section) => (
                                <BlueprintSectionRenderer key={section.id} section={section} storeId={meta?.id} />
                            ))}
                        </div>
                    )
                )}
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * BLUEPRINT SECTION RENDERER
 * The bridge between JSON logic and React UI.
 * Now utilizing the unified ComponentLibrary for high-fidelity output.
 */
function BlueprintSectionRenderer({ section, storeId }: { section: Section, storeId?: string }) {
    const { settings } = useTemplateEditor();
    const primaryColor = settings.primaryColor || '#3b82f6';

    // Logic: Unify all rendering under the massive ComponentLibrary logic
    return (
        <div key={section.id} className="relative">
            <ComponentLibrary
                id={section.id}
                type={section.type}
                content={section.content}
                primaryColor={primaryColor}
                isEditable={false} // Wrapper is for end-user preview/live
                storeId={storeId}
            />
        </div>
    );
}

// STUB DYNAMIC COMPONENTS (To be expanded in later sub-phases)
function DynamicHero({ content }: { content: Record<string, any> }) {
    return (
        <section className="py-24 px-6 md:px-10 text-center max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-foreground">{content.headline}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">{content.subheadline}</p>
            {content.cta && (
                <button className="mt-8 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform">
                    {content.cta}
                </button>
            )}
        </section>
    );
}

function DynamicFeatures({ content }: { content: Record<string, any> }) {
    return (
        <section className="py-24 px-6 md:px-10 bg-slate-50">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {content.items?.map((item: Record<string, any>, i: number) => (
                    <div key={i} className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg mb-6 flex items-center justify-center text-blue-600 font-bold">
                            {i + 1}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function DynamicAbout({ content }: { content: Record<string, any> }) {
    const t = useTranslations("wrapper");
    return (
        <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="aspect-square bg-slate-200 rounded-3xl overflow-hidden relative">
                    {/* Placeholder for real image integration */}
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold tracking-widest">
                        RENAISSANCE_IMAGE
                    </div>
                </div>
                <div>
                    <h2 className="text-4xl font-bold mb-6 text-slate-900">{content.title || t("our_story")}</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                        {content.description}
                    </p>
                    <div className="flex gap-8 border-t border-slate-100 pt-8">
                        <div>
                            <div className="text-3xl font-black text-slate-900">{content.stat1_value || "100%"}</div>
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{content.stat1_label || t("success")}</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">{content.stat2_value || "24/7"}</div>
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{content.stat2_label || t("support")}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function DynamicPricing({ content }: { content: Record<string, any> }) {
    const t = useTranslations("wrapper");
    return (
        <section className="py-24 px-6 md:px-10 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">{content.title || t("pricing_title")}</h2>
                    <p className="text-slate-400">{content.subtitle || t("pricing_subtitle")}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {content.plans?.map((plan: any, i: number) => (
                        <div key={i} className={`p-8 rounded-3xl border ${plan.featured ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700'}`}>
                            <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                            <div className="text-4xl font-black mb-6">{plan.price}</div>
                            <ul className="space-y-4 mb-8">
                                {plan.features?.map((feat: string, j: number) => (
                                    <li key={j} className="flex items-center gap-3 text-sm opacity-80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                                {t("select_plan")}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function DynamicContact({ content }: { content: Record<string, any> }) {
    const t = useTranslations("wrapper");
    return (
        <section className="py-24 px-6 md:px-10 max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">{content.title || t("get_in_touch")}</h2>
            <p className="text-xl text-slate-600 mb-10">{content.description || t("contact_desc")}</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <input type="email" placeholder={t("enter_email")} className="px-6 py-4 rounded-xl border border-slate-200 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                <button className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">
                    {t("contact_us")}
                </button>
            </div>
        </section>
    );
}
