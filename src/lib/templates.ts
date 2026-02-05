import { SiteBlueprint, Section } from './schemas';
import { v4 as uuidv4 } from 'uuid';

export interface TemplateTheme {
    id: string;
    name: string;
    image: string;
    description: string;
    components: string[];
    primaryColor: string;
    blueprint: SiteBlueprint;
}

export interface TemplateCategory {
    id: string;
    name: string;
    themes: TemplateTheme[];
}

// HELPERS TO CONSTRUCT BLUEPRINTS FROM USER ARCHITECTURE
const constructBlueprint = (name: string, primary: string, sections: string[]): SiteBlueprint => ({
    id: uuidv4(),
    name,
    description: `A battle-tested blueprint for ${name}.`,
    theme: {
        primary,
        secondary: "#a855f7",
        accent: "#a855f7",
        fontFamily: "var(--font-inter)",
        mode: "quantum"
    },
    navigation: {
        logo: name,
        links: [],
        transparent: false
    },
    layout: sections.map(type => ({
        id: uuidv4(),
        type: type as any,
        content: {
            headline: `${name} Architecture`,
            subheadline: "Optimized for extreme conversion and structural authority."
        },
        styles: {},
        animation: "fade-in"
    })),
    footer: {
        copyright: ` 2024 ${name}. All rights reserved.`,
        links: [],
        social: {}
    },
    metadata: {},
    timestamp: new Date().toISOString()
});

