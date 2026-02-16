import fs from "node:fs";
import path from "node:path";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };
type JsonObject = { [k: string]: JsonValue };

const LOCALES = ["en", "ar", "fr", "es"] as const;
const BASE_LOCALE = "en";

const STRING_REPLACEMENTS: Array<[RegExp, string]> = [
    [/Â©/g, "©"],
    [/Â²/g, "²"],
    [/Ã©/g, "é"],
    [/Ã¨/g, "è"],
    [/Ã /g, "à"],
    [/Ãª/g, "ê"],
    [/Ã«/g, "ë"],
    [/Ã®/g, "î"],
    [/Ã¯/g, "ï"],
    [/Ã´/g, "ô"],
    [/Ã¶/g, "ö"],
    [/Ã¹/g, "ù"],
    [/Ã»/g, "û"],
    [/Ã¼/g, "ü"],
    [/â€™/g, "'"],
    [/â€œ/g, "\""],
    [/â€/g, "\""],
    [/â€“/g, "-"],
    [/â€”/g, "-"],
    [/â€¦/g, "..."],
    [/Â/g, ""],
];

function readLocale(locale: string): JsonObject {
    const file = path.join(process.cwd(), "messages", `${locale}.json`);
    return JSON.parse(fs.readFileSync(file, "utf8")) as JsonObject;
}

function writeLocale(locale: string, content: JsonObject) {
    const file = path.join(process.cwd(), "messages", `${locale}.json`);
    fs.writeFileSync(file, `${JSON.stringify(content, null, 4)}\n`, "utf8");
}

function deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

function sanitizeStrings(node: JsonValue): JsonValue {
    if (typeof node === "string") {
        let next = node;
        for (const [pattern, replacement] of STRING_REPLACEMENTS) {
            next = next.replace(pattern, replacement);
        }
        return next;
    }
    if (Array.isArray(node)) {
        return node.map((item) => sanitizeStrings(item as JsonValue));
    }
    if (node && typeof node === "object") {
        const out: JsonObject = {};
        for (const [k, v] of Object.entries(node)) {
            out[k] = sanitizeStrings(v as JsonValue);
        }
        return out;
    }
    return node;
}

function mergeFromBase(base: JsonValue, target: JsonValue): JsonValue {
    if (Array.isArray(base)) {
        if (!Array.isArray(target)) return deepClone(base);
        const out: JsonValue[] = [];
        for (let i = 0; i < base.length; i += 1) {
            out[i] = mergeFromBase(base[i], target[i]);
        }
        return out;
    }

    if (base && typeof base === "object") {
        const baseObj = base as JsonObject;
        const targetObj = target && typeof target === "object" && !Array.isArray(target)
            ? (target as JsonObject)
            : {};
        const out: JsonObject = {};
        for (const [key, baseValue] of Object.entries(baseObj)) {
            out[key] = mergeFromBase(baseValue, targetObj[key]);
        }
        return out;
    }

    if (typeof target === typeof base && target !== undefined) {
        return sanitizeStrings(target);
    }
    return sanitizeStrings(base);
}

function main() {
    const baseRaw = readLocale(BASE_LOCALE);
    const base = sanitizeStrings(baseRaw) as JsonObject;

    writeLocale(BASE_LOCALE, base);

    for (const locale of LOCALES) {
        if (locale === BASE_LOCALE) continue;
        const current = sanitizeStrings(readLocale(locale)) as JsonObject;
        const merged = mergeFromBase(base, current) as JsonObject;
        writeLocale(locale, merged);
        console.log(`fixed locale: ${locale}`);
    }

    console.log("i18n locale normalization complete.");
}

main();

