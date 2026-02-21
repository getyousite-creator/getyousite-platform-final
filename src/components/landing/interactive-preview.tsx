/**
 * Interactive Preview - Live AI-Generated Sites
 * 
 * Shows rotating preview of AI-generated websites
 * Changes every 5 seconds to showcase different niches
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Smartphone, Tablet } from "lucide-react";

interface SitePreview {
    id: string;
    niche: string;
    title: string;
    description: string;
    color: string;
}

const SITE_PREVIEWS: SitePreview[] = [
    {
        id: "restaurant",
        niche: "Restaurant",
        title: "La Trattoria",
        description: "Authentic Italian cuisine in the heart of Riyadh",
        color: "#EA580C",
    },
    {
        id: "tech",
        niche: "Technology",
        title: "Nexus AI",
        description: "Next-generation AI solutions for enterprise",
        color: "#7C3AED",
    },
    {
        id: "medical",
        niche: "Healthcare",
        title: "Smile Clinic",
        description: "Advanced dental care with modern technology",
        color: "#0284C7",
    },
    {
        id: "ecommerce",
        niche: "E-commerce",
        title: "Luxe Boutique",
        description: "Premium fashion for the modern individual",
        color: "#DC2626",
    },
    {
        id: "realestate",
        niche: "Real Estate",
        title: "Prime Properties",
        description: "Luxury homes and investment opportunities",
        color: "#78350F",
    },
];

interface InteractivePreviewProps {
    locale: string;
}

export function InteractivePreview({ locale }: InteractivePreviewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");

    // Auto-rotate previews every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SITE_PREVIEWS.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const currentSite = SITE_PREVIEWS[currentIndex];

    return (
        <section className="py-20 bg-obsidian/50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                        See AI in Action
                    </h2>
                    <p className="text-neutral-slate max-w-2xl mx-auto">
                        Watch as AI generates unique, professional websites for different industries
                    </p>
                </div>

                {/* Device Controls */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setDevice("mobile")}
                        className={`p-2 rounded-lg transition-all ${
                            device === "mobile"
                                ? "bg-primary text-white"
                                : "bg-white/5 text-neutral-slate hover:text-white"
                        }`}
                    >
                        <Smartphone className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setDevice("tablet")}
                        className={`p-2 rounded-lg transition-all ${
                            device === "tablet"
                                ? "bg-primary text-white"
                                : "bg-white/5 text-neutral-slate hover:text-white"
                        }`}
                    >
                        <Tablet className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setDevice("desktop")}
                        className={`p-2 rounded-lg transition-all ${
                            device === "desktop"
                                ? "bg-primary text-white"
                                : "bg-white/5 text-neutral-slate hover:text-white"
                        }`}
                    >
                        <Monitor className="w-5 h-5" />
                    </button>
                </div>

                {/* Preview Frame */}
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`
                            relative bg-white rounded-[2rem] overflow-hidden shadow-2xl
                            ${device === "mobile" ? "max-w-[375px] mx-auto aspect-[9/19.5]" : ""}
                            ${device === "tablet" ? "max-w-[768px] mx-auto aspect-[4/3]" : ""}
                            ${device === "desktop" ? "aspect-[16/10]" : ""}
                        `}
                    >
                        {/* Browser Chrome */}
                        <div className="h-8 bg-neutral-100 border-b border-neutral-200 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 text-center">
                                <div className="inline-block px-3 py-0.5 bg-white rounded text-[10px] text-neutral-500">
                                    {currentSite.title.toLowerCase().replace(" ", "")}.getyousite.com
                                </div>
                            </div>
                        </div>

                        {/* Preview Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSite.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="h-full p-8"
                                style={{ backgroundColor: `${currentSite.color}10` }}
                            >
                                <div className="text-center py-12">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-4xl font-black mb-4"
                                        style={{ color: currentSite.color }}
                                    >
                                        {currentSite.title}
                                    </motion.div>
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-neutral-600 mb-8"
                                    >
                                        {currentSite.description}
                                    </motion.p>
                                    <motion.button
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="px-6 py-3 rounded-full font-bold text-white"
                                        style={{ backgroundColor: currentSite.color }}
                                    >
                                        Get Started
                                    </motion.button>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Loading Indicator */}
                        <div className="absolute bottom-4 right-4 flex gap-1">
                            {SITE_PREVIEWS.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentIndex
                                            ? "bg-primary w-4"
                                            : "bg-neutral-300"
                                    }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Niche Labels */}
                <div className="flex justify-center gap-4 mt-8">
                    {SITE_PREVIEWS.map((site, index) => (
                        <button
                            key={site.id}
                            onClick={() => setCurrentIndex(index)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                index === currentIndex
                                    ? "bg-primary text-white"
                                    : "bg-white/5 text-neutral-slate hover:text-white"
                            }`}
                        >
                            {site.niche}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
