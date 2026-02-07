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
            name: "Dr. Khalil Medical",
            slug: "dr-khalil",
            description: "High-performance clinical architecture for medical excellence.",
            status: "deployed",
            is_featured: true,
            site_type: "Medical Pillar",
            blueprint: { id: "dr-khalil", name: "Dr. Khalil Medical", theme: { primary: "#0ea5e9", mode: "industrial" } }
        },
        {
            name: "Luxe E-Commerce",
            slug: "luxe-cart",
            description: "Premium retail infrastructure for global commerce.",
            status: "deployed",
            is_featured: true,
            site_type: "Retail Pillar",
            blueprint: { id: "luxe-cart", name: "Luxe E-Commerce", theme: { primary: "#d4af37", mode: "industrial" } }
        },
        {
            name: "Lex Sileo Legal",
            slug: "law-silo",
            description: "Prestige legal architecture for elite law firms.",
            status: "deployed",
            is_featured: true,
            site_type: "Professional Pillar",
            blueprint: { id: "law-silo", name: "Lex Sileo Legal", theme: { primary: "#475569", mode: "industrial" } }
        },
        {
            name: "Sierra Industrial",
            slug: "sierra-industry",
            description: "Heavy-duty architecture for manufacturing and logistics.",
            status: "deployed",
            is_featured: true,
            site_type: "Professional Pillar",
            blueprint: { id: "sierra-industry", name: "Sierra Industrial", theme: { primary: "#1a1a1a", mode: "industrial" } }
        },
        {
            name: "Aurum & Ash Dining",
            slug: "zen-food",
            description: "Industrial-grade dining experience with a reservation engine.",
            status: "deployed",
            is_featured: true,
            site_type: "Resto Pillar",
            blueprint: { id: "zen-food", name: "Aurum & Ash Dining", theme: { primary: "#7c2d12", mode: "industrial" } }
        },
        {
            name: "Studio Zero Creative",
            slug: "studio-zero",
            description: "Visual-heavy architecture for creative industrial use.",
            status: "deployed",
            is_featured: true,
            site_type: "Creative Pillar",
            blueprint: { id: "studio-zero", name: "Studio Zero Creative", theme: { primary: "#a855f7", mode: "industrial" } }
        },
        {
            name: "SyncSphere Tech",
            slug: "tech-grid",
            description: "High-frequency landing pages for industrial SaaS.",
            status: "deployed",
            is_featured: true,
            site_type: "Landing Pillar",
            blueprint: { id: "tech-grid", name: "SyncSphere Tech", theme: { primary: "#00f2ff", mode: "industrial" } }
        },
        {
            name: "Boreal Real Estate",
            slug: "boreal-estate",
            description: "Prestige listings for industrial property markets.",
            status: "deployed",
            is_featured: true,
            site_type: "Real Estate Pillar",
            blueprint: { id: "boreal-estate", name: "Boreal Real Estate", theme: { primary: "#15803d", mode: "industrial" } }
        },
        {
            name: "Elite Academia LMS",
            slug: "elite-lms",
            description: "Industrial learning management architecture.",
            status: "deployed",
            is_featured: true,
            site_type: "LMS Pillar",
            blueprint: { id: "elite-lms", name: "Elite Academia LMS", theme: { primary: "#8b5cf6", mode: "industrial" } }
        },
        {
            name: "Dispatch News Engine",
            slug: "news-silo",
            description: "Industrial-grade editorial architecture.",
            status: "deployed",
            is_featured: true,
            site_type: "Public Pillar",
            blueprint: { id: "news-silo", name: "Dispatch News Engine", theme: { primary: "#18181b", mode: "industrial" } }
        },
        {
            name: "Zen Wellness",
            slug: "spa-wellness",
            description: "Industrial wellness and beauty architecture.",
            status: "deployed",
            is_featured: true,
            site_type: "Wellness Pillar",
            blueprint: { id: "spa-wellness", name: "Zen Wellness", theme: { primary: "#f97316", mode: "industrial" } }
        },
        {
            name: "Kinetic Fitness Lab",
            slug: "fitness-neon",
            description: "Industrial-grade athletic performance engine.",
            status: "deployed",
            is_featured: true,
            site_type: "Fitness Pillar",
            blueprint: { id: "fitness-neon", name: "Kinetic Fitness Lab", theme: { primary: "#22c55e", mode: "industrial" } }
        },
        {
            name: "Global Corporate",
            slug: "corp-global",
            description: "Industrial architecture for international enterprise.",
            status: "deployed",
            is_featured: true,
            site_type: "Corporate Pillar",
            blueprint: { id: "corp-global", name: "Global Corporate", theme: { primary: "#1e40af", mode: "industrial" } }
        },
        {
            name: "Ledger Accounting",
            slug: "financial-core",
            description: "Industrial financial and tax logic architecture.",
            status: "deployed",
            is_featured: true,
            site_type: "Financial Pillar",
            blueprint: { id: "financial-core", name: "Ledger Accounting", theme: { primary: "#0d9488", mode: "industrial" } }
        },
        {
            name: "Operational Internal",
            slug: "internal-engine",
            description: "Industrial-grade internal tools and operations hub.",
            status: "deployed",
            is_featured: true,
            site_type: "Internal Pillar",
            blueprint: { id: "internal-engine", name: "Operational Internal", theme: { primary: "#2563eb", mode: "industrial" } }
        }
    ];

    try {
        // Purge old featured sites that don't match our slugs
        const slugs = legendarySites.map(s => s.slug);
        await supabase.from('stores').update({ is_featured: false }).not('slug', 'in', `(${slugs.join(',')})`);

        for (const site of legendarySites) {
            const { error } = await supabase.from('stores').upsert(site, { onConflict: 'slug' });
            if (error) console.error(`Failed to seed ${site.name}:`, error.message);
        }
        return { success: true };
    } catch (e) {
        return { success: false, error: "Seeding failed" };
    }
}
