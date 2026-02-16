import fs from "node:fs";
import path from "node:path";

type JsonMap = Record<string, unknown>;

const LOCALES = ["en", "ar", "fr", "es"] as const;
const BASE_LOCALE = "en";
const MOJIBAKE_PATTERN = /(Â|Ã|�)/;

function isObject(value: unknown): value is JsonMap {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function flatten(
    input: unknown,
    prefix = "",
    target: Record<string, unknown> = {},
): Record<string, unknown> {
    if (Array.isArray(input)) {
        input.forEach((value, idx) => {
            const next = prefix ? `${prefix}.${idx}` : String(idx);
            flatten(value, next, target);
        });
        return target;
    }

    if (!isObject(input)) {
        if (prefix) target[prefix] = input;
        return target;
    }

    for (const [key, value] of Object.entries(input)) {
        const next = prefix ? `${prefix}.${key}` : key;
        flatten(value, next, target);
    }

    return target;
}

function readLocale(locale: string): JsonMap {
    const file = path.join(process.cwd(), "messages", `${locale}.json`);
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw) as JsonMap;
}

function main() {
    const localeMaps = new Map<string, Record<string, unknown>>();
    for (const locale of LOCALES) {
        localeMaps.set(locale, flatten(readLocale(locale)));
    }

    const baseMap = localeMaps.get(BASE_LOCALE);
    if (!baseMap) {
        console.error("FATAL: base locale 'en' not found.");
        process.exit(1);
    }

    let hasFailures = false;

    for (const locale of LOCALES) {
        const map = localeMaps.get(locale);
        if (!map) continue;

        const missing: string[] = [];
        const extra: string[] = [];
        const mojibake: Array<{ keyPath: string; value: string }> = [];

        if (locale !== BASE_LOCALE) {
            for (const key of Object.keys(baseMap)) {
                if (!(key in map)) missing.push(key);
            }
            for (const key of Object.keys(map)) {
                if (!(key in baseMap)) extra.push(key);
            }
        }

        for (const [keyPath, value] of Object.entries(map)) {
            if (typeof value === "string" && MOJIBAKE_PATTERN.test(value)) {
                mojibake.push({ keyPath, value });
            }
        }

        console.log(`\n=== I18N AUDIT: ${locale} ===`);
        if (locale !== BASE_LOCALE) {
            console.log(`missing_keys: ${missing.length}`);
            console.log(`extra_keys: ${extra.length}`);
        }
        console.log(`mojibake_hits: ${mojibake.length}`);

        if (missing.length > 0) {
            hasFailures = true;
            console.log("missing_key_paths:");
            for (const key of missing.slice(0, 100)) console.log(`- ${key}`);
            if (missing.length > 100) {
                console.log(`... and ${missing.length - 100} more`);
            }
        }

        if (extra.length > 0) {
            hasFailures = true;
            console.log("extra_key_paths:");
            for (const key of extra.slice(0, 100)) console.log(`- ${key}`);
            if (extra.length > 100) {
                console.log(`... and ${extra.length - 100} more`);
            }
        }

        if (mojibake.length > 0) {
            hasFailures = true;
            console.log("mojibake_samples:");
            for (const item of mojibake.slice(0, 50)) {
                console.log(`- ${item.keyPath}: ${item.value}`);
            }
            if (mojibake.length > 50) {
                console.log(`... and ${mojibake.length - 50} more`);
            }
        }
    }

    if (hasFailures) {
        console.error("\nI18N QUALITY GATE: FAILED");
        process.exit(1);
    }

    console.log("\nI18N QUALITY GATE: PASSED");
}

main();

