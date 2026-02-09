import { create } from 'zustand';

interface LaunchModalStore {
    isOpen: boolean;
    visionPrefill: string;
    storeContext?: { id: string; name: string };
    onOpen: (vision?: string, context?: { id: string; name: string }) => void;
    onClose: () => void;
}

export const useLaunchModal = create<LaunchModalStore>((set) => ({
    isOpen: false,
    visionPrefill: '',
    storeContext: undefined,
    onOpen: (vision = '', context) => set({ isOpen: true, visionPrefill: vision, storeContext: context }),
    onClose: () => set({ isOpen: false, visionPrefill: '', storeContext: undefined }),
}));
