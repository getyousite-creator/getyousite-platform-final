"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Tablet, MonitorSmartphone } from "lucide-react";

type Device = "mobile" | "tablet" | "desktop";

interface Props {
    activeDevice: Device;
    onChange: (d: Device) => void;
    children: React.ReactNode;
}

const widths: Record<Device, string> = {
    mobile: "375px",
    tablet: "768px",
    desktop: "100%",
};

export function ViewportController({ activeDevice, onChange, children }: Props) {
    return (
        <div className="w-full flex flex-col items-center gap-8">
            {/* Tactical Toggle - Glassmorphism */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl">
                {[
                    { id: "mobile", icon: Smartphone, label: "Mobile" },
                    { id: "tablet", icon: Tablet, label: "Tablet" },
                    { id: "desktop", icon: MonitorSmartphone, label: "Desktop" },
                ].map((d) => (
                    <button
                        key={d.id}
                        onClick={() => onChange(d.id as Device)}
                        className={`
                            px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300
                            ${activeDevice === d.id
                                ? "bg-neon-lime text-obsidian shadow-vip-glow"
                                : "text-white/40 hover:text-white hover:bg-white/5"}
                        `}
                    >
                        <d.icon size={14} className={activeDevice === d.id ? "animate-pulse" : ""} />
                        <span>{d.label}</span>
                    </button>
                ))}
            </div>

            {/* Strategic Viewport Frame */}
            <div className="w-full h-full flex justify-center">
                <motion.div
                    animate={{ width: widths[activeDevice] }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="relative border-[12px] border-obsidian rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden bg-black/40"
                    style={{ maxWidth: "100%", height: "calc(100vh - 250px)", minHeight: "600px" }}
                >
                    {/* Status Bar Mockup */}
                    <div className="absolute top-0 inset-x-0 h-6 bg-obsidian flex items-center justify-between px-8 z-50">
                        <div className="text-[8px] font-black text-white/20 tracking-tighter uppercase italic">Sovereign_OS_v6.5</div>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-neon-lime/40" />
                            <div className="w-1 h-1 rounded-full bg-neon-lime/40" />
                            <div className="w-1 h-1 rounded-full bg-neon-lime/20" />
                        </div>
                    </div>

                    <div className="w-full h-full pt-6">
                        {children}
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/10 rounded-full z-50" />
                </motion.div>
            </div>
        </div>
    );
}
