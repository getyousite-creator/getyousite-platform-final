"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Bold, Italic } from "lucide-react";

interface Props {
    children: React.ReactNode;
    onTextChange?: (text: string) => void;
    label?: string;
}

/**
 * SOVEREIGN LIQUID EDITOR: The core of the Zero-Learning UI.
 * Provides instant, contextual editing with high-fidelity feedback.
 */
export function InlineEditLayer({ children, onTextChange, label }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        const text = (e.currentTarget as HTMLElement).innerText || "";
        setValue(text);
        setIsEditing(true);
        setStatus("idle");
    };

    const handleSave = () => {
        if (!value.trim()) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 500);
            return;
        }

        onTextChange?.(value);
        setStatus("success");
        setTimeout(() => {
            setIsEditing(false);
            setStatus("idle");
        }, 800);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setStatus("idle");
    };

    return (
        <div className="relative group/liquid">
            {/* Hover Indicator */}
            {!isEditing && (
                <div className="absolute -inset-2 rounded-lg border-2 border-neon-lime/0 group-hover/liquid:border-neon-lime/20 cursor-text transition-all duration-300 pointer-events-none z-0" />
            )}

            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: -50, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="absolute left-1/2 -translate-x-1/2 bg-obsidian/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-xl flex items-center gap-1 shadow-vip-glow z-[60]"
                    >
                        <div className="flex items-center gap-0.5 border-r border-white/5 pr-1 mr-1">
                            <button className="p-1.5 hover:bg-white/5 rounded-md text-white/40 hover:text-white transition-colors"><Bold size={14} /></button>
                            <button className="p-1.5 hover:bg-white/5 rounded-md text-white/40 hover:text-white transition-colors"><Italic size={14} /></button>
                        </div>
                        <button
                            onClick={handleSave}
                            className="p-1.5 bg-neon-lime/10 text-neon-lime hover:bg-neon-lime/20 rounded-md transition-all"
                        >
                            <Check size={14} />
                        </button>
                        <button
                            onClick={handleCancel}
                            className="p-1.5 hover:bg-white/5 text-white/40 hover:text-red-400 rounded-md transition-all"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                animate={status === "error" ? { x: [-4, 4, -4, 4, 0] } : {}}
                className={`relative z-10 ${isEditing ? "outline-none ring-2 ring-neon-lime/40 rounded-lg p-2 bg-white/5 animate-pulse-slow" : ""}`}
                onClick={!isEditing ? handleStart : undefined}
            >
                {isEditing ? (
                    <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                            // Only save on click outside if not handled by buttons
                            // But for liquid feel, we might want to keep it simple
                        }}
                        onInput={(e) => setValue(e.currentTarget.innerText)}
                        className="min-w-[1ch] outline-none"
                    >
                        {value}
                    </div>
                ) : (
                    <div className="relative">
                        {children}
                        {status === "success" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 2 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center bg-neon-lime/5 rounded-lg pointer-events-none"
                            >
                                <Check className="text-neon-lime w-8 h-8 drop-shadow-vip-glow" />
                            </motion.div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
