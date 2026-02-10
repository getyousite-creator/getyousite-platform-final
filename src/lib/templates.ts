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
    pages: {},
    footer: {
        copyright: `© 2024 ${name}. All rights reserved.`,
        links: [],
        social: {}
    },
    metadata: {},
    economic_impact: {
        estimated_savings: "$500k", // Placeholder
        logic_verified: true
    },
    timestamp: new Date().toISOString()
});

export const SITE_TEMPLATES: { categories: TemplateCategory[] } = {
    categories: [
        {
            id: "business",
            name: "Business & Agency",
            themes: [
                {
                    id: "creative-agency",
                    name: "Neura Agency",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
                    description: "Next-gen design for digital empires and creative disruptors.",
                    components: ["Glassmorphism-Centered", "Video-Background-Dark", "Features-Grid", "Tech-Stack-Marquee"],
                    primaryColor: "#8b5cf6",
                    blueprint: constructBlueprint("Neura Agency", "#8b5cf6", ["hero", "features", "cta"])
                },
                {
                    id: "sierra-industry",
                    name: "Sierra Industrial",
                    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2432",
                    description: "Heavy-duty architecture for manufacturing and global logistics.",
                    components: ["Industrial-Layout", "Resource-Grids", "Contact-Forms"],
                    primaryColor: "#1a1a1a",
                    blueprint: constructBlueprint("Sierra Industrial", "#1a1a1a", ["hero", "features"])
                },
                {
                    id: "omega-pro",
                    name: "Omega Corporate",
                    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
                    description: "Sophisticated infrastructure for large-scale enterprise firms.",
                    components: ["Investor-Portals", "ESG-Dashboards", "Multi-Region Support"],
                    primaryColor: "#1e40af",
                    blueprint: constructBlueprint("Omega Corporate", "#1e40af", ["hero", "features", "testimonials"])
                },
                {
                    id: "law-silo",
                    name: "Lex Sileo",
                    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop",
                    description: "Prestige legal architecture for elite law firms and partners.",
                    components: ["Marble-Textures", "Partner-Profiles", "Secure-Intake"],
                    primaryColor: "#475569",
                    blueprint: constructBlueprint("Lex Sileo", "#475569", ["hero", "features"])
                },
                {
                    id: "tech-grid",
                    name: "SyncSphere",
                    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
                    description: "High-frequency dashboard design for B2B tech platforms.",
                    components: ["Data-Visuals", "Feature-Grids", "Client-Portals"],
                    primaryColor: "#00f2ff",
                    blueprint: constructBlueprint("SyncSphere", "#00f2ff", ["hero", "features", "pricing"])
                },
                {
                    id: "boreal-estate",
                    name: "Boreal Estates",
                    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop",
                    description: "Prestige real estate listings for luxury property markets.",
                    components: ["Property-Search", "Agent-Profiles", "Virtual-Tours"],
                    primaryColor: "#15803d",
                    blueprint: constructBlueprint("Boreal Estates", "#15803d", ["hero", "features", "gallery"])
                }
            ]
        },
        {
            id: "ecommerce",
            name: "Luxe E-Commerce",
            themes: [
                {
                    id: "luxe-cart",
                    name: "Luxe E-Commerce",
                    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2430",
                    description: "Premium shopping experiences for elite retail empires.",
                    components: ["Luxury-Slim-Nav", "Parallax-Image-FullWidth", "Product-Lookbook", "Storytelling-Section"],
                    primaryColor: "#d4af37",
                    blueprint: constructBlueprint("Luxe E-Commerce", "#d4af37", ["hero", "gallery", "testimonials"])
                },
                {
                    id: "alpha-pro",
                    name: "Alpha Store",
                    image: "https://images.unsplash.com/photo-1522204538344-922f76eba0a4?q=80&w=2070&auto=format&fit=crop",
                    description: "High-velocity retail with sub-50ms product interactions.",
                    components: ["Live-Inventory", "Smart-Search", "Mobile-Mastery"],
                    primaryColor: "#f43f5e",
                    blueprint: constructBlueprint("Alpha Store", "#f43f5e", ["hero", "features"])
                }
            ]
        },
        {
            id: "healthcare",
            name: "Healthcare Elite",
            themes: [
                {
                    id: "dr-khalil",
                    name: "Dr. Khalil V3",
                    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop",
                    description: "The gold standard for medical and dental clinical excellence.",
                    components: ["Cinematic-Hero-Dental", "Service-Grid-Clinical", "Appointment-Portal-Sim", "Patient-Testimonials"],
                    primaryColor: "#0ea5e9",
                    blueprint: constructBlueprint("Dr. Khalil Dental", "#0ea5e9", ["hero", "features", "testimonials", "cta"])
                },
                {
                    id: "spa-wellness",
                    name: "Zen Retreat",
                    image: "https://images.unsplash.com/photo-1544161515-4ae6ce6ea858?q=80&w=2070&auto=format&fit=crop",
                    description: "Tranquil design for beauty and wellness sanctuaries.",
                    components: ["Therapy-Menu", "Soft-Visuals", "Calm-Booking"],
                    primaryColor: "#f97316",
                    blueprint: constructBlueprint("Zen Retreat", "#f97316", ["hero", "features", "cta"])
                }
            ]
        },
        {
            id: "restaurant",
            name: "Dining & Hospitality",
            themes: [
                {
                    id: "zen-food",
                    name: "Aurum & Ash",
                    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2430",
                    description: "Cinematic dining experiences for Michelin-star restaurants.",
                    components: ["Video-Background-Hero", "Plating-Gallery", "Menu-Accordion", "Reservation-Sticky"],
                    primaryColor: "#7c2d12",
                    blueprint: constructBlueprint("Aurum & Ash", "#7c2d12", ["hero", "gallery", "features"])
                }
            ]
        },
        {
            id: "creative",
            name: "Creative & Education",
            themes: [
                {
                    id: "studio-zero",
                    name: "Studio Zero",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
                    description: "Visual-heavy portfolios for creative disruptors.",
                    components: ["Masonry-Grid", "Cinematic-Reels", "Vision-Matrices"],
                    primaryColor: "#a855f7",
                    blueprint: constructBlueprint("Studio Zero", "#a855f7", ["hero", "gallery", "features"])
                },
                {
                    id: "python-portfolio",
                    name: "Python Architect",
                    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2070",
                    description: "Terminal-grade portfolio for backend engineers and data scientists.",
                    components: ["Terminal-Hero", "Repo-Grid", "Cmd-Contact"],
                    primaryColor: "#22c55e",
                    blueprint: constructBlueprint("Python Architect", "#22c55e", ["hero", "features", "projects"])
                },
                {
                    id: "elite-lms",
                    name: "Elite Academia",
                    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2067&auto=format&fit=crop",
                    description: "Masterclass architecture for education empires.",
                    components: ["Course-Matrix", "Student-Dashboard", "Learning-Paths"],
                    primaryColor: "#8b5cf6",
                    blueprint: constructBlueprint("Elite Academia", "#8b5cf6", ["hero", "features", "cta"])
                },
                {
                    id: "news-silo",
                    name: "Dispatch Engine",
                    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop",
                    description: "Editorial excellence for news and magazine empires.",
                    components: ["News-Grid", "Reader-Focus", "Article-Matrix"],
                    primaryColor: "#18181b",
                    blueprint: constructBlueprint("Dispatch Engine", "#18181b", ["hero", "features", "cta"])
                },
                {
                    id: "fitness-neon",
                    name: "Kinetic Lab",
                    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
                    description: "High-energy, dark-neon engine for athletic performance.",
                    components: ["Program-Matrices", "Trainer-Profiles", "Progress-Tracking"],
                    primaryColor: "#22c55e",
                    blueprint: constructBlueprint("Kinetic Lab", "#22c55e", ["hero", "features", "cta"])
                }
            ]
        },
        {
            id: "finance",
            name: "Finance & Legal",
            themes: [
                {
                    id: "law-silo",
                    name: "Lex Sileo",
                    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop",
                    description: "Prestige legal architecture for elite law firms.",
                    components: ["Marble-Textures", "Partner-Profiles", "Secure-Intake"],
                    primaryColor: "#475569",
                    blueprint: constructBlueprint("Lex Sileo", "#475569", ["hero", "features"])
                },
                {
                    id: "financial-core",
                    name: "Ledger Pro",
                    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop",
                    description: "Premium accounting and tax logic for fintech.",
                    components: ["Automated-Ledger", "Tax-Compliance", "Invoicing-Engine"],
                    primaryColor: "#0d9488",
                    blueprint: constructBlueprint("Ledger Pro", "#0d9488", ["hero", "features", "cta"])
                }
            ]
        },
        {
            id: "internal",
            name: "Internal Tools",
            themes: [
                {
                    id: "internal-engine",
                    name: "Operational Shell",
                    image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=2070&auto=format&fit=crop",
                    description: "Production-ready internal tools for heavy logic.",
                    components: ["CRM-Logic", "Inventory-Matrices", "System-Logs"],
                    primaryColor: "#2563eb",
                    blueprint: constructBlueprint("Operational Shell", "#2563eb", ["hero", "features"])
                }
            ]
        }
    ]
};
