/**
 * Infinite Undo System - Zustand Middleware
 * 
 * Allows users to undo/redo any settings change, even after days
 * Uses temporal middleware with persistent storage
 */

import React from "react";
import { create } from "zustand";
import { temporal } from "zundo";
import { useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface DashboardState {
    // Settings that can be undone
    settings: {
        siteName: string;
        theme: "light" | "dark";
        density: "low" | "medium" | "high";
        sidebarOpen: boolean;
        notifications: boolean;
    };

    // Actions
    updateSettings: (settings: Partial<DashboardState["settings"]>) => void;
    resetSettings: () => void;
}

// ============================================================================
// STORE CONFIGURATION
// ============================================================================

const initialSettings: DashboardState["settings"] = {
    siteName: "My Site",
    theme: "dark",
    density: "low",
    sidebarOpen: true,
    notifications: true,
};

// ============================================================================
// CREATE STORE WITH UNDO/REDO
// ============================================================================

export const useDashboardStore = create<DashboardState>()(
    temporal(
        persist(
            (set, get) => ({
                settings: initialSettings,

                updateSettings: (newSettings) => {
                    set({
                        settings: {
                            ...get().settings,
                            ...newSettings,
                        },
                    });
                },

                resetSettings: () => {
                    set({ settings: initialSettings });
                },
            }),
            {
                name: "dashboard-settings",
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({ settings: state.settings }),
            }
        ),
        {
            limit: 100, // Store up to 100 undo states
            partialize: (state) => ({ settings: state.settings }),
            onSave: (currentState, previousState) => {
                console.log("[Undo] State saved", {
                    current: currentState.settings,
                    previous: previousState?.settings,
                });
            },
        }
    )
);

// ============================================================================
// UNDO/REDO HOOKS
// ============================================================================

export function useUndo() {
    const temporalStore = useDashboardStore.temporal;
    const { undo, redo, pastStates, futureStates } = useStore(temporalStore);
    const canUndo = pastStates.length > 0;
    const canRedo = futureStates.length > 0;

    return { undo, redo, canUndo, canRedo };
}

export function useTimeTravel() {
    const temporalStore = useDashboardStore.temporal;
    const { undo, redo, pastStates, futureStates } = useStore(temporalStore);
    const canUndo = pastStates.length > 0;
    const canRedo = futureStates.length > 0;

    const history = [
        ...pastStates.map((state: any, index: number) => ({
            type: "past" as const,
            index: pastStates.length - 1 - index,
            settings: state.settings,
            timestamp: new Date().getTime() - (pastStates.length - index) * 60000,
        })),
        {
            type: "present" as const,
            index: -1,
            settings: useDashboardStore.getState().settings,
            timestamp: new Date().getTime(),
        },
        ...futureStates.map((state: any, index: number) => ({
            type: "future" as const,
            index,
            settings: state.settings,
            timestamp: new Date().getTime() + (index + 1) * 60000,
        })),
    ];

    return {
        undo, redo, canUndo, canRedo, history,
        jumpTo: (index: number) => {
            if (index < pastStates.length) {
                for (let i = 0; i <= index; i++) undo();
            } else if (index > pastStates.length) {
                const jumpsNeeded = index - pastStates.length;
                for (let i = 0; i < jumpsNeeded; i++) redo();
            }
        },
    };
}

// ============================================================================
// UNDO BUTTON COMPONENT
// ============================================================================

export const UndoButton: React.FC = () => {
    const { undo, canUndo } = useUndo();

    return (
        <button
            onClick={() => undo()}
            disabled={!canUndo}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 rounded-[8px] transition-all text-sm"
        >
            <UndoIcon />
            <span>Undo</span>
            <kbd className="px-1.5 py-0.5 text-xs bg-neutral/50 rounded">⌘Z</kbd>
        </button>
    );
};

export const RedoButton: React.FC = () => {
    const { redo, canRedo } = useUndo();

    return (
        <button
            onClick={() => redo()}
            disabled={!canRedo}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 rounded-[8px] transition-all text-sm"
        >
            <RedoIcon />
            <span>Redo</span>
            <kbd className="px-1.5 py-0.5 text-xs bg-neutral/50 rounded">⌘⇧Z</kbd>
        </button>
    );
};

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

export function useUndoKeyboardShortcuts() {
    const { undo, redo } = useUndo();

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + Z for Undo
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                undo();
            }

            // Ctrl/Cmd + Shift + Z for Redo
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [undo, redo]);
}

// ============================================================================
// ICONS
// ============================================================================

function UndoIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <path d="M9 14L4 9l5-5" />
            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
        </svg>
    );
}

function RedoIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <path d="M15 14l5-5-5-5" />
            <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13" />
        </svg>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    useDashboardStore,
    useUndo,
    useTimeTravel,
    UndoButton,
    RedoButton,
    useUndoKeyboardShortcuts,
};
