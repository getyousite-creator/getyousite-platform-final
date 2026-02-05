/**
 * Template Service
 * 
 * Comprehensive template management system with categorization,
 * search, filtering, and AI-powered recommendations.
 */

import { createClient } from '@/lib/supabase/server';
import { SiteBlueprint } from '@/lib/schemas';

// Template Categories
export type TemplateCategory =
    | 'business'
    | 'restaurant'
    | 'portfolio'
    | 'ecommerce'
    | 'saas'
    | 'medical'
    | 'realestate'
    | 'education'
    | 'personal'
    | 'blog'
    | 'landing';

export interface Template {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: TemplateCategory;
    subcategory?: string;
    tags: string[];
    blueprint: SiteBlueprint;
    thumbnail_url?: string;
    preview_url?: string;
    features: string[];
    is_premium: boolean;
    price?: number;
    is_active: boolean;
    is_featured: boolean;
    usage_count: number;
    rating?: number;
    created_at: string;
    updated_at: string;
}

export interface TemplateFilters {
    category?: TemplateCategory;
    is_premium?: boolean;
    is_featured?: boolean;
    tags?: string[];
    search?: string;
    limit?: number;
    offset?: number;
}

export interface TemplateStats {
    total_templates: number;
    total_categories: number;
    most_popular: Template[];
    newest_additions: Template[];
}

