import { createClient } from "@/lib/supabase/server";
import TemplateRenderer from "@/templates/TemplateRenderer";
import { notFound } from "next/navigation";

export const revalidate = 3600; // 1 hour ISR

interface SiteRendererProps {
    params: Promise<{ locale: string; hostname: string }>;
}

export default async function SiteRendererPage({ params }: SiteRendererProps) {
    const { hostname } = await params;

    if (!hostname) {
        return notFound();
    }

    const supabase = await createClient();

    // Detect if it's a subdomain (e.g. user.getyousite.com) or custom domain
    const subdomain = hostname.split('.')[0];

    const { data: siteData, error } = await supabase
        .from('sites')
        .select('*, template:templates(*)')
        .or(`subdomain.eq.${subdomain},custom_domain.eq.${hostname}`)
        .eq('published', true)
        .single();

    if (error || !siteData) {
        console.error("Critical: Site not found or unpublished.", error);
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-black uppercase tracking-widest text-zinc-700">Identity Not Found</h1>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">This site is not yet published in the Sovereign Grid.</p>
                </div>
            </div>
        );
    }

    // In Server Components, we can't use Client-side hooks, but TemplateRenderer is "use client"
    // and correctly injects the blueprint.
    return (
        <TemplateRenderer
            templateId={siteData.template_id}
            blueprint={siteData.data}
        />
    );
}
