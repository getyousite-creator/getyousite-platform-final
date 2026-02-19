"use client";

import React from "react";
import { motion } from "framer-motion";
import { ComponentLibrary } from "@/components/engine/ComponentLibrary";
import { SiteBlueprint } from "@/lib/schemas";
import { useSovereignAnalytics } from "@/hooks/use-sovereign-analytics";

interface AtomicRendererProps {
    blueprint: SiteBlueprint;
    meta?: { id: string; name: string };
    selectedPageSlug?: string;
}

type NavLink = { label?: string; href?: string };
type RenderSection = { id?: string; type?: string; content?: Record<string, unknown> };

export default function AtomicRenderer({
    blueprint,
    meta,
    selectedPageSlug = "index",
}: AtomicRendererProps) {
    // IGNITION: Start Sovereign Analytics Loop
    useSovereignAnalytics(meta?.id);

    if (!blueprint) return null;

    const primaryColor = blueprint.theme?.primary || "#3b82f6";
    const bgColor = blueprint.theme?.backgroundColor || "#ffffff";
    const textColor = blueprint.theme?.textColor || "#000000";

    // Extract layout based on selected page
    let activeLayout = blueprint.layout || [];
    if (blueprint.pages && blueprint.pages[selectedPageSlug]) {
        activeLayout = blueprint.pages[selectedPageSlug].layout || [];
    }

    const getAnchorFromSection = (section: RenderSection, index: number) => {
        if (section?.content?.anchor && typeof section.content.anchor === "string") {
            return section.content.anchor;
        }
        const map: Record<string, string> = {
            hero: "home",
            HERO_PRIME: "home",
            FEATURE_GRID: "services",
            features: "services",
            services: "services",
            pricing: "pricing",
            PRICE_ENGINE: "pricing",
            LIVE_PRICING: "pricing",
            contact: "contact",
            SMART_FORM: "contact",
            testimonials: "testimonials",
            gallery: "gallery",
            faq: "faq",
            cta: "pricing",
        };
        const sectionType = section?.type || "";
        return map[sectionType] || `section-${index + 1}`;
    };

    return (
        <div
            className="min-h-screen transition-colors duration-500"
            style={
                {
                    "--primary-color": primaryColor,
                    backgroundColor: bgColor,
                    color: textColor,
                    direction: blueprint.metadata?.direction || "rtl",
                } as React.CSSProperties
            }
        >
            {/* 1. SOVEREIGN NAVIGATION */}
            <header className="sticky top-0 z-[100] bg-background/80 backdrop-blur-2xl border-b border-white/5">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div
                        className="font-black text-2xl tracking-tighter"
                        style={{ color: primaryColor }}
                    >
                        {blueprint.navigation?.logo || blueprint.name}
                    </div>
                    <ul className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.3em] opacity-60">
                        {blueprint.navigation?.links?.map((link: NavLink, i: number) => (
                            <li
                                key={i}
                                className="hover:text-primary transition-colors cursor-pointer"
                            >
                                <a href={link.href || "#home"}>{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            {/* 2. ATOMIC SECTION STACK */}
            <main>
                {activeLayout.map((section: RenderSection, index: number) => (
                    <motion.section
                        key={section.id || index}
                        id={getAnchorFromSection(section, index)}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px", amount: 0.1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative overflow-hidden"
                    >
                        <ComponentLibrary
                            id={section.id}
                            type={section.type || "hero"}
                            content={section.content || {}}
                            primaryColor={primaryColor}
                            backgroundColor={bgColor}
                            textColor={textColor}
                            isEditable={!!blueprint.id}
                            priority={index === 0}
                        />
                    </motion.section>
                ))}
            </main>

            {/* 3. SOVEREIGN FOOTER */}
            <footer className="py-24 bg-black/5 border-t border-white/5 text-center">
                <div className="container mx-auto px-6">
                    <div className="mb-12 flex justify-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] opacity-40">
                        {blueprint.footer?.links?.map((link: NavLink, i: number) => (
                            <a
                                key={i}
                                href={link.href || "#"}
                                className="hover:text-primary transition-colors cursor-pointer"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <p className="text-[10px] uppercase font-black tracking-[0.5em] opacity-20">
                        {blueprint.footer?.copyright ||
                            `© 2026 ${blueprint.name} - Atomic Sovereign Build`}
                    </p>
                </div>
            </footer>
        </div>
    );
}
