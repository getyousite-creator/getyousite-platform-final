import { Metadata } from "next";
import { SiteBlueprint } from "@/lib/schemas";

/**
 * SOVEREIGN META ENGINE
 * Logic: Transcribes the SiteBlueprint into valid Next.js Metadata.
 * Ensures every generated site has immediate SEO utility.
 */
export class MetaEngine {
    static generateMetadata(blueprint: SiteBlueprint): Metadata {
        const { name, description, theme } = blueprint;

        // Extract hero content for description fallback
        const heroSection = blueprint.layout.find(s => s.type === 'hero');
        const heroTitle = heroSection?.content?.headline || name;
        const metaDesc = heroSection?.content?.subheadline || description;
        const heroImage = heroSection?.content?.image;

        return {
            title: `${heroTitle} | Developed with GetYouSite`,
            description: metaDesc,
            openGraph: {
                title: heroTitle,
                description: metaDesc,
                images: heroImage ? [{ url: heroImage }] : [],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: heroTitle,
                description: metaDesc,
                images: heroImage ? [heroImage] : [],
            },
            viewport: "width=device-width, initial-scale=1",
            themeColor: theme.primary,
        };
    }

    /**
     * Standard Metadata for Default Pages
     */
    static getStandardMetadata(title: string, description: string): Metadata {
        return {
            title: `${title} | GetYouSite platform`,
            description: description,
        };
    }
}
