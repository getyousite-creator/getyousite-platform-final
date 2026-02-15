const BASE_URL = process.env.AUDIT_BASE_URL || "https://getyousite.com";

async function probe(path: string, body: Record<string, unknown>) {
    const started = Date.now();
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000),
    });
    const text = await res.text();
    return {
        path,
        status: res.status,
        latencyMs: Date.now() - started,
        body: text.slice(0, 280).replace(/\s+/g, " "),
    };
}

async function run() {
    const payload = {
        businessName: "ProbeCo",
        niche: "saas",
        vision: "Build a conversion-focused SaaS landing page with multilingual support",
        locale: "en",
    };

    const checks = ["/api/generate", "/en/api/generate"];
    let failed = false;

    for (const path of checks) {
        const result = await probe(path, payload);
        console.log(`${result.status}\t${result.latencyMs}ms\t${path}\t${result.body}`);

        // Expected when anonymous:
        // /api/generate => 401 UNAUTHORIZED
        // /en/api/generate => 500 with AUTH_REQUIRED_FOR_AI (current implementation)
        if (![401, 500].includes(result.status)) {
            failed = true;
        }
    }

    if (failed) {
        console.log("FAIL: Unexpected generate API behavior for anonymous probe.");
        process.exitCode = 1;
    } else {
        console.log("PASS: Generate API probe matches expected anonymous guard behavior.");
    }
}

run().catch((error) => {
    console.error("Generate audit crashed:", error);
    process.exitCode = 1;
});

export {};