// Default templates for common niches
const DEFAULT_TEMPLATES: Omit<Template, 'id' | 'created_at' | 'updated_at' | 'usage_count'>[] = [
    {
        name: "Tech Startup",
        slug: "tech-startup",
        description: "Modern, cutting-edge design for technology startups and SaaS companies",
        category: "saas",
        tags: ["technology", "startup", "software", "modern", "dark-mode"],
        features: ["Hero Section", "Feature Comparison", "Pricing Tables", "Testimonials", "FAQ", "CTA"],
        thumbnail_url: "/images/tech-startup.png",
        preview_url: "/templates/tech-startup",
        is_premium: false,
        is_active: true,
        is_featured: true,
        rating: 4.8,
        blueprint: {
            id: "tech-startup-blueprint",
            name: "Tech Startup",
            description: "Modern startup website",
            theme: {
                primary: "#3b82f6",
                secondary: "#1e40af",
                accent: "#06b6d4",
                fontFamily: "Inter",
                mode: "dark"
            },
            navigation: {
                logo: "Tech Startup",
                links: [],
                transparent: false
            },
            layout: [],
            footer: {
                copyright: "© 2024 Tech Startup. All rights reserved.",
                links: [],
                social: {}
            },
            metadata: {},
            timestamp: new Date().toISOString()
        }
    },
    {
        name: "Creative Portfolio",
        slug: "creative-portfolio",
        description: "Stunning portfolio template for designers, photographers, and creatives",
        category: "portfolio",
        tags: ["portfolio", "creative", "design", "minimal", "gallery"],
        features: ["Gallery Grid", "About Section", "Services", "Contact Form", "Client Work"],
        thumbnail_url: "/images/creative-portfolio.png",
        preview_url: "/templates/creative-portfolio",
        is_premium: false,
        is_active: true,
        is_featured: true,
        rating: 4.9,
        blueprint: {
            id: "creative-portfolio-blueprint",
            name: "Creative Portfolio",
            description: "Portfolio website",
            theme: {
                primary: "#ec4899",
                secondary: "#be185d",
                accent: "#f97316",
                fontFamily: "Playfair Display",
                mode: "light"
            },
            navigation: {
                logo: "Creative Portfolio",
                links: [],
                transparent: false
            },
            layout: [],
            footer: {
                copyright: "© 2024 Creative Portfolio. All rights reserved.",
                links: [],
                social: {}
            },
            metadata: {},
            timestamp: new Date().toISOString()
        }
    },
    {
        name: "E-Commerce Store",
        slug: "ecommerce-store",
        description: "Complete e-commerce solution with product showcases and shopping features",
        category: "ecommerce",
        tags: ["ecommerce", "shop", "store", "products", "modern"],
        features: ["Product Showcase", "Categories", "Featured Products", "Reviews", "Newsletter"],
        thumbnail_url: "/images/ecommerce-store.png",
        preview_url: "/templates/ecommerce-store",
        is_premium: true,
        price: 49,
        is_active: true,
        is_featured: true,
        rating: 4.7,
        blueprint: {
            id: "ecommerce-store-blueprint",
            name: "E-Commerce Store",
            description: "Online store website",
            theme: {
                primary: "#22c55e",
                secondary: "#15803d",
                accent: "#eab308",
                fontFamily: "Inter",
                mode: "light"
            },
            navigation: {
                logo: "E-Commerce Store",
                links: [],
                transparent: false
            },
            layout: [],
            footer: {
                copyright: "© 2024 E-Commerce Store. All rights reserved.",
                links: [],
                social: {}
            },
            metadata: {},
            timestamp: new Date().toISOString()
        }
    },
    {
        name: "Medical Clinic",
        slug: "medical-clinic",
        description: "Professional healthcare website for clinics, hospitals, and medical practices",
        category: "medical",
        tags: ["medical", "healthcare", "clinic", "hospital", "professional"],
        features: ["Services List", "Doctors Team", "Appointments", "Testimonials", "Emergency Contact"],
        thumbnail_url: "/images/medical-clinic.png",
        preview_url: "/templates/medical-clinic",
        is_premium: false,
        is_active: true,
        is_featured: true,
        rating: 4.6,
        blueprint: {
            id: "medical-clinic-blueprint",
            name: "Medical Clinic",
            description: "Healthcare website",
            theme: {
                primary: "#0ea5e9",
                secondary: "#0369a1",
                accent: "#14b8a6",
                fontFamily: "Inter",
                mode: "light"
            },
            navigation: {
                logo: "Medical Clinic",
                links: [],
                transparent: false
            },
            layout: [],
            footer: {
                copyright: "© 2024 Medical Clinic. All rights reserved.",
                links: [],
                social: {}
            },
            metadata: {},
            timestamp: new Date().toISOString()
        }
    },
    {
        name: "Luxury Restaurant",
        slug: "restaurant-luxury",
        description: "Elegant dining experience website for upscale restaurants",
        category: "restaurant",
        tags: ["restaurant", "food", "dining", "luxury", "elegant"],
        features: ["Menu Section", "Reservations", "Gallery", "About Story", "Reviews"],
        thumbnail_url: "/images/restaurant-luxury.png",
        preview_url: "/templates/restaurant-luxury",
        is_premium: true,
        price: 39,
        is_active: true,
        is_featured: true,
        rating: 4.8,
        blueprint: {
            id: "luxury-restaurant-blueprint",
            name: "Luxury Restaurant",
            description: "Fine dining website",
            theme: {
                primary: "#b45309",
                secondary: "#78350f",
                accent: "#d97706",
                fontFamily: "Playfair Display",
                mode: "dark"
            },
            navigation: {
                logo: "Luxury Restaurant",
                links: [],
                transparent: false
            },
            layout: [],
            footer: {
                copyright: "© 2024 Luxury Restaurant. All rights reserved.",
                links: [],
                social: {}
            },
            metadata: {},
            timestamp: new Date().toISOString()
        }
    },
    {
        name: "Real Estate Agency",
        slug: "realestate-agency",
        description: "Property listings and agent profiles for real estate businesses",
        category: "realestate",
        tags: ["realestate", "property", "housing", "agents", "listings"],
        features: ["Property Listings", "Agent Profiles", "Search Filters", "Featured Properties", "Contact"],
        thumbnail_url: "/images/realestate-agency.png",
        preview_url: "/templates/realestate-agency",
        is_premium: false,
        is_active: true,
        is_featured: false,
        rating: 4.5,
        blueprint: {
            id: "realestate-agency-blueprint",
            name: "Real Estate Agency",
            description: "Property website",
            theme: {
                primary: "#6366f1",
                secondary: "#4338ca",
                accent: "#8b5cf6",
                fontFamily: "Inter",
                mode: "light"
            },
            navigation: {
                logo: "Real Estate Agency",
                links: [],
                transparent: false
            },
            layout: [],
            footer: {
                copyright: "© 2024 Real Estate Agency. All rights reserved.",
                links: [],
                social: {}
            },
            metadata: {},
            timestamp: new Date().toISOString()
        }
    },
    {
        name: "SaaS Dashboard",
        slug: "saas-dashboard",
        description: "Modern SaaS landing page with pricing and feature comparisons",
        category: "saas",
        tags: ["saas", "software", "dashboard", "app", "pricing"],
        features: ["Pricing Tables", "Feature Grid", "Integration Logos", "Testimonials", "CTA"],
        thumbnail_url: "/images/saas-dashboard.png",
        preview_url: "/templates/saas-dashboard",
        is_premium: true,
        price: 59,
        is_active: true,
        is_featured: true,
        rating: 4.9,
        blueprint: {
            id: "saas-dashboard-blueprint",
            name: "SaaS Dashboard",
            description: "Software landing page",
            theme: {
                primary: "#8b5cf6",
                secondary: "#6d28d9",
                accent: "#06b6d4",
                fontFamily: "Inter",
                mode: "dark"
            },
            navigation: {
                logo: "SaaS Dashboard",
                links: [],
                transparent: false
            },
            layout: [],
            footer: {
                copyright: "© 2024 SaaS Dashboard. All rights reserved.",
                links: [],
                social: {}
            },
            metadata: {},
            timestamp: new Date().toISOString()
        }
    },
    {
        name: "Business Corporate",
        slug: "business-corporate",
        description: "Professional corporate website for established businesses",
        category: "business",
        tags: ["business", "corporate", "professional", "company", "services"],
        features: ["About Company", "Services", "Team", "Case Studies", "Contact", "Careers"],
        thumbnail_url: "/images/business-corporate.png",
        preview_url: "/templates/business-corporate",
        is_premium: false,
        is_active: true,
        is_featured: false,
        rating: 4.4,
        blueprint: {
            id: "business-corporate-blueprint",
            name: "Business Corporate",
            description: "Corporate website",
            theme: {
                primary: "#1e293b",
                secondary: "#0f172a",
                accent: "#3b82f6",
                fontFamily: "Inter",
                mode: "light"
            },
            navigation: {
                logo: "Business Corporate",
                links: [],
                transparent: false
            },
            layout: [],
            footer: {
                copyright: "© 2024 Business Corporate. All rights reserved.",
                links: [],
                social: {}
            },
            metadata: {},
            timestamp: new Date().toISOString()
        }
    },
];

