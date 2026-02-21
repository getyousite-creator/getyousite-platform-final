/**
 * Switching Preview - Live AI-Generated Site Showcase
 * 
 * Rotates through 3 different niche examples every 5 seconds:
 * 1. Restaurant (La Trattoria)
 * 2. Technology (Nexus AI)
 * 3. E-commerce (Luxe Boutique)
 * 
 * Demonstrates GetYouSite's versatility across industries
 */

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface Preview {
    id: string;
    niche: string;
    title: string;
    description: string;
    color: string;
    cta: string;
}

const PREVIEWS: Preview[] = [
    {
        id: 'restaurant',
        niche: 'Restaurant & Dining',
        title: 'La Trattoria',
        description: 'Authentic Italian cuisine in the heart of Riyadh',
        color: '#EA580C', // Burnt Orange
        cta: 'View Menu',
    },
    {
        id: 'tech',
        niche: 'Technology & SaaS',
        title: 'Nexus AI',
        description: 'Next-generation AI solutions for enterprise',
        color: '#7C3AED', // Deep Purple
        cta: 'Start Free Trial',
    },
    {
        id: 'store',
        niche: 'E-commerce & Retail',
        title: 'Luxe Boutique',
        description: 'Premium fashion for the modern individual',
        color: '#DC2626', // Red
        cta: 'Shop Now',
    },
];

export function SwitchingPreview() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

    // Auto-rotate every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % PREVIEWS.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const currentPreview = PREVIEWS[currentIndex];

    const getWidth = () => {
        switch (device) {
            case 'mobile': return '375px';
            case 'tablet': return '768px';
            default: return '100%';
        }
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto mt-12">
            {/* Device Controls */}
            <div className="flex justify-center gap-2 mb-4">
                <button
                    onClick={() => setDevice('mobile')}
                    className={`p-2 rounded-lg transition-all ${
                        device === 'mobile'
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                    aria-label="Mobile view"
                >
                    <Smartphone className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setDevice('tablet')}
                    className={`p-2 rounded-lg transition-all ${
                        device === 'tablet'
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                    aria-label="Tablet view"
                >
                    <Tablet className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setDevice('desktop')}
                    className={`p-2 rounded-lg transition-all ${
                        device === 'desktop'
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                    aria-label="Desktop view"
                >
                    <Monitor className="w-4 h-4" />
                </button>
            </div>

            {/* Preview Frame */}
            <motion.div
                animate={{ width: getWidth() }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="mx-auto"
            >
                <div className="relative bg-neutral-900 rounded-[2rem] overflow-hidden shadow-2xl border-8 border-neutral-800">
                    {/* Browser Chrome */}
                    <div className="h-8 bg-neutral-800 border-b border-neutral-700 flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-1 text-center">
                            <div className="inline-block px-3 py-0.5 bg-neutral-700 rounded text-[10px] text-neutral-400">
                                {currentPreview.title.toLowerCase().replace(' ', '')}.getyousite.com
                            </div>
                        </div>
                    </div>

                    {/* Preview Content */}
                    <div
                        className="p-8 transition-colors duration-500"
                        style={{ backgroundColor: `${currentPreview.color}10` }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPreview.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="text-center py-12"
                            >
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-4xl font-black mb-4"
                                    style={{ color: currentPreview.color }}
                                >
                                    {currentPreview.title}
                                </motion.div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-neutral-400 mb-8"
                                >
                                    {currentPreview.description}
                                </motion.p>
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-3 rounded-full font-bold text-white shadow-lg"
                                    style={{ backgroundColor: currentPreview.color }}
                                >
                                    {currentPreview.cta}
                                </motion.button>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Progress Indicator */}
                    <div className="absolute bottom-4 right-4 flex gap-1">
                        {PREVIEWS.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? 'w-8 bg-primary'
                                        : 'w-2 bg-neutral-600'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Niche Labels */}
            <div className="flex justify-center gap-3 mt-6">
                {PREVIEWS.map((preview, index) => (
                    <button
                        key={preview.id}
                        onClick={() => setCurrentIndex(index)}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                            index === currentIndex
                                ? 'bg-primary text-white'
                                : 'bg-white/5 text-neutral-400 hover:text-white'
                        }`}
                        aria-label={`Show ${preview.niche} preview`}
                    >
                        {preview.niche}
                    </button>
                ))}
            </div>

            {/* Social Proof Text */}
            <p className="text-center text-neutral-400 text-sm mt-6">
                <span className="text-accent-neon font-bold">+5,200</span> sites built this week alone
            </p>
        </div>
    );
}
