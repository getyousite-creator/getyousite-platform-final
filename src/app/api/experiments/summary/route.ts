import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
    aggregateByVariant,
    decideExperiment,
    toSerializableMetrics,
    type ExperimentEventRow,
} from "@/lib/analytics/experiment-decision";

export async function GET(req: NextRequest) {
    try {
        const AUTHORIZED_EMAIL = "u110877386@getyousite.com";
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user || user.email !== AUTHORIZED_EMAIL) {
            return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const experimentKey = searchParams.get("experimentKey") || "exp_playground_cta_v1";
        const days = Number(searchParams.get("days") || 14);
        const minExposure = Number(searchParams.get("minExposure") || 100);

        const sinceIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

        const adminSupabase = await createAdminClient();

        const { data, error } = await adminSupabase
            .from("experiment_events")
            .select("variant, event_name, session_id")
            .eq("experiment_key", experimentKey)
            .gte("created_at", sinceIso);

        if (error) {
            return NextResponse.json({ error: "EXPERIMENT_SUMMARY_QUERY_FAILED" }, { status: 500 });
        }

        const metrics = aggregateByVariant((data || []) as ExperimentEventRow[]);
        const serialized = toSerializableMetrics(metrics);

        const control = serialized.control || {
            exposure: 0,
            publishClicks: 0,
            signupSuccess: 0,
            publishRate: 0,
            signupRate: 0,
        };
        const challenger = serialized.trust_first || {
            exposure: 0,
            publishClicks: 0,
            signupSuccess: 0,
            publishRate: 0,
            signupRate: 0,
        };

        const decision = decideExperiment(
            { exposure: control.exposure, signupSuccess: control.signupSuccess },
            { exposure: challenger.exposure, signupSuccess: challenger.signupSuccess },
            "trust_first",
            minExposure,
        );

        return NextResponse.json({
            experimentKey,
            windowDays: days,
            since: sinceIso,
            metrics: serialized,
            decision,
        });
    } catch {
        return NextResponse.json({ error: "EXPERIMENT_SUMMARY_INTERNAL_ERROR" }, { status: 500 });
    }
}
