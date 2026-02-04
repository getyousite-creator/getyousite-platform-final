import { z } from 'zod';

export const LeadSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    vision: z.string().min(10, { message: "Vision description must be at least 10 characters" }),
    budget: z.enum(["starter", "pro", "business", "enterprise"]),
    siteType: z.enum(["blog", "business", "store"])
});

export type LeadFormValues = z.infer<typeof LeadSchema>;

// SOVEREIGN JSON BLUEPRINT SCHEMA
export const SectionSchema = z.object({
    id: z.string(),
    type: z.enum([
        "hero",
        "features",
        "pricing",
        "testimonials",
        "cta",
        "gallery",
        "benefits",
        "trust_bar",
        "faq",
        "contact_map",
        "custom"
    ]),
    content: z.record(z.string(), z.any()),
    styles: z.record(z.string(), z.any()).optional(),
    animation: z.enum(["fade-in", "slide-up", "zoom-in", "none"]).optional(),
});

export const SiteBlueprintSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    description: z.string(),
    navigation: z.object({
        logo: z.string().optional(),
        links: z.array(z.object({ label: z.string(), href: z.string() })),
        transparent: z.boolean().optional(),
    }).optional(),
    theme: z.object({
        primary: z.string(),
        secondary: z.string(),
        accent: z.string().optional(),
        fontFamily: z.string(),
        mode: z.enum(["light", "dark", "quantum"]),
    }),
    layout: z.array(SectionSchema),
    footer: z.object({
        copyright: z.string(),
        links: z.array(z.object({ label: z.string(), href: z.string() })),
        social: z.record(z.string(), z.string()).optional(),
    }).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
    timestamp: z.string().optional(),
});

export type Section = z.infer<typeof SectionSchema>;
export type SiteBlueprint = z.infer<typeof SiteBlueprintSchema>;
