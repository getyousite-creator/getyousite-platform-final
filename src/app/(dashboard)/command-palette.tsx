/**
 * Command Palette - The "Brain" of Nexus Dashboard
 * 
 * Features:
 * - Search pages
 * - Execute commands (e.g., "Change site to dark mode")
 * - Quick access to support
 * - Response time < 50ms
 * 
 * Built with cmdk for performance
 */

"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface CommandItem {
    id: string;
    label: string;
    shortcut?: string;
    icon?: React.ReactNode;
    action: () => void;
    category: "navigation" | "action" | "settings" | "support";
}

// ============================================================================
// COMMAND PALETTE COMPONENT
// ============================================================================

export const CommandPalette: React.FC<CommandPaletteProps> = ({
    open,
    onOpenChange,
}) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    // Command definitions
    const commands: CommandItem[] = [
        // Navigation
        {
            id: "nav-dashboard",
            label: "Dashboard",
            shortcut: "G H",
            icon: <DashboardIcon />,
            action: () => router.push("/dashboard"),
            category: "navigation",
        },
        {
            id: "nav-sites",
            label: "My Sites",
            shortcut: "G S",
            icon: <SitesIcon />,
            action: () => router.push("/dashboard/sites"),
            category: "navigation",
        },
        {
            id: "nav-analytics",
            label: "Analytics",
            shortcut: "G A",
            icon: <AnalyticsIcon />,
            action: () => router.push("/dashboard/analytics"),
            category: "navigation",
        },
        {
            id: "nav-settings",
            label: "Settings",
            shortcut: "G ,",
            icon: <SettingsIcon />,
            action: () => router.push("/dashboard/settings"),
            category: "navigation",
        },

        // Actions
        {
            id: "action-new-site",
            label: "Create New Site",
            shortcut: "N",
            icon: <PlusIcon />,
            action: () => router.push("/dashboard/sites/new"),
            category: "action",
        },
        {
            id: "action-dark-mode",
            label: "Toggle Dark Mode",
            icon: <MoonIcon />,
            action: () => document.documentElement.classList.toggle("dark"),
            category: "action",
        },
        {
            id: "action-export",
            label: "Export All Sites",
            icon: <ExportIcon />,
            action: () => console.log("Export triggered"),
            category: "action",
        },

        // Support
        {
            id: "support-docs",
            label: "Documentation",
            icon: <DocsIcon />,
            action: () => window.open("/docs", "_blank"),
            category: "support",
        },
        {
            id: "support-contact",
            label: "Contact Support",
            icon: <SupportIcon />,
            action: () => router.push("/dashboard/support"),
            category: "support",
        },
    ];

    // Filter commands based on search
    const filteredCommands = commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group by category
    const groupedCommands = filteredCommands.reduce(
        (acc, cmd) => {
            if (!acc[cmd.category]) {
                acc[cmd.category] = [];
            }
            acc[cmd.category].push(cmd);
            return acc;
        },
        {} as Record<string, CommandItem[]>
    );

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Global shortcuts
            if (e.key === "g" && !e.ctrlKey && !e.metaKey) {
                // Wait for next key
                const handleNextKey = (nextEvent: KeyboardEvent) => {
                    if (nextEvent.key === "h") {
                        router.push("/dashboard");
                    } else if (nextEvent.key === "s") {
                        router.push("/dashboard/sites");
                    } else if (nextEvent.key === "a") {
                        router.push("/dashboard/analytics");
                    }
                    window.removeEventListener("keydown", handleNextKey);
                };
                window.addEventListener("keydown", handleNextKey, { once: true });
            }

            if (e.key === "n" && !e.ctrlKey && !e.metaKey) {
                router.push("/dashboard/sites/new");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);

    return (
        <Command.Dialog
            open={open}
            onOpenChange={onOpenChange}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] bg-neutral-obsidian border border-white/10 rounded-[12px] shadow-2xl overflow-hidden"
            label="Command Palette"
        >
            {/* Search Input */}
            <div className="flex items-center border-b border-white/10 px-4">
                <SearchIcon />
                <Command.Input
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-white placeholder:text-neutral-slate"
                />
                {loading && <LoadingSpinner />}
            </div>

            {/* Command List */}
            <Command.List className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <Command.Empty className="py-6 text-center text-neutral-slate">
                    No commands found.
                </Command.Empty>

                {Object.entries(groupedCommands).map(([category, items]) => (
                    <Command.Group
                        key={category}
                        heading={category.charAt(0).toUpperCase() + category.slice(1)}
                        className="mb-2"
                    >
                        {items.map((cmd) => (
                            <Command.Item
                                key={cmd.id}
                                value={cmd.label}
                                onSelect={cmd.action}
                                className="flex items-center justify-between px-4 py-2.5 hover:bg-white/10 cursor-pointer transition-colors aria-selected:bg-white/10"
                            >
                                <div className="flex items-center gap-3">
                                    {cmd.icon}
                                    <span>{cmd.label}</span>
                                </div>
                                {cmd.shortcut && (
                                    <kbd className="px-2 py-1 text-xs text-neutral-slate bg-neutral/50 rounded">
                                        {cmd.shortcut}
                                    </kbd>
                                )}
                            </Command.Item>
                        ))}
                    </Command.Group>
                ))}
            </Command.List>

            {/* Footer */}
            <div className="border-t border-white/10 px-4 py-2 text-xs text-neutral-slate flex items-center justify-between">
                <span>Press <kbd className="px-1.5 py-0.5 bg-neutral/50 rounded">↓</kbd> to navigate</span>
                <span>Press <kbd className="px-1.5 py-0.5 bg-neutral/50 rounded">Esc</kbd> to close</span>
            </div>
        </Command.Dialog>
    );
};

// ============================================================================
// ICONS
// ============================================================================

function DashboardIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}

function SitesIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
    );
}

function AnalyticsIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    );
}

function SettingsIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

function ExportIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    );
}

function DocsIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );
}

function SupportIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function LoadingSpinner() {
    return (
        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
        </svg>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    CommandPalette,
};
