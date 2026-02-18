import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const ExperimentEventSchema = z.object({
    experimentKey: z.string().min(3),
    eventName: z.string().min(3),
    variant: z.string().min(2),
    locale: z.string().optional(),
    templateId: z.string().optional(),
    intent: z.string().optional(),
    sessionId: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = ExperimentEventSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "INVALID_EXPERIMENT_EVENT", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const supabase = await createAdminClient();
        const payload = parsed.data;

        const { error } = await supabase.from("experiment_events").insert({
            experiment_key: payload.experimentKey,
            event_name: payload.eventName,
            variant: payload.variant,
            locale: payload.locale || null,
            template_id: payload.templateId || null,
            intent: payload.intent || null,
            session_id: payload.sessionId || null,
            metadata: payload.metadata || {},
        });

        if (error) {
            return NextResponse.json({ error: "EXPERIMENT_EVENT_WRITE_FAILED" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Experiment event track failed:", error);
        return NextResponse.json({ error: "EXPERIMENT_EVENT_INTERNAL_ERROR" }, { status: 500 });
    }
}
