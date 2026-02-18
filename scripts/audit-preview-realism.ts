import { chromium } from "@playwright/test";

const BASE_URL = process.env.AUDIT_BASE_URL || process.env.E2E_BASE_URL || "https://getyousite.com";
const LOCALE = process.env.AUDIT_LOCALE || "en";
const KEY_LEAK_PATTERN = /(Showcase\.Templates\.features|Templates\.features\.)/;

type CheckResult = {
    name: string;
    passed: boolean;
    detail: string;
};

async function run() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const checks: CheckResult[] = [];

    try {
        // 1) Playground grid realism: cards, headings, and no key leaks.
        await page.goto(`${BASE_URL}/${LOCALE}/playground`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(1000);

        const cardCount = await page.locator("button.group").count();
        const pageText = await page.locator("body").innerText();
        const keyLeak = KEY_LEAK_PATTERN.test(pageText);

        checks.push({
            name: "playground_cards_count",
            passed: cardCount >= 6,
            detail: `cards=${cardCount}, expected>=6`,
        });
        checks.push({
            name: "playground_translation_key_leak",
            passed: !keyLeak,
            detail: keyLeak
                ? "Found unresolved translation key pattern."
                : "No unresolved key pattern.",
        });

        // 2) Template trial realism: timer, editable controls, live preview frame.
        await page.goto(`${BASE_URL}/${LOCALE}/playground/tech-grid`, {
            waitUntil: "domcontentloaded",
        });
        await page.waitForTimeout(1200);

        const timerText = await page.locator("body").innerText();
        const hasTimer = /\b\d{2}:\d{2}\b/.test(timerText);
        const inputCount = await page.locator("input").count();
        const hasPreviewContainer = (await page.locator("section").count()) > 0;
        const hasCTA = (await page.getByRole("button").count()) > 0;

        checks.push({
            name: "trial_timer_visible",
            passed: hasTimer,
            detail: hasTimer ? "Timer detected." : "No MM:SS timer detected.",
        });
        checks.push({
            name: "trial_edit_controls",
            passed: inputCount >= 3,
            detail: `inputs=${inputCount}, expected>=3`,
        });
        checks.push({
            name: "trial_preview_present",
            passed: hasPreviewContainer,
            detail: hasPreviewContainer ? "Preview container found." : "Preview container missing.",
        });
        checks.push({
            name: "trial_cta_present",
            passed: hasCTA,
            detail: hasCTA ? "CTA button detected." : "CTA button missing.",
        });
    } finally {
        await browser.close();
    }

    const failed = checks.filter((c) => !c.passed);
    console.log("=== PREVIEW REALISM AUDIT ===");
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Locale: ${LOCALE}`);
    for (const check of checks) {
        console.log(`${check.passed ? "PASS" : "FAIL"}\t${check.name}\t${check.detail}`);
    }

    const score = Math.round((checks.filter((c) => c.passed).length / checks.length) * 100);
    console.log(`realism_score: ${score}/100`);

    if (failed.length > 0) {
        process.exitCode = 1;
    }
}

run().catch((error) => {
    console.error("Preview realism audit crashed:", error);
    process.exitCode = 1;
});
