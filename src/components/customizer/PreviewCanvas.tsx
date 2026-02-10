"use client";

import { LivePreview } from "@/components/engine/LivePreview";
import { Sparkles } from "lucide-react";
import { SiteBlueprint } from "@/lib/schemas";

interface PreviewCanvasProps {
    blueprint: SiteBlueprint | null;
    isGenerating: boolean;
    selectedPageSlug?: string;
}

export function PreviewCanvas({ blueprint, isGenerating, selectedPageSlug }: PreviewCanvasProps) {
    return (
        <div className="w-full max-w-5xl h-full flex flex-col items-center justify-center space-y-6">
            <div className="flex items-center gap-4 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={12} className="text-blue-500" />
                Live_Neural_Preview
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="w-full h-[80vh] bg-card rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.08)] overflow-hidden border border-border relative group">
                {/* Visual Polish: Glass Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-background/5 via-transparent to-transparent pointer-events-none opacity-50" />

                <LivePreview config={blueprint} isGenerating={isGenerating} selectedPageSlug={selectedPageSlug} />

                {/* ZERO FRICTION HUD */}
                {isGenerating && (
                    <div className="absolute top-8 left-8 p-6 bg-black/80 backdrop-blur-2xl rounded-2xl border border-white/10 z-50 pointer-events-none space-y-3 shadow-2xl animate-in fade-in zoom-in duration-500">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">جري إعادة بناء رؤيتك...</span>
                        </div>
                        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 animate-load" style={{ width: '60%' }} />
                        </div>
                        <p className="text-[9px] text-white/40 font-mono uppercase">Neural_Link: Established</p>
                    </div>
                )}
            </div>

            <div className="flex gap-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-blue-500" /> LCP: 0.8s</span>
                <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-blue-500" /> FID: 12ms</span>
                <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-blue-500" /> CLS: 0.01</span>
            </div>
        </div>
    );
}
