import { useEffect, useCallback, useRef } from 'react';
import { useTemplateEditor } from './use-template-editor';
import { saveStoreAction } from '@/app/actions/store-actions';
import { toast } from 'sonner';
import debounce from 'lodash.debounce';

export function useAutoSave(activeStoreId: string | null) {
    const { blueprint, saveStatus, setSaveStatus, settings } = useTemplateEditor();

    // Ref to hold the latest blueprint to avoid closure staleness in debounce
    const blueprintRef = useRef(blueprint);
    const settingsRef = useRef(settings);

    useEffect(() => {
        blueprintRef.current = blueprint;
        settingsRef.current = settings;
    }, [blueprint, settings]);

    const save = useCallback(
        async () => {
            if (!activeStoreId || !blueprintRef.current) return;

            setSaveStatus('saving');

            // Strict Logic: We only save if we have a blueprint and an active store ID.
            // Vision and Name are pulled from settings or blueprint if available, 
            // but for auto-save we primarily care about the blueprint structure.
            // We might need to pass the business name if it's in settings.

            const currentBlueprint = blueprintRef.current;
            const currentName = currentBlueprint.name || "Untitled Store"; // Fallback

            try {
                const result = await saveStoreAction(
                    currentBlueprint,
                    currentName,
                    currentBlueprint.description, // vision
                    activeStoreId
                );

                if (result.success) {
                    setSaveStatus('saved');
                    // Optional: toast.success("Changes saved"); // Too noisy for auto-save
                } else {
                    setSaveStatus('error');
                    toast.error("Auto-save failed: " + result.error);
                }
            } catch (error) {
                setSaveStatus('error');
                console.error("Auto-save error:", error);
            }
        },
        [activeStoreId, setSaveStatus]
    );

    // Debounced save function
    // We use useMemo to create the debounced function only once (or when dependencies change)
    // 1000ms delay for "robust" feel - not too jumpy.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSave = useCallback(
        debounce(() => {
            save();
        }, 1500),
        [save]
    );

    // Trigger auto-save on blueprint updates
    useEffect(() => {
        if (activeStoreId && blueprint) {
            if (saveStatus !== 'saving') {
                debouncedSave();
            }
        }

        // Cleanup debounce on unmount
        return () => {
            debouncedSave.cancel();
        };
    }, [blueprint, activeStoreId, debouncedSave]);
    // We don't include saveStatus in dependencies to avoid loops, 
    // but we check it inside to prevent double-firing if strict.
    // Actually, standard pattern is just fire debounced function.
}
