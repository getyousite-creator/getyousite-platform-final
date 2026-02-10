import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SiteBlueprint } from '@/lib/schemas';

interface TemplateState {
    primaryColor: string;
    secondaryColor: string;
    headline: string;
    subheadline: string;
    accentColor: string;
    fontFamily: string;
}

interface TemplateStore {
    settings: TemplateState;
    blueprint: SiteBlueprint | null;
    isGenerating: boolean;
    updatePulse: number;
    saveStatus: 'idle' | 'saving' | 'saved' | 'error';
    lastSavedAt: Date | null;
    history: {
        past: SiteBlueprint[];
        future: SiteBlueprint[];
    };
    updateSetting: (key: keyof TemplateState, value: string) => void;
    updateBlueprint: (blueprint: SiteBlueprint, skipHistory?: boolean) => void;
    updateSectionContent: (sectionId: string, newContent: any) => void;
    undo: () => void;
    redo: () => void;
    setIsGenerating: (isGenerating: boolean) => void;
    setSaveStatus: (status: TemplateStore['saveStatus']) => void;
    resetSettings: (defaults: TemplateState) => void;
}

const MAX_HISTORY = 20;


export const useTemplateEditor = create<TemplateStore>()(
    persist(
        (set) => ({
            settings: {
                primaryColor: '#3b82f6',
                secondaryColor: '#a855f7',
                accentColor: '#ffffff',
                headline: 'Building the Future of Digital Empires',
                subheadline: 'Architecting high-performance digital ecosystems for visionary designers.',
                fontFamily: 'var(--font-inter)',
            },
            blueprint: null,
            isGenerating: false,
            saveStatus: 'idle',
            lastSavedAt: null,
            updatePulse: 0,
            history: { past: [], future: [] },

            updateSetting: (key, value) => set((state) => ({
                settings: { ...state.settings, [key]: value },
                saveStatus: 'idle',
                updatePulse: state.updatePulse + 1
            })),

            updateBlueprint: (blueprint, skipHistory = false) => set((state) => {
                const newHistory = skipHistory ? state.history : {
                    past: state.blueprint ? [...state.history.past, state.blueprint].slice(-MAX_HISTORY) : state.history.past,
                    future: []
                };

                return {
                    blueprint,
                    history: newHistory,
                    settings: {
                        ...state.settings,
                        primaryColor: blueprint.theme.primary,
                        secondaryColor: blueprint.theme.secondary,
                        fontFamily: blueprint.theme.fontFamily,
                    },
                    saveStatus: 'idle',
                    updatePulse: state.updatePulse + 1
                };
            }),

            updateSectionContent: (sectionId, newContent) => set((state) => {
                if (!state.blueprint) return state;

                // Push current to history
                const past = [...state.history.past, state.blueprint].slice(-MAX_HISTORY);

                // Clone blueprint and update section
                const newBlueprint = JSON.parse(JSON.stringify(state.blueprint)) as SiteBlueprint;

                // Search in all pages
                let updated = false;
                Object.keys(newBlueprint.pages).forEach(slug => {
                    const page = newBlueprint.pages[slug];
                    if (page.layout) {
                        const section = page.layout.find((s: any) => s.id === sectionId);
                        if (section) {
                            section.content = { ...section.content, ...newContent };
                            updated = true;
                        }
                    }
                });

                if (!updated) return state;

                return {
                    blueprint: newBlueprint,
                    history: { past, future: [] },
                    saveStatus: 'idle',
                    updatePulse: state.updatePulse + 1
                };
            }),

            undo: () => set((state) => {
                if (state.history.past.length === 0) return state;

                const previous = state.history.past[state.history.past.length - 1];
                const remainingPast = state.history.past.slice(0, -1);
                const current = state.blueprint!;

                return {
                    blueprint: previous,
                    history: {
                        past: remainingPast,
                        future: [current, ...state.history.future].slice(0, MAX_HISTORY)
                    },
                    updatePulse: state.updatePulse + 1
                };
            }),

            redo: () => set((state) => {
                if (state.history.future.length === 0) return state;

                const next = state.history.future[0];
                const remainingFuture = state.history.future.slice(1);
                const current = state.blueprint!;

                return {
                    blueprint: next,
                    history: {
                        past: [...state.history.past, current].slice(-MAX_HISTORY),
                        future: remainingFuture
                    },
                    updatePulse: state.updatePulse + 1
                };
            }),

            setIsGenerating: (isGenerating) => set({ isGenerating }),
            setSaveStatus: (status) => set({
                saveStatus: status,
                lastSavedAt: status === 'saved' ? new Date() : undefined
            }),
            resetSettings: (defaults) => set({
                settings: defaults,
                blueprint: null,
                isGenerating: false,
                updatePulse: 0,
                saveStatus: 'idle',
                lastSavedAt: null,
                history: { past: [], future: [] }
            }),
        }),
        {
            name: 'gys-sovereign-guest-session',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                blueprint: state.blueprint,
                settings: state.settings
            }),
        }
    )
);