export const SITE_TEMPLATES: { categories: TemplateCategory[] } = {
    categories: [
        {
            id: "tech-agency",
            name: "Tech & Agency",
            themes: [
                {
                    id: "t1-quantum",
                    name: "Quantum Tech",
                    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
                    description: "Dark mode, neon accents, high-frequency layout.",
                    components: ["Glassmorphism-Centered", "Video-Background-Dark", "Features-Grid", "Tech-Stack-Marquee"],
                    primaryColor: "#00f2ff",
                    blueprint: constructBlueprint("Quantum Tech", "#00f2ff", ["hero", "features", "pricing"])
                },
                {
                    id: "t2-minimal",
                    name: "Berlin Minimal",
                    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174",
                    description: "White space, sans-serif typography, brutalist efficiency.",
                    components: ["Simple-Left-Align", "Minimal-Text-Only", "Service-Cards-Flat", "Testimonial-Text"],
                    primaryColor: "#1a1a1a",
                    blueprint: constructBlueprint("Berlin Minimal", "#1a1a1a", ["hero", "features"])
                },
                {
                    id: "t3-ai-agent",
                    name: "Neural Agency",
                    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
                    description: "AI-focused, futuristic animations, interactive elements.",
                    components: ["Floating-Nav", "Animated-Blob-Background", "AI-Capabilities-List", "Process-Steps-Vertical"],
                    primaryColor: "#8b5cf6",
                    blueprint: constructBlueprint("Neural Agency", "#8b5cf6", ["hero", "features", "cta"])
                },
                {
                    id: "t4-cloud",
                    name: "SaaS Matrix",
                    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
                    description: "Data-driven, conversion-optimized, trust-focused.",
                    components: ["Double-Layer-Nav", "Dashboard-Mockup-Hero", "Stats-Counter", "Bento-Grid-Showcase"],
                    primaryColor: "#3b82f6",
                    blueprint: constructBlueprint("SaaS Matrix", "#3b82f6", ["hero", "features", "pricing", "cta"])
                }
            ]
        },
        {
            id: "luxury-ecommerce",
            name: "Luxury E-Commerce",
            themes: [
                {
                    id: "e1-vault",
                    name: "The Vault",
                    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
                    description: "Gold & Black, parallax scrolling, high-res focus.",
                    components: ["Luxury-Slim-Nav", "Parallax-Image-FullWidth", "Product-Lookbook", "Storytelling-Section"],
                    primaryColor: "#d4af37",
                    blueprint: constructBlueprint("The Vault", "#d4af37", ["hero", "gallery", "testimonials"])
                },
                {
                    id: "e2-clean-cart",
                    name: "Pure Commerce",
                    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a",
                    description: "Soft colors, focus on product details, fast checkout UI.",
                    components: ["Search-Dominant-Nav", "Product-Slider-Auto", "Flash-Deals-Countdown", "Review-Stars-Grid"],
                    primaryColor: "#f43f5e",
                    blueprint: constructBlueprint("Pure Commerce", "#f43f5e", ["hero", "features"])
                },
                {
                    id: "e3-modern-beast",
                    name: "Urban Beast",
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                    description: "Bold fonts, vibrant colors, Gen-Z oriented.",
                    components: ["Side-Burger-Menu", "Video-Loop-Short", "Trending-Now-List", "Influencer-Testimonials"],
                    primaryColor: "#10b981",
                    blueprint: constructBlueprint("Urban Beast", "#10b981", ["hero", "gallery", "cta"])
                },
                {
                    id: "e4-artisan",
                    name: "Artisan Hands",
                    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a",
                    description: "Earth tones, hand-crafted feel, high trust score.",
                    components: ["Centered-Logo-Classic", "Static-Image-Split", "Process-Video-Section", "Newsletter-Signup"],
                    primaryColor: "#92400e",
                    blueprint: constructBlueprint("Artisan Hands", "#92400e", ["hero", "features", "cta"])
                }
            ]
        },
        {
            id: "professional-services",
            name: "Professional Services",
            themes: [
                {
                    id: "s1-consult",
                    name: "Global Advisor",
                    image: "https://images.unsplash.com/photo-1454165833767-027ffea9e778",
                    description: "Blue & Grey tones, focus on authority and statistics.",
                    components: ["Contact-Top-Bar", "Lead-Gen-Form-Hero", "Authority-Logos", "Services-Icons-Large"],
                    primaryColor: "#1e40af",
                    blueprint: constructBlueprint("Global Advisor", "#1e40af", ["hero", "features", "testimonials"])
                },
                {
                    id: "dr-khalil",
                    name: "Dr. Khalil Dental",
                    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop",
                    description: "High-fidelity clinical aesthetic, focus on dental excellence.",
                    components: ["Cinematic-Hero-Dental", "Service-Grid-Clinical", "Appointment-Portal-Sim", "Patient-Testimonials"],
                    primaryColor: "#0ea5e9",
                    blueprint: constructBlueprint("Dr. Khalil Dental", "#0ea5e9", ["hero", "features", "testimonials", "cta"])
                },
                {
                    id: "s3-legal",
                    name: "Sovereign Law",
                    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73",
                    description: "Marble textures, classic typography, trust and authority.",
                    components: ["Classic-Top-Nav", "Authority-Hero-Stoic", "Practice-Areas-Grid", "Client-Logos-Legacy"],
                    primaryColor: "#475569",
                    blueprint: constructBlueprint("Sovereign Law", "#475569", ["hero", "features"])
                }
            ]
        },
        {
            id: "food-hospitality",
            name: "Food & Hospitality",
            themes: [
                {
                    id: "f1-cinematic",
                    name: "Chef's Table",
                    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
                    description: "Cinematic food photography, elegant plating focus.",
                    components: ["Video-Background-Hero", "Plating-Gallery", "Menu-Accordion", "Reservation-Sticky"],
                    primaryColor: "#7c2d12",
                    blueprint: constructBlueprint("Chef's Table", "#7c2d12", ["hero", "gallery", "features"])
                },
                {
                    id: "f2-street",
                    name: "Night Market",
                    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2072&auto=format&fit=crop",
                    description: "Neon, urban, energetic. For bold street food brands.",
                    components: ["Neon-Sign-Hero", "Food-Carousel-Dark", "Social-Grid-Urban", "Location-Map-Night"],
                    primaryColor: "#facc15",
                    blueprint: constructBlueprint("Night Market", "#facc15", ["hero", "gallery", "cta"])
                },
                {
                    id: "f3-wine",
                    name: "Vineyard Estate",
                    image: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?q=80&w=2072&auto=format&fit=crop",
                    description: "Moody, earthy tones. Sophisticated wine/cocktail bars.",
                    components: ["Parallax-Vineyard-Hero", "Wine-List-Elegant", "Tasting-Events-Cards", "Club-Signup"],
                    primaryColor: "#581c87",
                    blueprint: constructBlueprint("Vineyard Estate", "#581c87", ["hero", "features", "testimonials"])
                }
            ]
        },
        {
            id: "health-medicine",
            name: "Health & Medicine",
            themes: [
                {
                    id: "m1-clinic",
                    name: "Apex Medical",
                    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2194&auto=format&fit=crop",
                    description: "Clean, sterile white/blue. High trust, clear CTA.",
                    components: ["Emergency-Top-Bar", "Trust-Stats-Hero", "Symptom-Checker-Widget", "Doctor-Profiles"],
                    primaryColor: "#2563eb",
                    blueprint: constructBlueprint("Apex Medical", "#2563eb", ["hero", "features", "cta"])
                },
                {
                    id: "m2-wellness",
                    name: "Holistic Harmony",
                    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop",
                    description: "Natural greens, organic textures. For spas and wellness.",
                    components: ["Zen-Hero-Video", "Treatment-Menu-Cards", "Booking-Form-Spa", "Instagram-Feed"],
                    primaryColor: "#15803d",
                    blueprint: constructBlueprint("Holistic Harmony", "#15803d", ["hero", "gallery", "testimonials"])
                },
                {
                    id: "m3-pharma",
                    name: "VitaLabs",
                    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2069&auto=format&fit=crop",
                    description: "Scientific, clinical, trustworthy. Pharmaceutical/Labs.",
                    components: ["Product-Grid-Lab", "Clinical-Evidence-PDF", "Research-Accreditations", "Order-Form"],
                    primaryColor: "#06b6d4",
                    blueprint: constructBlueprint("VitaLabs", "#06b6d4", ["hero", "features", "cta"])
                },
                {
                    id: "m4-wellness",
                    name: "Zenith Yoga",
                    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
                    description: "Soft pastels, breathing space, calming typography.",
                    components: ["Full-Screen-Breath-Hero", "Class-Schedule-Table", "Instructor-Cards-Soft", "Membership-Tiers-Simple"],
                    primaryColor: "#57534e",
                    blueprint: constructBlueprint("Zenith Yoga", "#57534e", ["hero", "features", "gallery"])
                }
            ]
        }
    ]
};
