import { create } from 'zustand';
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
    updateSetting: (key: keyof TemplateState, value: string) => void;
    updateBlueprint: (blueprint: SiteBlueprint) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    setSaveStatus: (status: TemplateStore['saveStatus']) => void;
    resetSettings: (defaults: TemplateState) => void;
}

export const useTemplateEditor = create<TemplateStore>((set) => ({
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
    updateSetting: (key, value) => set((state) => ({
        settings: { ...state.settings, [key]: value },
        saveStatus: 'idle', // Reset to idle on change
        updatePulse: state.updatePulse + 1
    })),
    updateBlueprint: (blueprint) => set((state) => ({
        blueprint,
        settings: {
            ...state.settings,
            primaryColor: blueprint.theme.primary,
            secondaryColor: blueprint.theme.secondary,
            fontFamily: blueprint.theme.fontFamily,
        },
        saveStatus: 'idle', // Mark as unsaved/idle on change
        updatePulse: state.updatePulse + 1
    })),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setSaveStatus: (status) => set({
        saveStatus: status,
        lastSavedAt: status === 'saved' ? new Date() : undefined
    }),
    resetSettings: (defaults) => set({ settings: defaults, blueprint: null, isGenerating: false, updatePulse: 0, saveStatus: 'idle', lastSavedAt: null }),
}));
