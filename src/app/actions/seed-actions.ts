"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * SOVEREIGN SEED SERVICE
 * Logic: Injects "Legendary" sites into the stores table as featured examples.
 */
export async function seedLegendarySitesAction() {
    const supabase = await createClient();

    const legendarySites = [
        {
            name: "L'Artisan de Marrakech",
            slug: "artisan-marrakech",
            description: "High-end artisanal furniture and decor. A masterpiece of Moroccan craftsmanship and digital authority.",
            status: "deployed",
            is_featured: true,
            blueprint: {
                name: "L'Artisan",
                theme: { primary: "#92400e", secondary: "#1a1a1a", mode: "quantum" },
                layout: [
                    { type: "hero", content: { headline: "Artisan Tradition, Digital Excellence", subheadline: "Exquisite craftsmanship, architected for the global market." } },
                    { type: "gallery", content: { items: ["Furniture", "Ceramics", "Textiles"] } }
                ]
            }
        },
        {
            name: "Neural Agency Casa",
            slug: "neural-casa",
            description: "AI-First workflow automation for industrial sectors. Clean, futuristic, and conversion-optimized.",
            status: "deployed",
            is_featured: true,
            blueprint: {
                name: "Neural Agency",
                theme: { primary: "#8b5cf6", secondary: "#000000", mode: "quantum" },
                layout: [
                    { type: "hero", content: { headline: "Intelligent Architectures", subheadline: "We don't build sites. We deploy neural agents." } },
                    { type: "features", content: { items: ["AI Integration", "Process Automation"] } }
                ]
            }
        },
        {
            name: "Atlas Peak Real Estate",
            slug: "atlas-peak",
            description: "Luxury property listings in the Atlas mountains. Absolute visual power and sub-100ms performance.",
            status: "deployed",
            is_featured: true,
            blueprint: {
                name: "Atlas Peak",
                theme: { primary: "#1e1e1e", secondary: "#ffcc00", mode: "quantum" },
                layout: [
                    { type: "hero", content: { headline: "Luxury Above the Clouds", subheadline: "Sovereign living, redefined by architectural precision." } },
                    { type: "gallery", content: { items: ["The Villa", "The Spa", "The Peak"] } }
                ]
            }
        },
        {
            name: "CyberPort Tangier",
            slug: "cyberport",
            description: "Tech recruitment and logistics hub. High-frequency layout for the modern enterprise.",
            status: "deployed",
            is_featured: true,
            blueprint: {
                name: "CyberPort",
                theme: { primary: "#00f2ff", secondary: "#0f172a", mode: "quantum" },
                layout: [
                    { type: "hero", content: { headline: "The Gate of High Tech", subheadline: "Connecting global talent with the Mediterranean's tech hub." } },
                    { type: "features", content: { items: ["Full-Stack", "Logistics", "AI Ops"] } }
                ]
            }
        },
        {
            name: "Zina Beauty Lab",
            slug: "zina-beauty",
            description: "Boutique skincare e-commerce. Soft aesthetics meet clinical performance logic.",
            status: "deployed",
            is_featured: true,
            blueprint: {
                name: "Zina Beauty",
                theme: { primary: "#f43f5e", secondary: "#fff1f2", mode: "quantum" },
                layout: [
                    { type: "hero", content: { headline: "Pure Science, Pure Beauty", subheadline: "Handcrafted formulas, deployed with technical precision." } },
                    { type: "gallery", content: { items: ["Serum", "Cream", "Rituals"] } }
                ]
            }
        }
    ];

    try {
        for (const site of legendarySites) {
            const { error } = await supabase.from('stores').upsert(site, { onConflict: 'slug' });
            if (error) console.error(`Failed to seed ${site.name}:`, error.message);
        }
        return { success: true };
    } catch (e) {
        return { success: false, error: "Seeding failed" };
    }
}
