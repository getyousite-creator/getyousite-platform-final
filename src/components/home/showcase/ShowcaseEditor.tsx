"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";
import TemplateRenderer from "@/templates/TemplateRenderer";
import ConfiguratorSidebar from "./editor/ConfiguratorSidebar";
import { useState } from "react";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { Template } from "@/data/template-data";

interface ShowcaseEditorProps {
    template: Template;
    onClose: () => void;
    onLaunch: (title: string) => void;
}

export default function ShowcaseEditor({ template, onClose, onLaunch }: ShowcaseEditorProps) {
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const { updateSetting } = useTemplateEditor();

    const handleDeepEdit = (action: string, key?: any, value?: string) => {
        if (key && value) {
            updateSetting(key, value);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-2xl"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-7xl h-[90vh] bg-card rounded-3xl border border-border overflow-hidden flex flex-col md:flex-row shadow-xl"
            >
                {/* Left: Real React Template Rendering */}
                <div className="flex-1 bg-card relative overflow-hidden h-1/2 md:h-full group/preview">
                    {/* Browser Controls */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-card/90 border-b border-border flex items-center justify-between px-6 z-50">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={onClose} />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="bg-secondary px-4 py-1 rounded-full text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            sovereign.engine/{template.id}
                        </div>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="w-full h-full pt-12 overflow-y-auto custom-scrollbar bg-background">
                        <TemplateRenderer templateId={template.id} />
                    </div>

                    <AnimatePresence>
                        {isProcessing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-background/80 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-12 text-center"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-t-2 border-primary rounded-full mb-8"
                                />
                                <h4 className="text-2xl font-bold text-foreground mb-2">Architectural Shift</h4>
                                <p className="text-muted-foreground">Reconfiguring for {isProcessing}...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Sidebar */}
                <ConfiguratorSidebar
                    onEdit={handleDeepEdit}
                    onLaunch={() => onLaunch(`${template.title} (Customized)`)}
                />
            </motion.div>
        </div>
    );
}
