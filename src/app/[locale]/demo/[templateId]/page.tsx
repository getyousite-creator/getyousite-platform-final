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
            <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Blueprint Not Found</h1>
                    <Button onClick={() => router.back()}>Return to Base</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted flex flex-col">
            {/* Demo Header */}
            <div className="h-16 bg-background flex items-center justify-between px-6 border-b border-border shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-foreground text-sm font-bold uppercase tracking-widest">
                            {theme?.name || templateId}
                        </h1>
                        <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Live Preview</span>
                    </div>
                </div>

                <Button
                    onClick={() => router.push('/signup')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black uppercase tracking-widest px-6"
                >
                    {t('preview') /* Reuse existing key or "Select Template" */}
                </Button>
            </div>

            {/* Preview Canvas */}
            <div className="flex-1 overflow-hidden bg-muted p-4 md:p-8 flex items-center justify-center">
                <div className="w-full h-full max-w-[1400px] shadow-2xl rounded-2xl overflow-hidden bg-white">
                    <LivePreview config={activeBlueprint} isGenerating={false} />
                </div>
            </div>
        </div>
    );
}
