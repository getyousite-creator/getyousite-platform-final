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
        <div className="w-full flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-white/60">
                <button
                    onClick={() => onChange("mobile")}
                    className={`px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1 ${activeDevice === "mobile" ? "bg-white/10 text-lime-200" : "hover:bg-white/5"}`}
                >
                    <Smartphone size={14} /> Mobile
                </button>
                <button
                    onClick={() => onChange("tablet")}
                    className={`px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1 ${activeDevice === "tablet" ? "bg-white/10 text-lime-200" : "hover:bg-white/5"}`}
                >
                    <Tablet size={14} /> Tablet
                </button>
                <button
                    onClick={() => onChange("desktop")}
                    className={`px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1 ${activeDevice === "desktop" ? "bg-white/10 text-lime-200" : "hover:bg-white/5"}`}
                >
                    <MonitorSmartphone size={14} /> Desktop
                </button>
            </div>

            <motion.div
                animate={{ width: widths[activeDevice] }}
                transition={{ type: "spring", stiffness: 240, damping: 30 }}
                className="mx-auto border-[8px] border-[#0a0a0a] rounded-[2rem] overflow-hidden shadow-2xl bg-black/50 touch-auto"
                style={{ maxWidth: "100%", minHeight: "60vh" }}
            >
                {children}
            </motion.div>
        </div>
    );
}
