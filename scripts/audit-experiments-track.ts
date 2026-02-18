const BASE_URL = process.env.AUDIT_BASE_URL || process.env.E2E_BASE_URL || "https://getyousite.com";

async function postJson(url: string, body: unknown) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const text = await response.text();
    let parsed: unknown = null;
    try {
        parsed = text ? JSON.parse(text) : null;
    } catch {
        parsed = text;
    }

    return { status: response.status, body: parsed };
}

async function run() {
    const sessionId = `audit-${Math.random().toString(36).slice(2, 10)}`;

    const eventPayload = {
        experimentKey: "exp_playground_cta_v1",
        variant: "control",
        eventName: "exp_playground_cta_v1_exposure",
        sessionId,
        metadata: { source: "audit_experiments_track" },
    };

    const track = await postJson(`${BASE_URL}/api/experiments/track`, eventPayload);
    const summary = await fetch(`${BASE_URL}/api/experiments/summary`);

    console.log("=== EXPERIMENT AUDIT ===");
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`track_status: ${track.status}`);
    console.log(`track_body: ${JSON.stringify(track.body)}`);
    console.log(`summary_status: ${summary.status}`);

    if (track.status !== 200) {
        process.exitCode = 1;
        return;
    }

    // Summary endpoint is expected to be auth-protected.
    if (summary.status !== 401) {
        process.exitCode = 1;
        return;
    }

    console.log("PASS: experiments tracking and summary guard are healthy.");
}

run().catch((error) => {
    console.error("Experiment audit crashed:", error);
    process.exitCode = 1;
});
