"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AITweakerPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsProcessing(true);
        // Simulate AI Processing
        setTimeout(() => {
            setIsProcessing(false);
            setPrompt("");
            // In a real scenario, this would call an API to update the blueprint
        }, 2000);
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300",
                    isOpen ? "bg-red-500 rotate-45" : "bg-primary hover:bg-blue-600"
                )}
            >
                {isOpen ? <X className="text-white w-6 h-6" /> : <Wand2 className="text-[#020617] w-6 h-6" />}
            </motion.button>

            {/* AI Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-8 z-40 w-[400px] bg-[#020617]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Sovereign Logic</h3>
                                <p className="text-[10px] text-white/40 font-medium">AI Design Assistant Active</p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-4">
                            <div className="bg-white/5 rounded-xl p-4 min-h-[120px] text-xs text-white/60 leading-relaxed font-mono">
                                {isProcessing ? (
                                    <div className="flex items-center gap-2 text-primary animate-pulse">
                                        <span className="w-2 h-2 rounded-full bg-primary" />
                                        Analyzing prompt matrix...
                                    </div>
                                ) : (
                                    "Ready for instructions. Tell me how to modify the design, content, or structure."
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="relative">
                                <Input
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g. Make the hero darker..."
                                    className="pr-12 bg-black/40 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:ring-primary/50"
                                    disabled={isProcessing}
                                />
                                <Button
                                    type="submit"
                                    disabled={!prompt || isProcessing}
                                    size="icon"
                                    className="absolute right-1 top-1 h-10 w-10 bg-primary/20 hover:bg-primary text-primary hover:text-[#020617] rounded-lg transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>

                        {/* Suggestions */}
                        <div className="px-4 pb-4 flex flex-wrap gap-2">
                            {["Darker Theme", "More Minimal", "Formal Tone"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setPrompt(s)}
                                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-white/40 hover:text-white transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
