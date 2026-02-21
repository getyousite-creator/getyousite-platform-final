/**
 * Nexus Dashboard Protocol - Core Layout
 * 
 * "The Invisible UI" - Progressive Information Density
 * Zero-latency architecture with Next.js 16 Parallel Routes
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CommandPalette } from "./command-palette";
import { SidebarNavigation } from "./sidebar-navigation";
import { UserPulseStatus } from "./user-pulse-status";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface DashboardLayoutProps {
    children: React.ReactNode;
    initialDensity?: "low" | "medium" | "high";
}

export interface DashboardContext {
    density: "low" | "medium" | "high";
    setDensity: (density: "low" | "medium" | "high") => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    commandPaletteOpen: boolean;
    setCommandPaletteOpen: (open: boolean) => void;
}

// ============================================================================
// DASHBOARD CONTEXT
// ============================================================================

const DashboardContext = React.createContext<DashboardContext | undefined>(undefined);

export function useDashboard() {
    const context = React.useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within DashboardProvider");
    }
    return context;
}

// ============================================================================
// DASHBOARD LAYOUT COMPONENT
// ============================================================================

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    initialDensity = "low",
}) => {
    // Progressive Information Density State
    const [density, setDensity] = useState<"low" | "medium" | "high">(initialDensity);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const [sidebarHovered, setSidebarHovered] = useState(false);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+K or Cmd+K for Command Palette
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setCommandPaletteOpen((prev) => !prev);
            }

            // Ctrl+B or Cmd+B for Sidebar toggle
            if ((e.ctrlKey || e.metaKey) && e.key === "b") {
                e.preventDefault();
                setSidebarOpen((prev) => !prev);
            }

            // Escape to close palette
            if (e.key === "Escape") {
                setCommandPaletteOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Auto-adjust density based on viewport
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setDensity("low");
                setSidebarOpen(false);
            } else if (window.innerWidth < 1280) {
                setDensity("medium");
            } else {
                setDensity("high");
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <DashboardContext.Provider
            value={{
                density,
                setDensity,
                sidebarOpen,
                setSidebarOpen,
                commandPaletteOpen,
                setCommandPaletteOpen,
            }}
        >
            <div className="flex h-screen overflow-hidden bg-neutral-obsidian text-white">
                {/* Sidebar - Glassmorphism with variable transparency */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 256, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="border-r border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
                            onMouseEnter={() => setSidebarHovered(true)}
                            onMouseLeave={() => setSidebarHovered(false)}
                        >
                            <SidebarNavigation density={density} />
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Header - Command Palette + User Status */}
                    <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 flex-shrink-0">
                        <div className="flex items-center gap-4">
                            {/* Density Toggle */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-white/10 rounded-[8px] transition-colors"
                                aria-label="Toggle sidebar"
                            >
                                <SidebarIcon />
                            </button>

                            {/* Command Palette Trigger */}
                            <button
                                onClick={() => setCommandPaletteOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[8px] transition-all"
                            >
                                <SearchIcon />
                                <span className="text-sm text-neutral-slate">
                                    Search...
                                </span>
                                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-neutral-light bg-neutral/50 rounded">
                                    <span>⌘</span>K
                                </kbd>
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Density Indicator */}
                            <DensityIndicator density={density} />

                            {/* User Pulse Status */}
                            <UserPulseStatus />
                        </div>
                    </header>

                    {/* Content Area - Smooth page transitions */}
                    <section className="flex-1 overflow-y-auto custom-scrollbar">
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="p-8"
                        >
                            {children}
                        </motion.div>
                    </section>
                </main>

                {/* Command Palette Modal */}
                <CommandPalette
                    open={commandPaletteOpen}
                    onOpenChange={setCommandPaletteOpen}
                />
            </div>
        </DashboardContext.Provider>
    );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function SidebarIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

interface DensityIndicatorProps {
    density: "low" | "medium" | "high";
}

function DensityIndicator({ density }: DensityIndicatorProps) {
    return (
        <div className="flex items-center gap-2 text-xs text-neutral-slate">
            <span>Density:</span>
            <span className={`px-2 py-1 rounded-[4px] ${
                density === "low" ? "bg-primary/20 text-primary" :
                density === "medium" ? "bg-accent/20 text-accent" :
                "bg-neutral-slate/50 text-white"
            }`}>
                {density.toUpperCase()}
            </span>
        </div>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    DashboardLayout,
    useDashboard,
};
