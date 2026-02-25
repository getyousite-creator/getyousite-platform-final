"use client";

import { LivePreview } from "@/components/engine/LivePreview";
import { Sparkles } from "lucide-react";
import { SynthesisLoadingHUD } from "./SynthesisLoadingHUD";
import type { SiteBlueprint } from "@/lib/schemas";
import { useState } from "react";
import { ViewportController } from "./ViewportController";

interface PreviewCanvasProps {
    blueprint: SiteBlueprint | null;
    isGenerating: boolean;
    selectedPageSlug?: string;
    onTextChange?: (sectionId: string, text: string) => void;
    onReorder?: (sourceId: string, targetId: string) => void;
}

export function PreviewCanvas({ blueprint, isGenerating, selectedPageSlug, onTextChange, onReorder }: PreviewCanvasProps) {
    const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");

    return (
        <div className="w-full max-w-5xl h-full flex flex-col items-center justify-center space-y-6">
            <div className="flex items-center gap-4 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={12} className="text-blue-500" />
                Live_Strategic_Preview
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <ViewportController activeDevice={device} onChange={setDevice}>
                <div className="relative w-full h-full">
                    <LivePreview
                        config={blueprint}
                        isGenerating={isGenerating}
                        selectedPageSlug={selectedPageSlug}
                        onTextChange={onTextChange}
                        onReorder={onReorder}
                    />

                    {/* SOVEREIGN SYNTHESIS HUD (Protocol 4.0) */}
                    {isGenerating && <SynthesisLoadingHUD />}
                </div>
            </ViewportController>

            <div className="flex gap-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-blue-500" /> LCP: 0.8s</span>
                <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-blue-500" /> FID: 12ms</span>
                <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-blue-500" /> CLS: 0.01</span>
            </div>
        </div>
    );
}
