type ProbeResult = {
    path: string;
    status: number | "ERR";
    location?: string;
    latencyMs: number;
    error?: string;
};

const BASE_URL = process.env.AUDIT_BASE_URL || "https://getyousite.com";
const LOCALES = ["en", "ar", "fr", "es"] as const;
const CRITICAL_PAGES = ["", "pricing", "services", "templates", "showcase", "signup", "login"] as const;
const PROTECTED_PAGES = ["customizer", "dashboard"] as const;

async function probe(path: string): Promise<ProbeResult> {
    const url = `${BASE_URL}${path}`;
    const started = Date.now();

    try {
        const res = await fetch(url, {
            method: "GET",
            redirect: "manual",
            signal: AbortSignal.timeout(15000),
        });

        return {
            path,
            status: res.status,
            location: res.headers.get("location") || undefined,
            latencyMs: Date.now() - started,
        };
    } catch (error) {
        return {
            path,
            status: "ERR",
            latencyMs: Date.now() - started,
            error: error instanceof Error ? error.message : "Unknown probe error",
        };
    }
}

function isProtectedRedirectValid(path: string, location?: string): boolean {
    if (!location) return false;
    const locale = path.split("/")[1];
    return location === "/login" || location === `/${locale}/login`;
}

function classify(result: ProbeResult): "pass" | "warn" | "fail" {
    const isProtected = PROTECTED_PAGES.some((p) => result.path.endsWith(`/${p}`));

    if (result.status === "ERR") return "fail";

    if (!isProtected) {
        return typeof result.status === "number" && result.status >= 200 && result.status < 300 ? "pass" : "fail";
    }

    if (result.status === 307 && isProtectedRedirectValid(result.path, result.location)) return "pass";
    if (result.status === 200) return "pass"; // Authenticated scenario / public fallback
    return "warn";
}

async function run() {
    const paths: string[] = [];

    for (const locale of LOCALES) {
        for (const page of CRITICAL_PAGES) {
            paths.push(page ? `/${locale}/${page}` : `/${locale}`);
        }
        for (const page of PROTECTED_PAGES) {
            paths.push(`/${locale}/${page}`);
        }
    }

    const results: ProbeResult[] = [];
    for (const path of paths) {
        const result = await probe(path);
        results.push(result);
        const loc = result.location ? ` -> ${result.location}` : "";
        const err = result.error ? ` | ${result.error}` : "";
        console.log(`${result.status}\t${result.latencyMs}ms\t${path}${loc}${err}`);
    }

    const failed = results.filter((r) => classify(r) === "fail");
    const warned = results.filter((r) => classify(r) === "warn");
    const passed = results.filter((r) => classify(r) === "pass");

    console.log("\n=== AUDIT SUMMARY ===");
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Pass: ${passed.length}`);
    console.log(`Warn: ${warned.length}`);
    console.log(`Fail: ${failed.length}`);

    if (failed.length > 0) {
        console.log("\nFailed paths:");
        for (const f of failed) {
            console.log(`- ${f.path} (${f.status})`);
        }
        process.exitCode = 1;
    }
}

run().catch((error) => {
    console.error("Audit crashed:", error);
    process.exitCode = 1;
});

export {};
