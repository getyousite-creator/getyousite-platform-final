/**
 * Editor State Store - Zustand with Temporal Middleware
 * 
 * Manages editor state with:
 * - JSON Patches (RFC 6902) for efficient undo/redo
 * - Optimistic updates for instant visual feedback
 * - Memory-efficient state management
 */

import { create } from 'zustand';
import { temporal, TemporalState } from 'zundo';
import { applyPatch, Operation } from 'fast-json-patch';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface EditorState {
    // Current blueprint
    blueprint: any | null;
    
    // Selected element
    selectedElementId: string | null;
    
    // Viewport mode
    viewport: 'mobile' | 'tablet' | 'desktop';
    
    // Editor mode
    mode: 'edit' | 'preview';
    
    // Loading state
    isLoading: boolean;
    
    // Save state
    isSaving: boolean;
    lastSaved: Date | null;
    
    // Actions
    setBlueprint: (blueprint: any) => void;
    updateElement: (elementId: string, updates: Record<string, any>) => void;
    deleteElement: (elementId: string) => void;
    addElement: (element: any, parentId?: string) => void;
    moveElement: (elementId: string, newIndex: number) => void;
    selectElement: (elementId: string | null) => void;
    setViewport: (viewport: 'mobile' | 'tablet' | 'desktop') => void;
    setMode: (mode: 'edit' | 'preview') => void;
    setIsSaving: (isSaving: boolean) => void;
}

// ============================================================================
// JSON PATCH UTILITIES
// ============================================================================

/**
 * Create JSON patch for object updates
 */
export function createUpdatePatch(
    path: string,
    updates: Record<string, any>
): Operation[] {
    return Object.entries(updates).map(([key, value]) => ({
        op: 'replace',
        path: `${path}/${key}`,
        value
    }));
}

/**
 * Create JSON patch for adding element
 */
export function createAddPatch(
    path: string,
    element: any,
    index?: number
): Operation[] {
    return [{
        op: 'add',
        path: index !== undefined ? `${path}/${index}` : `${path}/-`,
        value: element
    }];
}

/**
 * Create JSON patch for removing element
 */
export function createRemovePatch(path: string): Operation[] {
    return [{
        op: 'remove',
        path
    }];
}

/**
 * Apply JSON patch to state
 */
export function applyJsonPatch<T>(state: T, operations: Operation[]): T {
    const result = applyPatch(state, operations, false, true);
    return result.newDocument as T;
}

// ============================================================================
// STORE CREATION
// ============================================================================

const initialState = {
    blueprint: null,
    selectedElementId: null,
    viewport: 'desktop' as const,
    mode: 'edit' as const,
    isLoading: false,
    isSaving: false,
    lastSaved: null,
};

export const useEditorStore = create<EditorState>()(
    temporal(
        (set, get) => ({
            ...initialState,

            // Set entire blueprint
            setBlueprint: (blueprint) => {
                set({ blueprint, isLoading: false });
            },

            // Update element with optimistic update
            updateElement: (elementId, updates) => {
                const { blueprint } = get();
                if (!blueprint) return;

                // Create JSON patch for efficient update
                const path = `/layout/${elementId}`;
                const operations = createUpdatePatch(path, updates);
                
                // Apply patch
                const newBlueprint = applyJsonPatch(blueprint, operations);
                
                // Optimistic update
                set({ blueprint: newBlueprint });
                
                // Auto-save after 1 second
                setTimeout(() => {
                    if (get().mode === 'edit') {
                        get().setIsSaving(true);
                        // Save to backend here
                        setTimeout(() => {
                            set({ 
                                isSaving: false,
                                lastSaved: new Date()
                            });
                        }, 500);
                    }
                }, 1000);
            },

            // Delete element
            deleteElement: (elementId) => {
                const { blueprint } = get();
                if (!blueprint) return;

                const operations = createRemovePatch(`/layout/${elementId}`);
                const newBlueprint = applyJsonPatch(blueprint, operations);
                
                set({ 
                    blueprint: newBlueprint,
                    selectedElementId: null
                });
            },

            // Add new element
            addElement: (element, parentId) => {
                const { blueprint } = get();
                if (!blueprint) return;

                const path = parentId ? `/layout/${parentId}/children` : '/layout';
                const operations = createAddPatch(path, element);
                const newBlueprint = applyJsonPatch(blueprint, operations);
                
                set({ blueprint: newBlueprint });
            },

            // Move element (for drag and drop)
            moveElement: (elementId, newIndex) => {
                const { blueprint } = get();
                if (!blueprint) return;

                // Remove from old position
                const removeOps = createRemovePatch(`/layout/${elementId}`);
                const tempBlueprint = applyJsonPatch(blueprint, removeOps);
                
                // Add to new position
                const addOps = createAddPatch('/layout', blueprint.layout[elementId], newIndex);
                const newBlueprint = applyJsonPatch(tempBlueprint, addOps);
                
                set({ blueprint: newBlueprint });
            },

            // Select element
            selectElement: (elementId) => {
                set({ selectedElementId: elementId });
            },

            // Set viewport
            setViewport: (viewport) => {
                set({ viewport });
            },

            // Set mode
            setMode: (mode) => {
                set({ mode });
            },

            // Set saving state
            setIsSaving: (isSaving) => {
                set({ isSaving });
            },
        }),
        {
            limit: 100, // Store last 100 states for undo/redo
            partialize: (state) => ({ 
                blueprint: state.blueprint,
                selectedElementId: state.selectedElementId
            }),
            onSave: (currentState, previousState) => {
                console.log('[Editor] State saved', {
                    current: currentState.blueprint?.id,
                    previous: previousState?.blueprint?.id
                });
            }
        }
    )
);

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Hook for undo/redo functionality
 */
export function useEditorHistory() {
    const { undo, redo, canUndo, canRedo } = useEditorStore(
        (state: TemporalState<unknown>) => ({
            undo: state.undo,
            redo: state.redo,
            canUndo: state.canUndo,
            canRedo: state.canRedo,
        })
    );

    return { undo, redo, canUndo, canRedo };
}

/**
 * Hook for selected element
 */
export function useSelectedElement() {
    const { selectedElementId, selectElement, blueprint } = useEditorStore();
    
    const selectedElement = blueprint?.layout?.find(
        (el: any) => el.id === selectedElementId
    );

    return {
        selectedElement,
        selectedElementId,
        selectElement,
        isSelected: !!selectedElementId
    };
}

/**
 * Hook for viewport
 */
export function useViewport() {
    const { viewport, setViewport } = useEditorStore();
    
    const getWidth = () => {
        switch (viewport) {
            case 'mobile': return '375px';
            case 'tablet': return '768px';
            default: return '100%';
        }
    };

    return { viewport, setViewport, getWidth };
}

/**
 * Hook for editor mode
 */
export function useEditorMode() {
    const { mode, setMode } = useEditorStore();
    
    return {
        mode,
        setMode,
        isEdit: mode === 'edit',
        isPreview: mode === 'preview'
    };
}

/**
 * Hook for save state
 */
export function useSaveState() {
    const { isSaving, lastSaved, setIsSaving } = useEditorStore();
    
    return { isSaving, lastSaved, setIsSaving };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    useEditorStore,
    useEditorHistory,
    useSelectedElement,
    useViewport,
    useEditorMode,
    useSaveState,
    createUpdatePatch,
    createAddPatch,
    createRemovePatch,
    applyJsonPatch,
};
