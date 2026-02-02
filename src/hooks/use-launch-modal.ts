import { create } from 'zustand';

interface LaunchModalStore {
    isOpen: boolean;
    visionPrefill: string;
    onOpen: (vision?: string) => void;
    onClose: () => void;
}

export const useLaunchModal = create<LaunchModalStore>((set) => ({
    isOpen: false,
    visionPrefill: '',
    onOpen: (vision = '') => set({ isOpen: true, visionPrefill: vision }),
    onClose: () => set({ isOpen: false, visionPrefill: '' }),
}));
