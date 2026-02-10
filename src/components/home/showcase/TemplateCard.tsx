"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Eye, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Template } from "@/data/template-data";
import { useRouter } from "next/navigation";

interface TemplateCardProps {
    template: Template;
    onClick: (template: Template) => void;
}

export default function TemplateCard({ template, onClick }: TemplateCardProps) {
    const router = useRouter();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative"
        >
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-border bg-card transition-all duration-700 group-hover:border-blue-500/40 group-hover:shadow-[0_8px_16px_rgba(59,130,246,0.2)]">
                <div className="absolute top-0 left-0 right-0 h-10 bg-card/80 backdrop-blur-xl flex items-center px-6 justify-between z-20 border-b border-border">
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-secondary transition-colors group-hover:bg-red-500/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-secondary transition-colors group-hover:bg-yellow-500/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-secondary transition-colors group-hover:bg-green-500/30" />
                    </div>
                    <div className="px-3 py-1 bg-secondary/10 rounded-full border border-border">
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{template.id}.blueprint_manifest</span>
                    </div>
                </div>

                {/* Image with High-Fidelity Scroll */}
                <div className="w-full h-full pt-10 relative overflow-hidden">
                    <Image
                        src={template.image}
                        alt={template.title}
                        fill
                        className="object-cover object-top transition-transform duration-[6000ms] ease-out group-hover:scale-105 group-hover:translate-y-[20%]"
                    />
                </div>

                {/* Premium Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 backdrop-blur-xl bg-card/95 z-30 border-t border-border">
                    <div className="flex gap-4">
                        <Button
                            onClick={() => window.open(template.demoUrl, '_blank')}
                            className="flex-1 h-12 rounded-xl bg-secondary/20 border border-border hover:bg-secondary/30 text-foreground font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all"
                        >
                            <ExternalLink className="w-3.5 h-3.5" /> LIVE PREVIEW
                        </Button>
                        <Button
                            onClick={() => router.push('/signup')}
                            className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all"
                        >
                            <CheckCircle className="w-3.5 h-3.5" /> SELECT INDUSTRIAL PILLAR
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-8 px-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight uppercase">
                        {template.title}
                    </h3>
                    {template.badge && (
                        <span className="text-[8px] font-black text-blue-500 border border-blue-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest">
                            {template.badge}
                        </span>
                    )}
                </div>
                <p className="text-muted-foreground text-xs font-bold line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                    {template.desc}
                </p>
            </div>
        </motion.div>
    );
}
