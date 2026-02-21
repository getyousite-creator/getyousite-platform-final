/**
 * Contextual Floating Toolbar (Omni-Bar)
 * 
 * Appears above selected element only
 * Shows relevant tools based on element type:
 * - Text: Typography tools
 * - Image: Filter, crop, AI generation
 * - Section: Layout, padding controls
 */

"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelectedElement } from '@/lib/editor/editor-store';
import {
    Type,
    Image,
    Layout,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Palette,
    Crop,
    Wand2,
    Move,
    Copy,
    Trash2,
    X
} from 'lucide-react';

interface ToolbarProps {
    onClose: () => void;
}

export function FloatingToolbar({ onClose }: ToolbarProps) {
    const { selectedElement, selectedElementId, selectElement } = useSelectedElement();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const toolbarRef = useRef<HTMLDivElement>(null);

    // Update toolbar position based on selected element
    useEffect(() => {
        if (!selectedElementId || !toolbarRef.current) {
            onClose();
            return;
        }

        const element = document.querySelector(`[data-element-id="${selectedElementId}"]`);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const toolbarRect = toolbarRef.current.getBoundingClientRect();

        // Position above element, centered
        let x = rect.left + rect.width / 2 - toolbarRect.width / 2;
        let y = rect.top - toolbarRect.height - 16;

        // Adjust if off-screen
        if (x < 16) x = 16;
        if (x + toolbarRect.width > window.innerWidth - 16) {
            x = window.innerWidth - toolbarRect.width - 16;
        }
        if (y < 16) y = rect.bottom + 16;

        setPosition({ x, y });
    }, [selectedElementId, selectedElement, onClose]);

    if (!selectedElementId || !selectedElement) return null;

    const elementType = selectedElement.type;

    return (
        <AnimatePresence>
            <motion.div
                ref={toolbarRef}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.15 }}
                className="fixed z-50 flex items-center gap-1 p-2 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl"
                style={{
                    left: position.x,
                    top: position.y,
                }}
                role="toolbar"
                aria-label="Element editing toolbar"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close toolbar"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Common actions */}
                <ToolbarButton icon={<Move className="w-4 h-4" />} tooltip="Move" />
                <ToolbarButton icon={<Copy className="w-4 h-4" />} tooltip="Duplicate" />
                <ToolbarButton 
                    icon={<Trash2 className="w-4 h-4 text-error" />} 
                    tooltip="Delete"
                    variant="danger"
                />

                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Type-specific tools */}
                {elementType === 'text' && <TextTools />}
                {elementType === 'image' && <ImageTools />}
                {elementType === 'section' && <LayoutTools />}
            </motion.div>
        </AnimatePresence>
    );
}

// ============================================================================
// TEXT TOOLS
// ============================================================================

function TextTools() {
    return (
        <>
            <ToolbarButton icon={<Bold className="w-4 h-4" />} tooltip="Bold" />
            <ToolbarButton icon={<Italic className="w-4 h-4" />} tooltip="Italic" />
            <ToolbarButton icon={<Underline className="w-4 h-4" />} tooltip="Underline" />
            
            <div className="w-px h-6 bg-white/10 mx-1" />
            
            <ToolbarButton icon={<AlignLeft className="w-4 h-4" />} tooltip="Align Left" />
            <ToolbarButton icon={<AlignCenter className="w-4 h-4" />} tooltip="Align Center" />
            <ToolbarButton icon={<AlignRight className="w-4 h-4" />} tooltip="Align Right" />
            
            <div className="w-px h-6 bg-white/10 mx-1" />
            
            <ToolbarButton icon={<Type className="w-4 h-4" />} tooltip="Font Family" />
            <ToolbarButton icon={<Palette className="w-4 h-4" />} tooltip="Color" />
        </>
    );
}

// ============================================================================
// IMAGE TOOLS
// ============================================================================

function ImageTools() {
    return (
        <>
            <ToolbarButton icon={<Crop className="w-4 h-4" />} tooltip="Crop" />
            <ToolbarButton icon={<Palette className="w-4 h-4" />} tooltip="Filters" />
            
            <div className="w-px h-6 bg-white/10 mx-1" />
            
            <ToolbarButton 
                icon={<Wand2 className="w-4 h-4 text-accent-neon" />} 
                tooltip="AI Generate"
                variant="accent"
            />
        </>
    );
}

// ============================================================================
// LAYOUT TOOLS
// ============================================================================

function LayoutTools() {
    return (
        <>
            <ToolbarButton icon={<Layout className="w-4 h-4" />} tooltip="Layout" />
            <ToolbarButton icon={<Palette className="w-4 h-4" />} tooltip="Background" />
            
            <div className="w-px h-6 bg-white/10 mx-1" />
            
            <ToolbarButton tooltip="Padding">
                <span className="text-xs font-bold">P</span>
            </ToolbarButton>
            <ToolbarButton tooltip="Margin">
                <span className="text-xs font-bold">M</span>
            </ToolbarButton>
        </>
    );
}

// ============================================================================
// TOOLBAR BUTTON
// ============================================================================

interface ToolbarButtonProps {
    icon: React.ReactNode;
    tooltip: string;
    variant?: 'default' | 'danger' | 'accent';
    children?: React.ReactNode;
    onClick?: () => void;
}

function ToolbarButton({ 
    icon, 
    tooltip, 
    variant = 'default',
    children,
    onClick 
}: ToolbarButtonProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    const variantClasses = {
        default: 'hover:bg-white/10 text-white',
        danger: 'hover:bg-error/20 text-error',
        accent: 'hover:bg-accent-neon/20 text-accent-neon',
    };

    return (
        <div className="relative">
            <button
                onClick={onClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`p-1.5 rounded-lg transition-all ${variantClasses[variant]}`}
                aria-label={tooltip}
            >
                {children || icon}
            </button>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded whitespace-nowrap"
                    >
                        {tooltip}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    FloatingToolbar,
    TextTools,
    ImageTools,
    LayoutTools,
};
