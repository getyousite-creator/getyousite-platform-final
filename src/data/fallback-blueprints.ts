/**
 * SOVEREIGN FALLBACK ARCHITECTURES
 * 
 * High-fidelity fallback data to ensure zero-degradation user experience 
 * during synthesis latency or network failure.
 */

import { Section } from "@/lib/schemas";

export const FALLBACK_IMAGES = {
    fitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
    restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    medical: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80",
    general: "https://images.unsplash.com/photo-1522204538344-922f76eba0a4?auto=format&fit=crop&w=1600&q=80",
};

export const FALLBACK_PROFILES = {
    fitness: {
        hero: "High-Performance Fitness Hub",
        services: [
            { title: "Flexible Monthly Membership", description: "Full access to gym and cardio with clear membership plans." },
            { title: "Personal Coaching", description: "1:1 coaching tailored to your transformation goal." },
            { title: "Nutrition Guidance", description: "Actionable meal guidance for steady progress." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
        ],
    },
    restaurant: {
        hero: "A Dining Experience Worth Repeating",
        services: [
            { title: "Seasonal Menu", description: "Fresh seasonal dishes with consistent premium quality." },
            { title: "Smart Reservations", description: "Fast booking flow designed to reduce wait time." },
            { title: "Private Events", description: "Host private events with complete hospitality support." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
        ],
    },
    medical: {
        hero: "Precision Care, Trusted Results",
        services: [
            { title: "Specialized Consultations", description: "Expert consultations with a clear treatment plan." },
            { title: "Fast Appointment Booking", description: "Direct booking with instant appointment confirmation." },
            { title: "Post-Visit Follow-Up", description: "Structured follow-up to ensure stable outcomes." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1631217868264-e6b90bb7e133?auto=format&fit=crop&w=900&q=80",
        ],
    },
    general: {
        hero: "Practical Solutions For Faster Growth",
        services: [
            { title: "Professional Service", description: "Tailored solutions focused on business outcomes." },
            { title: "Fast Execution", description: "Rapid implementation with production quality." },
            { title: "Continuous Support", description: "Operational support and continuous optimization." },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80",
        ],
    },
} as const;
