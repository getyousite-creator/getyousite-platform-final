/**
 * Liquid Editor - Inline Visual Editing System
 * 
 * "Touch the website with your hand" - No code, no side panels
 * 
 * Features:
 * - Click-to-edit text directly in preview (Inline Editing)
 * - @dnd-kit/core with smart snap-to-grid
 * - Floating contextual toolbar (appears next to selected element)
 * - No opening side panels for simple edits
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface LiquidEditorProps {
    children: React.ReactNode;
    onElementUpdate?: (id: string, data: any) => void;
    onElementDelete?: (id: string) => void;
    onElementMove?: (id: string, position: { x: number; y: number }) => void;
    readOnly?: boolean;
}

export interface EditableElementProps {
    id: string;
    children: React.ReactNode;
    tagName?: keyof JSX.IntrinsicElements;
    className?: string;
    onUpdate?: (id: string, content: string) => void;
    readOnly?: boolean;
}

export interface FloatingToolbarProps {
    targetElement: HTMLElement | null;
    onClose: () => void;
    onEdit: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
    onStyle: () => void;
}

// ============================================================================
// LIQUID EDITOR COMPONENT
// ============================================================================

export const LiquidEditor: React.FC<LiquidEditorProps> = ({
    children,
    onElementUpdate,
    onElementDelete,
    onElementMove,
    readOnly = false,
}) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
    const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });

    // DnD sensors for smooth dragging
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Prevent accidental drags
            },
        })
    );

    // Handle drag start
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    // Handle drag end
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        
        if (onElementMove && delta.x !== 0 && delta.y !== 0) {
            onElementMove(active.id as string, {
                x: delta.x,
                y: delta.y,
            });
        }
        
        setActiveId(null);
    };

    // Handle element selection
    const handleElementSelect = (element: HTMLElement, event: React.MouseEvent) => {
        if (readOnly) return;
        
        setSelectedElement(element);
        
        // Position toolbar next to element
        const rect = element.getBoundingClientRect();
        setToolbarPosition({
            x: rect.right + 16,
            y: rect.top,
        });
    };

    // Close toolbar on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSelectedElement(null);
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[snapCenterToCursor]}
        >
            <div className="relative">
                {/* Editor Content */}
                <div className="editable-canvas">
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child as any, {
                                onSelect: handleElementSelect,
                                readOnly,
                            });
                        }
                        return child;
                    })}
                </div>

                {/* Floating Toolbar */}
                <AnimatePresence>
                    {selectedElement && !readOnly && (
                        <FloatingToolbar
                            targetElement={selectedElement}
                            onClose={() => setSelectedElement(null)}
                            onEdit={() => {
                                // Enable inline editing
                                const editable = selectedElement.querySelector("[data-editable]");
                                if (editable) {
                                    (editable as HTMLElement).contentEditable = "true";
                                    (editable as HTMLElement).focus();
                                }
                            }}
                            onDuplicate={() => {
                                // Duplicate logic
                                console.log("Duplicate element");
                            }}
                            onDelete={() => {
                                if (onElementDelete) {
                                    onElementDelete(selectedElement.id);
                                }
                                setSelectedElement(null);
                            }}
                            onStyle={() => {
                                // Open style panel
                                console.log("Open style panel");
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </DndContext>
    );
};

// ============================================================================
// EDITABLE ELEMENT COMPONENT
// ============================================================================

export const EditableElement: React.FC<EditableElementProps> = ({
    id,
    children,
    tagName = "div",
    className = "",
    onUpdate,
    readOnly = false,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState("");
    const elementRef = useRef<HTMLElement>(null);

    const handleBlur = () => {
        if (onUpdate && elementRef.current) {
            onUpdate(id, elementRef.current.innerText);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleBlur();
        }
        if (e.key === "Escape") {
            handleBlur();
        }
    };

    const Component = tagName as any;

    return (
        <Component
            ref={elementRef}
            id={id}
            data-editable
            contentEditable={isEditing && !readOnly}
            suppressContentEditableWarning
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`
                ${className}
                ${!readOnly ? "cursor-pointer hover:ring-2 hover:ring-accent-neon/50 transition-all" : ""}
                ${isEditing ? "ring-2 ring-accent-neon bg-white/5" : ""}
            `}
            onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                if (!readOnly && !isEditing) {
                    setIsEditing(true);
                }
            }}
        >
            {children}
        </Component>
    );
};

