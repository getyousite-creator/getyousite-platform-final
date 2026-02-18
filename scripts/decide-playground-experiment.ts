import { createClient } from "@supabase/supabase-js";
import {
    aggregateByVariant,
    decideExperiment,
    toSerializableMetrics,
    type ExperimentEventRow,
} from "../src/lib/analytics/experiment-decision.ts";

async function main() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const daysBack = Number(process.argv[2] || 14);

    if (!supabaseUrl || !serviceRoleKey) {
        console.error(
            "Missing env vars: require NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.",
        );
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const sinceIso = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
        .from("experiment_events")
        .select("variant, event_name, session_id, created_at")
        .eq("experiment_key", "exp_playground_cta_v1")
        .gte("created_at", sinceIso);

    if (error) {
        console.error("Failed to load experiment events:", error.message);
        process.exit(1);
    }

    const metricsByVariant = aggregateByVariant((data || []) as ExperimentEventRow[]);
    const serialized = toSerializableMetrics(metricsByVariant);

    console.log(`Experiment window: last ${daysBack} days`);
    for (const variant of Object.keys(serialized)) {
        const m = serialized[variant];
        console.log(
            `${variant}: exposure=${m.exposure}, publish=${m.publishClicks} (${(
                m.publishRate * 100
            ).toFixed(2)}%), signup=${m.signupSuccess} (${(m.signupRate * 100).toFixed(2)}%)`,
        );
    }

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

    const result = decideExperiment(
        { exposure: control.exposure, signupSuccess: control.signupSuccess },
        { exposure: challenger.exposure, signupSuccess: challenger.signupSuccess },
        "trust_first",
        100,
    );

    console.log(
        `Signup conversion lift (trust_first vs control): ${result.liftPercent.toFixed(2)}%`,
    );
    console.log(`z-score=${result.zScore.toFixed(3)}, p≈${result.pValueApprox.toFixed(4)}`);
    console.log(`Decision: ${result.decision}`);
    console.log(`Reason: ${result.reason}`);
}

main().catch((error) => {
    console.error("Decision script crashed:", error);
    process.exit(1);
});
