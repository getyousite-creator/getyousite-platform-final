import { createClient } from "@/lib/supabase/server";
import TemplateRenderer from "@/templates/TemplateRenderer";
import { notFound } from "next/navigation";

export const revalidate = 0; // Sovereign Logic: Real-time rendering enabled.

interface SiteRendererProps {
    params: Promise<{ locale: string; hostname: string }>;
}

export default async function SiteRendererPage({ params }: SiteRendererProps) {
    const { hostname } = await params;

    if (!hostname) {
        return notFound();
    }

    const supabase = await createClient();

    // Logic: Subdomain resolution (e.g. user.getyousite.com)
    // We treat the first part of the hostname as the unique slug.
    const slug = hostname.split(".")[0];

    const { data: storeData, error } = await supabase
        .from("stores")
        .select("*")
        .eq("status", "deployed")
        .or(`slug.eq."${slug}",custom_domain.eq."${hostname}"`)
        .maybeSingle();

    if (error || !storeData) {
        console.error(
            `[RENDERER_ERROR] Store not found or inactive for: ${hostname}`,
            error?.message,
        );
        return (
            <div className="flex h-screen items-center justify-center bg-[#0A2540] text-white">
                <div className="text-center space-y-6 max-w-md px-8">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10">
                        <span className="text-xl font-bold text-zinc-500">404</span>
                    </div>
                    <h1 className="text-xl font-black uppercase tracking-widest text-white/90 font-mono">
                        Identity Not Found
                    </h1>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] leading-relaxed">
                        This digital asset is not yet established on the Sovereign Grid or is
                        currently undergoing neural reconstruction.
                    </p>
                    <div className="pt-8">
                        <a
                            href="https://getyousite.com"
                            className="text-[10px] font-black uppercase tracking-widest text-[#00D09C] hover:underline"
                        >
                            Establish Your Empire →
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <TemplateRenderer
            templateId={storeData.template_id || "corp-global"}
            blueprint={storeData.blueprint as any} // eslint-disable-line @typescript-eslint/no-explicit-any
            meta={{
                id: storeData.id,
                name: storeData.name,
            }}
        />
    );
}
