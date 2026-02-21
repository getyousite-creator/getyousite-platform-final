/**
 * Viewport Controller - Universal Preview
 * 
 * Smooth transitions between Mobile, Tablet, Desktop
 * Real media queries inside iframe for 100% accurate preview
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { useViewport } from '@/lib/editor/editor-store';

interface ViewportControllerProps {
    children: React.ReactNode;
    iframeRef?: React.RefObject<HTMLIFrameElement>;
}

export function ViewportController({ children, iframeRef }: ViewportControllerProps) {
    const { viewport, setViewport, getWidth } = useViewport();

    return (
        <div className="w-full h-full flex flex-col">
            {/* Viewport Controls */}
            <div className="flex items-center justify-center gap-2 p-4 border-b border-white/10 bg-neutral-900/50">
                <ViewportButton
                    icon={<Smartphone className="w-4 h-4" />}
                    label="Mobile"
                    width="375px"
                    active={viewport === 'mobile'}
                    onClick={() => setViewport('mobile')}
                />
                <ViewportButton
                    icon={<Tablet className="w-4 h-4" />}
                    label="Tablet"
                    width="768px"
                    active={viewport === 'tablet'}
                    onClick={() => setViewport('tablet')}
                />
                <ViewportButton
                    icon={<Monitor className="w-4 h-4" />}
                    label="Desktop"
                    width="100%"
                    active={viewport === 'desktop'}
                    onClick={() => setViewport('desktop')}
                />
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-auto bg-neutral-900 p-8">
                <motion.div
                    animate={{ 
                        width: getWidth(),
                        maxWidth: '100%'
                    }}
                    transition={{ 
                        duration: 0.4, 
                        ease: [0.25, 0.46, 0.45, 0.94] 
                    }}
                    className="mx-auto"
                >
                    {/* Device Frame */}
                    <div className={`
                        relative bg-white rounded-lg overflow-hidden shadow-2xl
                        ${viewport === 'mobile' ? 'border-8 border-neutral-800 rounded-[2rem]' : ''}
                        ${viewport === 'tablet' ? 'border-4 border-neutral-800 rounded-2xl' : ''}
                        ${viewport === 'desktop' ? 'border border-neutral-700' : ''}
                    `}>
                        {/* Device Notch for Mobile */}
                        {viewport === 'mobile' && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-800 rounded-b-xl z-10" />
                        )}

                        {/* Iframe Preview */}
                        <div className="w-full h-full">
                            {children}
                        </div>
                    </div>

                    {/* Viewport Size Indicator */}
                    <div className="text-center mt-4 text-xs text-neutral-400 font-mono">
                        {viewport === 'mobile' && '375 × 812 (Mobile)'}
                        {viewport === 'tablet' && '768 × 1024 (Tablet)'}
                        {viewport === 'desktop' && '1920 × 1080 (Desktop)'}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// ============================================================================
// VIEWPORT BUTTON
// ============================================================================

interface ViewportButtonProps {
    icon: React.ReactNode;
    label: string;
    width: string;
    active: boolean;
    onClick: () => void;
}

function ViewportButton({ icon, label, width, active, onClick }: ViewportButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${active 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                }
            `}
            aria-label={`Switch to ${label} view`}
            aria-pressed={active}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
            <span className="text-xs opacity-60 ml-2">{width}</span>
        </button>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    ViewportController,
};
