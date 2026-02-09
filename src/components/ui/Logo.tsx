"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    showText?: boolean;
}

export default function Logo({ className, showText = true, ...props }: LogoProps) {
    return (
        <div
            className={cn("flex items-center gap-3 select-none group cursor-pointer", className)}
            {...props}
        >
            <div className="relative flex items-center justify-center">
                {/* Scientific Geometric Core */}
                <div className="w-9 h-9 border-2 border-muted-foreground/30 rounded-lg rotate-45 group-hover:border-primary transition-colors duration-500" />
                <div className="absolute w-4 h-4 bg-primary rounded-sm rotate-45 group-hover:scale-125 group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.6)] transition-all duration-500" />

                {/* Secondary Orbit */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-border/50 rounded-full -m-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                />
            </div>

            {showText && (
                <div className="flex flex-col -space-y-1.5 pt-0.5">
                    <span className="text-2xl font-black tracking-[-0.05em] text-foreground leading-none">GETYOUSITE</span>
                </div>
            )}
        </div>
    );
}
