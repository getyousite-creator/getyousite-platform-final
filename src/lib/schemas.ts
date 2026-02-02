import { z } from 'zod';

export const LeadSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    vision: z.string().min(10, { message: "Vision description must be at least 10 characters" }),
    budget: z.enum(["starter", "pro", "business", "enterprise"])
});

export type LeadFormValues = z.infer<typeof LeadSchema>;

// SOVEREIGN JSON BLUEPRINT SCHEMA
export const SectionSchema = z.object({
    id: z.string(),
    type: z.enum(["hero", "features", "pricing", "testimonials", "cta", "gallery", "custom"]),
    content: z.record(z.string(), z.any()),
    styles: z.record(z.string(), z.any()).optional(),
});

export const SiteBlueprintSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    description: z.string(),
    theme: z.object({
        primary: z.string(),
        secondary: z.string(),
        fontFamily: z.string(),
        mode: z.enum(["light", "dark", "quantum"]),
    }),
    layout: z.array(SectionSchema),
    metadata: z.record(z.string(), z.any()).optional(),
    timestamp: z.string().optional(),
});

export type Section = z.infer<typeof SectionSchema>;
export type SiteBlueprint = z.infer<typeof SiteBlueprintSchema>;
