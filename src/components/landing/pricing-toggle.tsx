/**
 * Pricing Toggle - Monthly/Yearly Billing Switch
 * 
 * Smooth animated toggle with Framer Motion
 * Updates pricing display with attractive animation
 * Full accessibility support with aria-labels
 */

"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingToggleProps {
    onToggle?: (isYearly: boolean) => void;
    defaultYearly?: boolean;
}

export function PricingToggle({ onToggle, defaultYearly = false }: PricingToggleProps) {
    const [isYearly, setIsYearly] = useState(defaultYearly);

    const handleToggle = () => {
        const newValue = !isYearly;
        setIsYearly(newValue);
        onToggle?.(newValue);
    };

    return (
        <div className="flex items-center justify-center gap-4 mb-8" role="group" aria-label="Billing period toggle">
            <span
                className={`text-sm font-medium transition-colors ${
                    !isYearly ? 'text-white' : 'text-neutral-400'
                }`}
            >
                Monthly
            </span>
            
            <button
                onClick={handleToggle}
                className="relative w-14 h-8 bg-neutral-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-neutral-900"
                role="switch"
                aria-checked={isYearly}
                aria-label={`Switch to ${isYearly ? 'monthly' : 'yearly'} billing`}
            >
                <motion.div
                    className="absolute top-1 left-1 w-6 h-6 bg-accent-neon rounded-full shadow-lg"
                    animate={{
                        x: isYearly ? 24 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        mass: 0.5,
                    }}
                />
            </button>
            
            <span
                className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                    isYearly ? 'text-white' : 'text-neutral-400'
                }`}
            >
                Yearly
                <AnimatePresence>
                    {isYearly && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-xs text-accent-neon font-bold bg-accent-neon/10 px-2 py-0.5 rounded-full"
                        >
                            Save 20%
                        </motion.span>
                    )}
                </AnimatePresence>
            </span>
        </div>
    );
}

interface PricingCardProps {
    title: string;
    price: number;
    description: string;
    features: string[];
    cta: string;
    highlighted?: boolean;
    isYearly?: boolean;
}

export function PricingCard({
    title,
    price,
    description,
    features,
    cta,
    highlighted = false,
    isYearly = false,
}: PricingCardProps) {
    const displayPrice = isYearly ? Math.floor(price * 12 * 0.8) : price;
    const period = isYearly ? '/year' : '/month';

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative p-8 rounded-3xl border transition-all ${
                highlighted
                    ? 'bg-primary/10 border-primary shadow-[0_0_40px_rgba(5,150,105,0.3)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
        >
            {highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    Most Popular
                </div>
            )}

            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-neutral-400 text-sm mb-6">{description}</p>

            <div className="mb-6">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={isYearly ? 'yearly' : 'monthly'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-5xl font-black text-white"
                    >
                        ${displayPrice}
                    </motion.span>
                </AnimatePresence>
                <span className="text-neutral-400">{period}</span>
            </div>

            <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-neutral-300">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-full font-bold transition-all ${
                    highlighted
                        ? 'bg-primary text-white hover:shadow-[0_0_30px_rgba(5,150,105,0.5)]'
                        : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label={`${cta} - ${title} plan`}
            >
                {cta}
            </motion.button>
        </motion.div>
    );
}
