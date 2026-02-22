/**
 * Sidebar Navigation - Placeholder
 */

"use client";

import React from "react";
import { motion } from "framer-motion";

interface SidebarNavigationProps {
    density: "low" | "medium" | "high";
    sidebarOpen?: boolean;
    setSidebarOpen?: (open: boolean) => void;
}

export function SidebarNavigation({ density, sidebarOpen, setSidebarOpen }: SidebarNavigationProps) {
    return (
        <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: sidebarOpen ? 256 : 0, opacity: sidebarOpen ? 1 : 0 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-r border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
        >
            <div className="p-4">
                <p className="text-sm text-neutral-slate">Navigation</p>
            </div>
        </motion.aside>
    );
}
