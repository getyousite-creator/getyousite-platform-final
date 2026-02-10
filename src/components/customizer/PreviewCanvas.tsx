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

                {/* ZERO FRICTION HUD (Protocol 2.2) */}
                {isGenerating && (
                    <div className="absolute top-8 left-8 p-8 bg-black/90 backdrop-blur-3xl rounded-[2rem] border border-white/10 z-50 pointer-events-none space-y-4 shadow-3xl animate-in fade-in zoom-in duration-700">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                                <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white">Neural_Link_Established</span>
                        </div>
                        <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-[load_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] text-primary font-black uppercase tracking-widest">Injecting_Strategic_Logic...</p>
                            <p className="text-[9px] text-white/20 font-mono uppercase">Ref: GYS-UX-0</p>
                        </div>
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
