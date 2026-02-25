"use client";

import React from "react";
import { Command } from "cmdk";
import { Search, FileText, Settings, Layout, Zap, HelpCircle } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";

export function NexusCommandPalette() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-[640px] pointer-events-auto"
                    >
                        <Command className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-slate-100 font-sans">
                            <div className="flex items-center border-b border-white/10 px-6 py-4">
                                <Search className="w-5 h-5 text-white/30 mr-4" />
                                <Command.Input
                                    placeholder="Execute sovereign commands... (e.g. 'go to settings')"
                                    className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-white/20"
                                />
                            </div>

                            <Command.List className="max-h-[400px] overflow-y-auto p-3 space-y-2 custom-scrollbar">
                                <Command.Empty className="px-6 py-12 text-center text-sm text-white/40">
                                    No matching protocols found.
                                </Command.Empty>

                                <Command.Group heading="Navigation" className="text-[10px] uppercase tracking-widest text-white/20 px-4 py-2 mt-4 first:mt-0 font-black">
                                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
                                        <Layout className="w-4 h-4" />
                                        <span>Dashboard Overview</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/sites"))}>
                                        <FileText className="w-4 h-4" />
                                        <span>Manage My Sites</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
                                        <Settings className="w-4 h-4" />
                                        <span>Engine Settings</span>
                                    </CommandItem>
                                </Command.Group>

                                <Command.Group heading="Immediate Logic" className="text-[10px] uppercase tracking-widest text-white/20 px-4 py-2 mt-4 font-black">
                                    <CommandItem onSelect={() => runCommand(() => console.log("Theme Toggle"))}>
                                        <Zap className="w-4 h-4 text-lime-300" />
                                        <span>Toggle Dark/Light Mode</span>
                                    </CommandItem>
                                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/support"))}>
                                        <HelpCircle className="w-4 h-4" />
                                        <span>Contact Support Intel</span>
                                    </CommandItem>
                                </Command.Group>
                            </Command.List>

                            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-black uppercase tracking-widest">
                                <span>Press Esc to close</span>
                                <div className="flex items-center gap-2">
                                    <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Enter</div>
                                    <span>to select</span>
                                </div>
                            </div>
                        </Command>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function CommandItem({ children, onSelect }: { children: React.ReactNode; onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-default select-none transition-all duration-200 outline-none
                       aria-selected:bg-white/10 aria-selected:text-white aria-selected:scale-[1.02]"
        >
            {children}
        </Command.Item>
    );
}
