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
    name,
    description: `A battle-tested blueprint for ${name}.`,
    theme: {
        primary,
        secondary: "#a855f7",
        fontFamily: "var(--font-inter)",
        mode: "quantum"
    },
    layout: sections.map(type => ({
        id: uuidv4(),
        type: type as any,
        content: {
            headline: `${name} Architecture`,
            subheadline: "Optimized for extreme conversion and structural authority."
        }
    }))
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
                    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop",
                    description: "Deep wood tones, classic serif fonts, absolute trust.",
                    components: ["Traditional-Header", "Static-Classic-Hero", "Practice-Areas-Detailed", "Attorney-Profiles"],
                    primaryColor: "#451a03",
                    blueprint: constructBlueprint("Sovereign Law", "#451a03", ["hero", "features"])
                },
                {
                    id: "s4-creative",
                    name: "Studio X",
                    image: "https://images.unsplash.com/photo-1493421416290-99a87240a79a",
                    description: "Experimental layouts, big images, portfolio focused.",
                    components: ["Hidden-Nav-Reveal", "Portfolio-Grid-Staggered", "About-Artist-Text", "Awards-Section"],
                    primaryColor: "#000000",
                    blueprint: constructBlueprint("Studio X", "#000000", ["hero", "gallery", "cta"])
                }
            ]
        },
        {
            id: "media-lifestyle",
            name: "Media & Lifestyle",
            themes: [
                {
                    id: "m1-chronicle",
                    name: "The Chronicle",
                    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop",
                    description: "Classic newspaper aesthetic, serif fonts, high readability.",
                    components: ["News-Ticker-Top", "Headlines-Grid-Hero", "Editor-Picks-Sidebar", "Newsletter-Inline"],
                    primaryColor: "#000000",
                    blueprint: constructBlueprint("The Chronicle", "#000000", ["hero", "features", "testimonials"])
                },
                {
                    id: "m2-culinary",
                    name: "Chef's Table",
                    image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf",
                    description: "Warm tones, appetite-inducing layout, menu focused.",
                    components: ["Hero-Video-Dish", "Menu-Tabs-Section", "Chef-Bio-Split", "Reservation-Floater"],
                    primaryColor: "#ea580c",
                    blueprint: constructBlueprint("Chef's Table", "#ea580c", ["hero", "gallery", "cta"])
                },
                {
                    id: "m3-science",
                    name: "Lab Zero",
                    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
                    description: "Clinical white/blue, data visualization focus, clean lines.",
                    components: ["Research-Abstract-Hero", "Data-Points-Grid", "Team-Labs-Grid", "Publication-List"],
                    primaryColor: "#0284c7",
                    blueprint: constructBlueprint("Lab Zero", "#0284c7", ["hero", "features", "custom"])
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
