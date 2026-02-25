"use client";

import React, { useEffect } from 'react';
import { trackEventAction } from '@/app/actions/analytics-actions';

interface SovereignTrackerProps {
    id: string;
    type: string;
    variant?: string;
    children: React.ReactNode;
    metadata?: any;
}

/**
 * SOVEREIGN TRACKER WRAPPER (SVT-Component v2)
 * Logic: Transparent observation of interaction sessions.
 * Goal: Collect Strategic training data for conversion optimization.
 */
export function SovereignTracker({ id, type, variant, children, metadata }: SovereignTrackerProps) {
    const siteId = id || 'global';
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';

    useEffect(() => {
        const logView = async () => {
            await trackEventAction(siteId, path, 'SECTION_VISIBLE', {
                sectionType: type,
                variant: variant || 'control',
                ...metadata,
                timestamp: new Date().toISOString()
            });
        };

        logView();
    }, [id, type, variant, metadata, siteId, path]);

    const handleInteraction = async () => {
        await trackEventAction(siteId, path, 'SECTION_INTERACTION', {
            sectionType: type,
            variant: variant || 'control',
            interaction: 'click',
            ...metadata
        });
    };

    return (
        <div onClickCapture={handleInteraction} className="relative w-full h-full">
            {children}
        </div>
    );
}
