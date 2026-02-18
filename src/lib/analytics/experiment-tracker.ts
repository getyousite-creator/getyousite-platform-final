"use client";

import { track } from "@vercel/analytics";

interface ExperimentPayload {
    experimentKey: string;
    eventName: string;
    variant: string;
    locale?: string;
    templateId?: string;
    intent?: string;
    metadata?: Record<string, unknown>;
}

function getSessionId() {
    if (typeof window === "undefined") return "";
    const key = "exp_session_id";
    const existing = window.sessionStorage.getItem(key);
    if (existing) return existing;
    const generated = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    window.sessionStorage.setItem(key, generated);
    return generated;
}

export async function trackExperimentEvent(payload: ExperimentPayload) {
    const sessionId = getSessionId();

    track(payload.eventName, {
        variant: payload.variant,
        locale: payload.locale || "",
        template_id: payload.templateId || "",
        intent: payload.intent || "",
        ...(payload.metadata || {}),
    });

    try {
        await fetch("/api/experiments/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            keepalive: true,
            body: JSON.stringify({
                ...payload,
                sessionId,
            }),
        });
    } catch {
        // Best-effort mirror to backend; Vercel analytics track already fired.
    }
}
