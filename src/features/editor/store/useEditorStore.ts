import { create } from 'zustand';
import { SiteBlueprint } from '@/lib/schemas';
import { convertBlueprintToEntities } from '@/lib/editor/bridge';

export interface ElementState {
    id: string;
    tag: string;
    content: string;
    classes: string[];
    styles: Record<string, string>;
    parentId: string | null;
    childIds: string[];
    metadata?: {
        type: string;
        data: any;
    };
}

export interface SiteState {
    entities: Record<string, ElementState>;
    rootIds: string[];
    selectedId: string | null;
    history: string[];
    historyIndex: number;
    isHydrated: boolean;
}

interface EditorStore extends SiteState {
    selectElement: (id: string | null) => void;
    updateElement: (id: string, updates: Partial<ElementState>) => void;
    addElement: (parentId: string | null, element: ElementState) => void;
    loadBlueprint: (blueprint: SiteBlueprint) => void;
    setState: (state: Partial<SiteState>) => void;
    undo: () => void;
    redo: () => void;
    pushHistory: () => void;
}

export const useEditorStore = create<EditorStore>()(
    (set, get) => ({
        entities: {},
        rootIds: [],
        selectedId: null,
        history: [],
        historyIndex: -1,
        isHydrated: false,

        setState: (state) => set((prev) => ({ ...prev, ...state })),

        selectElement: (id) => set({ selectedId: id }),

        pushHistory: () => {
            const { entities, rootIds } = get();
            const snapshot = JSON.stringify({ entities, rootIds });
            const newHistory = get().history.slice(0, get().historyIndex + 1);

            // Limit history to 50 snapshots for memory sovereignty
            if (newHistory.length > 50) newHistory.shift();

            set({
                history: [...newHistory, snapshot],
                historyIndex: newHistory.length
            });
        },

        loadBlueprint: (blueprint) => {
            const { entities, rootIds } = convertBlueprintToEntities(blueprint);
            set({ entities, rootIds, isHydrated: true, history: [], historyIndex: -1 });
            get().pushHistory();
        },

        updateElement: (id, updates) => {
            set((state) => ({
                entities: {
                    ...state.entities,
                    [id]: { ...state.entities[id], ...updates }
                }
            }));
            // Debounced history push could be better, but for sovereignty we commit immediately
            get().pushHistory();
        },

        addElement: (parentId, element) => {
            set((state) => {
                const newEntities = { ...state.entities, [element.id]: { ...element, parentId } };
                if (parentId && newEntities[parentId]) {
                    newEntities[parentId] = {
                        ...newEntities[parentId],
                        childIds: [...newEntities[parentId].childIds, element.id]
                    };
                }
                return {
                    entities: newEntities,
                    rootIds: parentId ? state.rootIds : [...state.rootIds, element.id]
                };
            });
            get().pushHistory();
        },

        undo: () => {
            const { history, historyIndex } = get();
            if (historyIndex <= 0) return;
            const prevIndex = historyIndex - 1;
            const { entities, rootIds } = JSON.parse(history[prevIndex]);
            set({ entities, rootIds, historyIndex: prevIndex });
        },

        redo: () => {
            const { history, historyIndex } = get();
            if (historyIndex >= history.length - 1) return;
            const nextIndex = historyIndex + 1;
            const { entities, rootIds } = JSON.parse(history[nextIndex]);
            set({ entities, rootIds, historyIndex: nextIndex });
        }
    })
);
