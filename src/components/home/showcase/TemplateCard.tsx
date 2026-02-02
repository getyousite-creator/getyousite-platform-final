"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Template } from "@/data/template-data";

interface TemplateCardProps {
    template: Template;
    onClick: (template: Template) => void;
}

export default function TemplateCard({ template, onClick }: TemplateCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative cursor-pointer"
            onClick={() => onClick(template)}
        >
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-slate-800 bg-slate-900 transition-all duration-700 group-hover:border-blue-500/40 group-hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),0_0_40px_-15px_rgba(59,130,246,0.2)]">
                {/* Browser Chrome UI - Clinical */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-slate-950/90 backdrop-blur-xl flex items-center px-6 gap-2.5 z-20 border-b border-white/5">
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-800 transition-colors group-hover:bg-red-500/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-800 transition-colors group-hover:bg-yellow-500/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-800 transition-colors group-hover:bg-green-500/30" />
                    </div>
                </div>

                {/* Image with High-Fidelity Scroll */}
                <div className="w-full h-full pt-10 relative overflow-hidden">
                    <Image
                        src={template.image}
                        alt={template.title}
                        fill
                        className="object-cover object-top transition-transform duration-[6000ms] ease-out group-hover:scale-110 group-hover:translate-y-[25%]"
                    />
                </div>

                {/* Premium Hover Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-md bg-slate-950/30 z-30">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent" />
                    <Button variant="premium" className="relative h-14 px-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black tracking-widest uppercase text-[10px] shadow-2xl transition-all active:scale-95">
                        <Eye className="w-4 h-4 mr-2.5" /> Launch Reactor Preview
                    </Button>
                </div>
            </div>

            <div className="mt-8 px-2">
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors tracking-tight uppercase">
                    {template.title}
                </h3>
                <p className="text-slate-500 text-sm font-semibold line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {template.desc}
                </p>
            </div>
        </motion.div>
    );
}
