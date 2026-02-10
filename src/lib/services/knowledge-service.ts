
import { Post, Category } from "@/lib/schemas";

/**
 * KnowledgeService: The Repository of Sovereign Wisdom
 * Manages high-value content, guides, and strategic case studies.
 */

// MOCK DATA SEED - In production, this would be a database integration
const CATEGORIES: Category[] = [
    { id: "strategy", name: "Digital Strategy", slug: "digital-strategy" },
    { id: "ai", name: "Artificial Intelligence", slug: "artificial-intelligence" },
    { id: "ecommerce", name: "E-Commerce", slug: "e-commerce" }
];

const POSTS: Post[] = [
    {
        id: "sovereign-manifesto",
        title: "The Death of Generic Web Design",
        slug: "death-of-generic-web-design",
        excerpt: "Why templates are dead and how AI-driven sovereign architecture is the only way forward for serious businesses in 2026.",
        content: `
            <h2 class="text-3xl font-black mb-6">The Old Internet is Dead.</h2>
            <p class="mb-6 text-lg text-slate-300 leading-relaxed">For two decades, businesses have been held hostage by "themes". You pick a template, fill in the blanks, and hope for the best. This era is over.</p>
            
            <h3 class="text-2xl font-bold mb-4 text-[#00D09C]">The Sovereign Shift</h3>
            <p class="mb-6 text-lg text-slate-300 leading-relaxed">True digital sovereignty means your infrastructure adapts to <strong>YOU</strong>, not the other way around. Our AI doesn't just "design"; it engineers a psychological journey tailored to your specific niche.</p>

            <blockquote class="border-l-4 border-[#00D09C] pl-6 my-8 italic text-xl text-white">
                "Stop building websites. Start architecting digital empires."
            </blockquote>

            <h3 class="text-2xl font-bold mb-4 text-[#00D09C]">Speed is Authority</h3>
            <p class="mb-6 text-lg text-slate-300 leading-relaxed">Google's 2026 Core Vitals update made it clear: if you aren't instant, you don't exist. Our edge-propagated nodes ensuring <100ms latency globally isn't a feature—it's a requirement for survival.</p>
        `,
        author: { name: "Sovereign Architect", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Arch" },
        date: "2026-02-10",
        category: "Digital Strategy",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
        tags: ["Strategy", "Future", "AI"]
    },
    {
        id: "ai-conversion-logic",
        title: "Atomic Conversion Logic: How AI Writes Better Copy",
        slug: "atomic-conversion-logic",
        excerpt: "Understanding the AIDA model implementation within our neural engine.",
        content: `
            <h2 class="text-3xl font-black mb-6">Words That Sell.</h2>
            <p class="mb-6 text-lg text-slate-300 leading-relaxed">Most business owners struggle to write about themselves. They are too close to the product. Our AI operates with "Clinical Detachment".</p>
            
            <h3 class="text-2xl font-bold mb-4 text-[#00D09C]">The AIDA Protocol</h3>
            <ul class="list-disc pl-6 mb-6 text-slate-300 space-y-2">
                <li><strong>Attention:</strong> Headlines that stop the scroll.</li>
                <li><strong>Interest:</strong> Subheadlines that promise a specific benefit.</li>
                <li><strong>Desire:</strong> Features translated into emotional outcomes.</li>
                <li><strong>Action:</strong> Commands, not suggestions.</li>
            </ul>
        `,
        author: { name: "Neural Engine", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Engine" },
        date: "2026-02-08",
        category: "Artificial Intelligence",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
        tags: ["Copywriting", "Sales", "AI"]
    },
    {
        id: "ecommerce-dominance",
        title: "E-Commerce 3.0: Beyond the Cart",
        slug: "ecommerce-dominance-2026",
        excerpt: "Building high-trust retail environments that compete with Amazon.",
        content: `
            <h2 class="text-3xl font-black mb-6">Trust is the New Currency.</h2>
            <p class="mb-6 text-lg text-slate-300 leading-relaxed">In a world of scams and dropshipping, a "Sovereign Store" signals permanence. It tells the customer: "We are here to stay."</p>
        `,
        author: { name: "Commerce Unit", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Commerce" },
        date: "2026-02-05",
        category: "E-Commerce",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop",
        tags: ["Retail", "Growth", "Trust"]
    }
];

export const KnowledgeService = {

    getRecentPosts: async (count: number = 3) => {
        return POSTS.slice(0, count);
    },

    getPostBySlug: async (slug: string) => {
        return POSTS.find(p => p.slug === slug) || null;
    },

    getAllCategories: async () => {
        return CATEGORIES;
    },

    // In a real app, this would use vector search
    searchPosts: async (query: string) => {
        const lowerQuery = query.toLowerCase();
        return POSTS.filter(p =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.excerpt.toLowerCase().includes(lowerQuery)
        );
    }
};
