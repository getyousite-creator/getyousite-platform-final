/**
 * Design System Documentation Page
 * 
 * Single Source of Truth for GetYouSite Visual Identity
 * Displays all colors, typography, buttons, cards, and loading states
 */

"use client";

import React from "react";
import {
    SOVEREIGN_COLORS,
    SOVEREIGN_COLORS_LIGHT,
    GRADIENT_PRESETS,
    validateSovereignPalette,
} from "@/lib/design-system/sovereign-colors";
import {
    TYPOGRAPHY_CONFIG,
    generateGoldenRatioScale,
} from "@/lib/design-system/typography-engine";
import {
    SovereignButton,
    SovereignCard,
    SovereignBadge,
    LoadingSpinner,
} from "@/lib/design-system/atomic-components";
import {
    FadeIn,
    Magnetic,
    HoverScale,
} from "@/lib/design-system/micro-interactions";

// ============================================================================
// MAIN DOCUMENTATION COMPONENT
// ============================================================================

export default function DesignSystemDocs() {
    const wcagResults = validateSovereignPalette();

    return (
        <div className="min-h-screen bg-neutral-obsidian text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-12">
                    <FadeIn direction="up">
                        <h1 className="text-5xl font-bold mb-4 bg-grad-premium bg-clip-text text-transparent">
                            GetYouSite Design System
                        </h1>
                        <p className="text-xl text-neutral-slate">
                            Visual Identity Protocol - Emerald Cyber-Noir
                        </p>
                        <p className="text-sm text-neutral-light mt-2">
                            Single Source of Truth - v1.0
                        </p>
                    </FadeIn>
                </header>

                {/* Color Palette */}
                <section className="mb-12">
                    <FadeIn direction="up" delay={0.1}>
                        <h2 className="text-3xl font-bold mb-6">Color Palette</h2>
                    </FadeIn>

                    {/* Primary Colors */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Primary - Emerald</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <ColorSwatch
                                name="Deep"
                                value={SOVEREIGN_COLORS.primary.deep}
                                usage="Primary backgrounds, deep emphasis"
                            />
                            <ColorSwatch
                                name="DEFAULT"
                                value={SOVEREIGN_COLORS.primary.DEFAULT}
                                usage="Primary buttons, links"
                            />
                            <ColorSwatch
                                name="Light"
                                value={SOVEREIGN_COLORS.primary.light}
                                usage="Hover states, highlights"
                            />
                        </div>
                    </div>

                    {/* Accent Colors */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Accent - Electric Lime</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <ColorSwatch
                                name="Neon"
                                value={SOVEREIGN_COLORS.accent.neon}
                                usage="CTAs, highlights, glow effects"
                            />
                            <ColorSwatch
                                name="DEFAULT"
                                value={SOVEREIGN_COLORS.accent.DEFAULT}
                                usage="Secondary actions"
                            />
                            <ColorSwatch
                                name="Dim"
                                value={SOVEREIGN_COLORS.accent.dim}
                                usage="Subtle accents"
                            />
                        </div>
                    </div>

                    {/* Neutral Colors */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Neutral - Volcanic Black</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <ColorSwatch
                                name="Obsidian"
                                value={SOVEREIGN_COLORS.neutral.obsidian}
                                usage="Dark backgrounds"
                            />
                            <ColorSwatch
                                name="DEFAULT"
                                value={SOVEREIGN_COLORS.neutral.DEFAULT}
                                usage="Primary surfaces"
                            />
                            <ColorSwatch
                                name="Light"
                                value={SOVEREIGN_COLORS.neutral.light}
                                usage="Elevated surfaces"
                            />
                            <ColorSwatch
                                name="Slate"
                                value={SOVEREIGN_COLORS.neutral.slate}
                                usage="Borders, dividers"
                            />
                        </div>
                    </div>

                    {/* Gradients */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Gradients</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {GRADIENT_PRESETS.map((gradient) => (
                                <GradientSwatch
                                    key={gradient.name}
                                    name={gradient.name}
                                    value={gradient.value}
                                    usage={gradient.usage}
                                />
                            ))}
                        </div>
                    </div>

                    {/* WCAG Results */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">WCAG 2.1 Compliance</h3>
                        <SovereignCard variant="elevated" padding="lg">
                            <div className="space-y-2">
                                {wcagResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-sm">
                                            {result.foreground} on {result.background}
                                        </span>
                                        <SovereignBadge
                                            variant={
                                                result.level === "AAA"
                                                    ? "success"
                                                    : result.level === "AA"
                                                    ? "info"
                                                    : "error"
                                            }
                                        >
                                            {result.level} ({result.ratio.toFixed(2)}:1)
                                        </SovereignBadge>
                                    </div>
                                ))}
                            </div>
                        </SovereignCard>
                    </div>
                </section>

                {/* Typography */}
                <section className="mb-12">
                    <FadeIn direction="up" delay={0.2}>
                        <h2 className="text-3xl font-bold mb-6">Typography</h2>
                    </FadeIn>

                    {/* Font Families */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Font Families</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <SovereignCard variant="elevated" padding="lg">
                                <h4 className="font-bold mb-2">English</h4>
                                <p className="text-sm text-neutral-slate mb-2">
                                    Headings: {TYPOGRAPHY_CONFIG.headingFont.name}
                                </p>
                                <p className="text-sm text-neutral-slate">
                                    Body: {TYPOGRAPHY_CONFIG.bodyFont.name}
                                </p>
                            </SovereignCard>
                            <SovereignCard variant="elevated" padding="lg">
                                <h4 className="font-bold mb-2">Arabic</h4>
                                <p className="text-sm text-neutral-slate mb-2">
                                    Headings: {TYPOGRAPHY_CONFIG.arabicHeadingFont.name}
                                </p>
                                <p className="text-sm text-neutral-slate">
                                    Body: {TYPOGRAPHY_CONFIG.arabicBodyFont.name}
                                </p>
                            </SovereignCard>
                        </div>
                    </div>

                    {/* Typography Scale */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">
                            Golden Ratio Scale (φ ≈ 1.618)
                        </h3>
                        <SovereignCard variant="elevated" padding="lg">
                            <div className="space-y-4">
                                {Object.entries(generateGoldenRatioScale(16)).map(
                                    ([size, value]) => (
                                        <div
                                            key={size}
                                            className="flex items-center justify-between"
                                        >
                                            <span className="text-neutral-slate">{size}</span>
                                            <span
                                                className="text-neutral-light"
                                                style={{ fontSize: value }}
                                            >
                                                {value}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </SovereignCard>
                    </div>
                </section>

                {/* Buttons */}
                <section className="mb-12">
                    <FadeIn direction="up" delay={0.3}>
                        <h2 className="text-3xl font-bold mb-6">Buttons</h2>
                    </FadeIn>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Variants</h3>
                        <div className="flex flex-wrap gap-4">
                            <Magnetic>
                                <SovereignButton variant="primary">Primary</SovereignButton>
                            </Magnetic>
                            <Magnetic>
                                <SovereignButton variant="secondary">Secondary</SovereignButton>
                            </Magnetic>
                            <Magnetic>
                                <SovereignButton variant="accent" glow>
                                    Accent (Glow)
                                </SovereignButton>
                            </Magnetic>
                            <Magnetic>
                                <SovereignButton variant="ghost">Ghost</SovereignButton>
                            </Magnetic>
                            <Magnetic>
                                <SovereignButton variant="outline">Outline</SovereignButton>
                            </Magnetic>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Sizes</h3>
                        <div className="flex flex-wrap items-center gap-4">
                            <SovereignButton size="sm">Small</SovereignButton>
                            <SovereignButton size="md">Medium</SovereignButton>
                            <SovereignButton size="lg">Large</SovereignButton>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Loading State</h3>
                        <div className="flex gap-4">
                            <SovereignButton loading>Loading</SovereignButton>
                            <SovereignButton loading variant="accent">
                                Loading
                            </SovereignButton>
                        </div>
                    </div>
                </section>

                {/* Cards */}
                <section className="mb-12">
                    <FadeIn direction="up" delay={0.4}>
                        <h2 className="text-3xl font-bold mb-6">Cards</h2>
                    </FadeIn>

                    <div className="grid grid-cols-3 gap-6">
                        <HoverScale>
                            <SovereignCard variant="default" padding="lg">
                                <h4 className="font-bold mb-2">Default</h4>
                                <p className="text-sm text-neutral-slate">
                                    Standard card with border
                                </p>
                            </SovereignCard>
                        </HoverScale>
                        <HoverScale>
                            <SovereignCard variant="elevated" padding="lg">
                                <h4 className="font-bold mb-2">Elevated</h4>
                                <p className="text-sm text-neutral-slate">
                                    With shadow for depth
                                </p>
                            </SovereignCard>
                        </HoverScale>
                        <HoverScale>
                            <SovereignCard variant="frosted" padding="lg">
                                <h4 className="font-bold mb-2">Frosted Glass</h4>
                                <p className="text-sm text-neutral-slate">
                                    Backdrop blur effect
                                </p>
                            </SovereignCard>
                        </HoverScale>
                    </div>
                </section>

                {/* Badges */}
                <section className="mb-12">
                    <FadeIn direction="up" delay={0.5}>
                        <h2 className="text-3xl font-bold mb-6">Badges</h2>
                    </FadeIn>

                    <div className="flex flex-wrap gap-4">
                        <SovereignBadge variant="default">Default</SovereignBadge>
                        <SovereignBadge variant="success">Success</SovereignBadge>
                        <SovereignBadge variant="warning">Warning</SovereignBadge>
                        <SovereignBadge variant="error">Error</SovereignBadge>
                        <SovereignBadge variant="info">Info</SovereignBadge>
                        <SovereignBadge variant="accent">Accent</SovereignBadge>
                    </div>
                </section>

                {/* Loading States */}
                <section className="mb-12">
                    <FadeIn direction="up" delay={0.6}>
                        <h2 className="text-3xl font-bold mb-6">Loading States</h2>
                    </FadeIn>

                    <div className="flex gap-6 items-center">
                        <div className="flex flex-col items-center gap-2">
                            <LoadingSpinner size={20} />
                            <span className="text-xs text-neutral-slate">Small (20px)</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <LoadingSpinner size={32} />
                            <span className="text-xs text-neutral-slate">Medium (32px)</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <LoadingSpinner size={48} />
                            <span className="text-xs text-neutral-slate">Large (48px)</span>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-neutral-slate/20 pt-8 mt-12">
                    <p className="text-sm text-neutral-slate">
                        GetYouSite Design System v1.0 - Emerald Cyber-Noir
                    </p>
                    <p className="text-xs text-neutral-light mt-2">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </footer>
            </div>
        </div>
    );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface ColorSwatchProps {
    name: string;
    value: string;
    usage: string;
}

function ColorSwatch({ name, value, usage }: ColorSwatchProps) {
    return (
        <SovereignCard variant="elevated" padding="none" className="overflow-hidden">
            <div
                className="h-24 w-full"
                style={{ backgroundColor: value }}
            />
            <div className="p-4">
                <h4 className="font-bold text-sm">{name}</h4>
                <p className="text-xs text-neutral-slate font-mono mt-1">{value}</p>
                <p className="text-xs text-neutral-light mt-2">{usage}</p>
            </div>
        </SovereignCard>
    );
}

interface GradientSwatchProps {
    name: string;
    value: string;
    usage: string;
}

function GradientSwatch({ name, value, usage }: GradientSwatchProps) {
    return (
        <SovereignCard variant="elevated" padding="none" className="overflow-hidden">
            <div
                className="h-24 w-full"
                style={{ background: value }}
            />
            <div className="p-4">
                <h4 className="font-bold text-sm">{name}</h4>
                <p className="text-xs text-neutral-light mt-2">{usage}</p>
            </div>
        </SovereignCard>
    );
}
