/**
 * Visual Editor - Main Component
 * 
 * Integrates:
 * - Sandbox Iframe with PostMessage Bridge
 * - Zustand Store with JSON Patches
 * - Floating Contextual Toolbar
 * - Viewport Controller
 * - Real-time State Sync
 */

"use client";

import React, { useRef, useEffect, useState } from 'react';
import { usePostMessageBridge, sendBlueprintUpdate } from '@/lib/editor/postmessage-bridge';
import { useEditorStore, useEditorHistory, useViewport } from '@/lib/editor/editor-store';
import { FloatingToolbar } from './FloatingToolbar';
import { ViewportController } from './ViewportController';
import { Undo2, Redo2, Save, Eye, Edit3 } from 'lucide-react';

interface VisualEditorProps {
    initialBlueprint?: any;
    onSave?: (blueprint: any) => Promise<void>;
}

export function VisualEditor({ initialBlueprint, onSave }: VisualEditorProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { sendMessage, onMessage } = usePostMessageBridge(iframeRef);
    const { blueprint, setBlueprint, setMode, mode } = useEditorStore();
    const { undo, redo, canUndo, canRedo } = useEditorHistory();
    const { viewport } = useViewport();
    const [isToolbarOpen, setIsToolbarOpen] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // Initialize with blueprint
    useEffect(() => {
        if (initialBlueprint && !blueprint) {
            setBlueprint(initialBlueprint);
        }
    }, [initialBlueprint, blueprint, setBlueprint]);

    // Send blueprint to iframe when it changes
    useEffect(() => {
        if (blueprint && isReady) {
            sendBlueprintUpdate(sendMessage, blueprint);
        }
    }, [blueprint, isReady, sendMessage]);

    // Listen for iframe ready
    useEffect(() => {
        const cleanup = onMessage('PREVIEW_READY', () => {
            setIsReady(true);
        });
        return cleanup;
    }, [onMessage]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + Z = Undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                if (canUndo) undo();
            }
            
            // Ctrl/Cmd + Shift + Z = Redo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                if (canRedo) redo();
            }
            
            // Ctrl/Cmd + S = Save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
            
            // Ctrl/Cmd + P = Toggle Preview/Edit
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                setMode(mode === 'edit' ? 'preview' : 'edit');
            }
            
            // Escape = Close toolbar
            if (e.key === 'Escape') {
                setIsToolbarOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canUndo, canRedo, undo, redo, mode, setMode]);

    // Handle save
    const handleSave = async () => {
        if (!blueprint) return;
        
        if (onSave) {
            await onSave(blueprint);
        }
    };

    return (
        <div className="w-full h-screen bg-neutral-900 overflow-hidden">
            {/* Top Toolbar */}
            <div className="h-14 border-b border-white/10 bg-neutral-900/50 flex items-center justify-between px-4">
                {/* Left: Undo/Redo */}
                <div className="flex items-center gap-2">
                    <ToolbarIconButton
                        icon={<Undo2 className="w-4 h-4" />}
                        tooltip="Undo (Ctrl+Z)"
                        disabled={!canUndo}
                        onClick={undo}
                    />
                    <ToolbarIconButton
                        icon={<Redo2 className="w-4 h-4" />}
                        tooltip="Redo (Ctrl+Shift+Z)"
                        disabled={!canRedo}
                        onClick={redo}
                    />
                </div>

                {/* Center: Mode Toggle */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMode('edit')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            mode === 'edit'
                                ? 'bg-primary text-white'
                                : 'bg-white/5 text-neutral-400 hover:text-white'
                        }`}
                        aria-label="Edit mode"
                    >
                        <Edit3 className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                    </button>
                    <button
                        onClick={() => setMode('preview')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            mode === 'preview'
                                ? 'bg-primary text-white'
                                : 'bg-white/5 text-neutral-400 hover:text-white'
                        }`}
                        aria-label="Preview mode"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Preview</span>
                    </button>
                </div>

                {/* Right: Save */}
                <div className="flex items-center gap-2">
                    <ToolbarIconButton
                        icon={<Save className="w-4 h-4" />}
                        tooltip="Save (Ctrl+S)"
                        onClick={handleSave}
                    />
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="h-[calc(100vh-3.5rem)]">
                <ViewportController iframeRef={iframeRef}>
                    <iframe
                        ref={iframeRef}
                        src="/editor/preview"
                        className="w-full h-full bg-white"
                        title="Editor Preview"
                        sandbox="allow-same-origin allow-scripts allow-modals"
                    />
                </ViewportController>
            </div>

            {/* Floating Toolbar (appears when element selected) */}
            {isToolbarOpen && mode === 'edit' && (
                <FloatingToolbar onClose={() => setIsToolbarOpen(false)} />
            )}

            {/* Status Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-8 border-t border-white/10 bg-neutral-900/90 flex items-center justify-between px-4 text-xs text-neutral-400">
                <div>
                    {viewport === 'mobile' && '📱 Mobile (375px)'}
                    {viewport === 'tablet' && '📱 Tablet (768px)'}
                    {viewport === 'desktop' && '🖥️ Desktop (1920px)'}
                </div>
                <div className="flex items-center gap-4">
                    <span>Ctrl+Z: Undo</span>
                    <span>Ctrl+Shift+Z: Redo</span>
                    <span>Ctrl+S: Save</span>
                    <span>Ctrl+P: Toggle Preview</span>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// TOOLBAR ICON BUTTON
// ============================================================================

interface ToolbarIconButtonProps {
    icon: React.ReactNode;
    tooltip: string;
    disabled?: boolean;
    onClick: () => void;
}

function ToolbarIconButton({ icon, tooltip, disabled, onClick }: ToolbarIconButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-2 rounded-lg transition-all ${
                disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-white/10 text-white'
            }`}
            aria-label={tooltip}
            title={tooltip}
        >
            {icon}
        </button>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    VisualEditor,
};