// ============================================================================
// FLOATING TOOLBAR COMPONENT
// ============================================================================

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
    targetElement,
    onClose,
    onEdit,
    onDuplicate,
    onDelete,
    onStyle,
}) => {
    const toolbarRef = useRef<HTMLDivElement>(null);

    // Position toolbar next to target element
    useEffect(() => {
        if (targetElement && toolbarRef.current) {
            const rect = targetElement.getBoundingClientRect();
            const toolbarRect = toolbarRef.current.getBoundingClientRect();
            
            // Position to the right of element
            let x = rect.right + 16;
            let y = rect.top;

            // Adjust if toolbar goes off screen
            if (x + toolbarRect.width > window.innerWidth) {
                x = rect.left - toolbarRect.width - 16;
            }
            if (y + toolbarRect.height > window.innerHeight) {
                y = rect.bottom - toolbarRect.height;
            }

            toolbarRef.current.style.left = `${x}px`;
            toolbarRef.current.style.top = `${y}px`;
        }
    }, [targetElement]);

    return (
        <motion.div
            ref={toolbarRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 flex items-center gap-1 p-1.5 bg-neutral-obsidian/95 backdrop-blur-xl border border-white/10 rounded-[12px] shadow-2xl"
        >
            <ToolbarButton onClick={onEdit} icon={<EditIcon />} tooltip="Edit" />
            <ToolbarButton onClick={onStyle} icon={<StyleIcon />} tooltip="Style" />
            <ToolbarButton onClick={onDuplicate} icon={<DuplicateIcon />} tooltip="Duplicate" />
            <div className="w-px h-6 bg-white/10 mx-1" />
            <ToolbarButton onClick={onDelete} icon={<DeleteIcon />} tooltip="Delete" danger />
            <ToolbarButton onClick={onClose} icon={<CloseIcon />} tooltip="Close" />
        </motion.div>
    );
};

// ============================================================================
// TOOLBAR BUTTON COMPONENT
// ============================================================================

interface ToolbarButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    tooltip: string;
    danger?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
    onClick,
    icon,
    tooltip,
    danger = false,
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={onClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`
                    p-2 rounded-[8px] transition-all
                    ${danger 
                        ? "hover:bg-error/20 text-error" 
                        : "hover:bg-white/10 text-white"
                    }
                `}
            >
                {icon}
            </button>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-obsidian text-white text-xs rounded whitespace-nowrap"
                    >
                        {tooltip}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================================================
// SNAP-TO-GRID UTILITY
// ============================================================================

export function snapToGrid(value: number, gridSize: number = 8): number {
    return Math.round(value / gridSize) * gridSize;
}

export function snapPosition(
    position: { x: number; y: number },
    gridSize: number = 8
): { x: number; y: number } {
    return {
        x: snapToGrid(position.x, gridSize),
        y: snapToGrid(position.y, gridSize),
    };
}

// ============================================================================
// ICONS
// ============================================================================

function EditIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

function StyleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <circle cx="13.5" cy="6.5" r=".5" />
            <circle cx="17.5" cy="10.5" r=".5" />
            <circle cx="8.5" cy="7.5" r=".5" />
            <circle cx="6.5" cy="12.5" r=".5" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
    );
}

function DuplicateIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

function DeleteIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    LiquidEditor,
    EditableElement,
    FloatingToolbar,
    snapToGrid,
    snapPosition,
};
