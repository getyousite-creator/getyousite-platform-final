"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackVisitAction, trackEventAction, trackHeartbeatAction } from "@/app/actions/analytics-actions";

/**
 * SOVEREIGN ANALYTICS HOOK
 * Logic: Orchestrates stealthy tracking to empower the site owner.
 */
export function useSovereignAnalytics(storeId?: string) {
    const pathname = usePathname();
    const hasTracked = useRef<string | null>(null);
    const heartbeatTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // MISSION: Prevent tracking in editor mode or if storeId is missing
        if (!storeId || storeId === "temp" || typeof window === "undefined" || window.location.hostname === "localhost") {
            return;
        }

        // Logic: Track page view once per path change
        if (hasTracked.current !== pathname) {
            const referrer = document.referrer;
            trackVisitAction(storeId, pathname, referrer);
            hasTracked.current = pathname;
        }

        // HEARTBEAT LOGIC: Measure attention span precisely
        if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
        heartbeatTimer.current = setInterval(() => {
            trackHeartbeatAction(storeId);
        }, 15000); // 15-second resolution

        return () => {
            if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
        };
    }, [pathname, storeId]);

    // Exposure of manual event tracking
    const trackEvent = (type: string, data: any = {}) => {
        if (!storeId) return;
        trackEventAction(storeId, pathname, type, data);
    };

    return { trackEvent };
}