export const TemplateService = {
    /**
     * Get all templates with optional filtering
     */
    async getTemplates(filters?: TemplateFilters): Promise<Template[]> {
        try {
            const supabase = await createClient();

            let query = supabase
                .from('templates')
                .select('*')
                .eq('is_active', true);

            if (filters?.category) {
                query = query.eq('category', filters.category);
            }

            if (filters?.is_premium !== undefined) {
                query = query.eq('is_premium', filters.is_premium);
            }

            if (filters?.is_featured !== undefined) {
                query = query.eq('is_featured', filters.is_featured);
            }

            if (filters?.search) {
                query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
            }

            if (filters?.tags && filters.tags.length > 0) {
                query = query.contains('tags', filters.tags);
            }

            // Pagination
            const limit = filters?.limit || 50;
            const offset = filters?.offset || 0;
            query = query.range(offset, offset + limit - 1);

            // Sorting
            query = query.order('is_featured', { ascending: false })
                .order('rating', { ascending: false });

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching templates:', error);
                return this.getDefaultTemplates();
            }

            return data as Template[];
        } catch (error) {
            console.error('Template service error:', error);
            return this.getDefaultTemplates();
        }
    },

    /**
     * Get a single template by ID
     */
    async getTemplateById(id: string): Promise<Template | null> {
        try {
            const supabase = await createClient();

            const { data, error } = await supabase
                .from('templates')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching template:', error);
                // Return from defaults if DB fails
                return this.getDefaultTemplates().find(t => t.id === id) || null;
            }

            return data as Template;
        } catch (error) {
            console.error('Template service error:', error);
            return this.getDefaultTemplates().find(t => t.id === id) || null;
        }
    },

    /**
     * Get templates by category
     */
    async getTemplatesByCategory(category: TemplateCategory): Promise<Template[]> {
        return this.getTemplates({ category });
    },

    /**
     * Get featured templates
     */
    async getFeaturedTemplates(limit: number = 6): Promise<Template[]> {
        return this.getTemplates({ is_featured: true, limit });
    },

    /**
     * Get premium templates
     */
    async getPremiumTemplates(limit: number = 10): Promise<Template[]> {
        return this.getTemplates({ is_premium: true, limit });
    },

    /**
     * Get free templates
     */
    async getFreeTemplates(limit: number = 10): Promise<Template[]> {
        return this.getTemplates({ is_premium: false, limit });
    },

    /**
     * Search templates
     */
    async searchTemplates(query: string, limit: number = 20): Promise<Template[]> {
        return this.getTemplates({ search: query, limit });
    },

    /**
     * Get template statistics
     */
    async getTemplateStats(): Promise<TemplateStats> {
        try {
            const supabase = await createClient();

            const { data, error } = await supabase
                .from('templates')
                .select('*')
                .eq('is_active', true);

            if (error) {
                console.error('Error fetching template stats:', error);
                const defaults = this.getDefaultTemplates();
                return {
                    total_templates: defaults.length,
                    total_categories: new Set(defaults.map(t => t.category)).size,
                    most_popular: defaults.slice(0, 5),
                    newest_additions: defaults.slice(0, 5)
                };
            }

            const templates = data as Template[];

            return {
                total_templates: templates.length,
                total_categories: new Set(templates.map(t => t.category)).size,
                most_popular: templates
                    .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
                    .slice(0, 5),
                newest_additions: templates
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5)
            };
        } catch (error) {
            console.error('Template stats error:', error);
            const defaults = this.getDefaultTemplates();
            return {
                total_templates: defaults.length,
                total_categories: new Set(defaults.map(t => t.category)).size,
                most_popular: defaults.slice(0, 5),
                newest_additions: defaults.slice(0, 5)
            };
        }
    },

    /**
     * Get related templates based on category and tags
     */
    async getRelatedTemplates(templateId: string, limit: number = 4): Promise<Template[]> {
        try {
            const template = await this.getTemplateById(templateId);
            if (!template) return [];

            const supabase = await createClient();

            const { data, error } = await supabase
                .from('templates')
                .select('*')
                .eq('category', template.category)
                .neq('id', templateId)
                .eq('is_active', true)
                .limit(limit);

            if (error) {
                console.error('Error fetching related templates:', error);
                return this.getDefaultTemplates()
                    .filter(t => t.category === template.category && t.id !== templateId)
                    .slice(0, limit);
            }

            return data as Template[];
        } catch (error) {
            console.error('Related templates error:', error);
            return [];
        }
    },

    /**
     * Get default templates (fallback when DB is unavailable)
     */
    getDefaultTemplates(): Template[] {
        const now = new Date().toISOString();
        return DEFAULT_TEMPLATES.map((template, index) => ({
            ...template,
            id: `default-${index}`,
            created_at: now,
            updated_at: now,
            usage_count: 0
        }));
    },

    /**
     * Get all available categories
     */
    getCategories(): { id: TemplateCategory; name: string; count: number }[] {
        const defaults = this.getDefaultTemplates();
        const categories: TemplateCategory[] = [
            'business', 'restaurant', 'portfolio', 'ecommerce',
            'saas', 'medical', 'realestate', 'education',
            'personal', 'blog', 'landing'
        ];

        return categories.map(cat => ({
            id: cat,
            name: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' '),
            count: defaults.filter(t => t.category === cat).length
        })).filter(cat => cat.count > 0);
    },

    /**
     * Recommend templates based on user preferences
     */
    async recommendTemplates(preferences: {
        category?: TemplateCategory;
        tags?: string[];
        budget?: 'free' | 'premium';
    }, limit: number = 5): Promise<Template[]> {
        const filters: TemplateFilters = {
            limit,
            tags: preferences.tags
        };

        if (preferences.category) {
            filters.category = preferences.category;
        }

        if (preferences.budget === 'free') {
            filters.is_premium = false;
        } else if (preferences.budget === 'premium') {
            filters.is_premium = true;
        }

        return this.getTemplates(filters);
    }
};
