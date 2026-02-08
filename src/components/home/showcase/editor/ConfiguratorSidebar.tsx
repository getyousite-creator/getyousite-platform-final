"use client";

import { Settings, Palette, Type, Layout, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { motion, AnimatePresence } from "framer-motion";

interface ConfiguratorSidebarProps {
    onEdit: (action: string, key?: any, value?: string) => void;
    onLaunch: () => void;
}

export default function ConfiguratorSidebar({ onEdit, onLaunch }: ConfiguratorSidebarProps) {
    return (
        <div className="w-full md:w-[400px] bg-card border-l border-border p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-8">
                <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-500" /> Deep Configurator
                    </h3>
                    <p className="text-muted-foreground text-sm">Real-time template injection & modification.</p>
                </div>

                {/* Categories of Controls */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Neural Palette</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Oceanic", color: "#3b82f6" },
                            { label: "Volcanic", color: "#ef4444" },
                            { label: "Boreal", color: "#10b981" },
                            { label: "Solar", color: "#f59e0b" },
                        ].map(p => (
                            <button
                                key={p.label}
                                onClick={() => onEdit("recoloring", "primaryColor", p.color)}
                                className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border hover:border-primary/50 transition-all group"
                            >
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.color }} />
                                <span className="text-xs text-muted-foreground group-hover:text-foreground font-medium">{p.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Core Directives</label>
                    <div className="space-y-3">
                        <button
                            onClick={() => onEdit("updating text", "headline", "Design the Impossible with Neura")}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary border border-border hover:bg-secondary/80 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <Type className="w-4 h-4 text-purple-400" />
                                <span className="text-xs text-muted-foreground font-medium group-hover:text-foreground">New Viral Headline</span>
                            </div>
                        </button>
                        <button
                            onClick={() => onEdit("restructuring", "subheadline", "Deploy at the speed of thought. 100% Native Architecture.")}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary border border-border hover:bg-secondary/80 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <Layout className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs text-muted-foreground font-medium group-hover:text-foreground">Optimized Copy</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Zap className="w-3 h-3 fill-current" /> Engine Active
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                        Sovereign Engine sync active. Prop injection verified.
                    </p>
                </div>
            </div>

            <div className="pt-8 mt-8 border-t border-border">
                <Button
                    variant="glow"
                    className="w-full h-14 rounded-xl text-md shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                    onClick={onLaunch}
                >
                    Deploy Full Architecture
                </Button>
            </div>
        </div>
    );
}
