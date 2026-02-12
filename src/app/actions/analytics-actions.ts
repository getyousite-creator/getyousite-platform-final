"use server";

import { AnalyticsService } from "@/lib/services/analytics-service";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

/**
 * SOVEREIGN ANALYTICS ACTION
 * Logic: Captures and persists visitor data with zero-trust rigor.
 */
export async function trackVisitAction(storeId: string, path: string, referrer: string = "") {
    try {
        const headersList = await headers();
        const userAgent = headersList.get("user-agent") || "";
        const parser = new UAParser(userAgent);
        const result = parser.getResult();

        // Extract clean source from URL params or referrer
        const urlParams = new URLSearchParams(headersList.get("referer")?.split("?")[1] || "");
        const source = urlParams.get("utm_source") || (referrer.includes("google.com") ? "google" : "direct");

        await AnalyticsService.trackPageView(storeId, path, {
            device: result.device.type || "desktop",
            browser: result.browser.name,
            os: result.os.name,
            country: headersList.get("x-vercel-ip-country") || undefined, // Provided by Vercel Edge
            city: headersList.get("x-vercel-ip-city") || undefined,
            referrer,
            source,
        });

        return { success: true };
    } catch (error) {
        console.error("ANALYTICS_ACTION_ERROR:", error);
        return { success: false };
    }
}

export async function trackEventAction(storeId: string, path: string, eventType: string, eventData: any = {}) {
    try {
        await AnalyticsService.trackEvent(storeId, path, {
            type: eventType,
            data: eventData,
            timestamp: new Date()
        });
        return { success: true };
    } catch (error) {
        console.error("EVENT_ACTION_ERROR:", error);
        return { success: false };
    }
}

export async function trackHeartbeatAction(storeId: string) {
    try {
        await AnalyticsService.trackHeartbeat(storeId);
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
