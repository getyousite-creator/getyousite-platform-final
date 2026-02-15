import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

const requiredEnv = [
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

function loadEnvFiles() {
    const cwd = process.cwd();
    const candidates = [".env.production.local", ".env.local"];

    for (const file of candidates) {
        const full = path.join(cwd, file);
        if (fs.existsSync(full)) {
            dotenv.config({ path: full, override: false });
        }
    }
}

function checkEnv() {
    const missing = requiredEnv.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        console.error("PRECHECK FAIL: Missing required env vars:");
        for (const key of missing) console.error(`- ${key}`);
        process.exit(1);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    if (!siteUrl.startsWith("https://")) {
        console.error("PRECHECK FAIL: NEXT_PUBLIC_SITE_URL must start with https://");
        process.exit(1);
    }
}

function run(cmd: string, env: NodeJS.ProcessEnv = process.env) {
    console.log(`\n>>> ${cmd}`);
    execSync(cmd, { stdio: "inherit", env });
}

function main() {
    loadEnvFiles();
    checkEnv();
    run("npm run build");
    run("npm run audit:routes", {
        ...process.env,
        AUDIT_BASE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    });
    run("npm run audit:seo", {
        ...process.env,
        AUDIT_BASE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    });
    run("npm run audit:generate", {
        ...process.env,
        AUDIT_BASE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    });
    console.log("\nPRECHECK PASS: build + audits are green.");
}

main();

export {};
