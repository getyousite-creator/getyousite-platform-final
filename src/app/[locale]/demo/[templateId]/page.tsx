"use client";

import { useParams } from "next/navigation";
import { SITE_TEMPLATES } from "@/lib/templates";
import { LivePreview } from "@/components/engine/LivePreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function DemoPage() {
    const params = useParams();
    const router = useRouter();
    const t = useTranslations('Showcase'); // Reusing Showcase translations

    // 1. Resolve Template ID
    const templateId = params.templateId as string;

    // 2. Find Blueprint
    const allThemes = SITE_TEMPLATES.categories.flatMap(c => c.themes);
    const theme = allThemes.find(t => t.id === templateId);

    // 3. Fallback Blueprint (if ID matches but no blueprint exists yet)
    // Using a default blueprint if specific one is missing to ensure functionality
    const activeBlueprint = theme?.blueprint || allThemes[0]?.blueprint;

    if (!activeBlueprint) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Blueprint Not Found</h1>
                    <Button onClick={() => router.back()}>Return to Base</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            {/* Demo Header */}
            <div className="h-16 bg-slate-950 flex items-center justify-between px-6 border-b border-white/10 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="text-slate-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-white text-sm font-bold uppercase tracking-widest">
                            {theme?.name || templateId}
                        </h1>
                        <span className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em]">Live Preview</span>
                    </div>
                </div>

                <Button
                    onClick={() => router.push('/signup')}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest px-6"
                >
                    {t('preview') /* Reuse existing key or "Select Template" */}
                </Button>
            </div>

            {/* Preview Canvas */}
            <div className="flex-1 overflow-hidden bg-zinc-200 p-4 md:p-8 flex items-center justify-center">
                <div className="w-full h-full max-w-[1400px] shadow-2xl rounded-2xl overflow-hidden bg-white">
                    <LivePreview config={activeBlueprint} isGenerating={false} />
                </div>
            </div>
        </div>
    );
}
