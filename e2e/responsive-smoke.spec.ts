import { expect, test } from "@playwright/test";

const PROFILES = [
    {
        name: "desktop",
        viewport: { width: 1440, height: 900 },
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
    {
        name: "mobile",
        viewport: { width: 390, height: 844 },
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    },
    {
        name: "ipad",
        viewport: { width: 1024, height: 1366 },
        userAgent:
            "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    },
];

async function hasHorizontalOverflow(page: Parameters<typeof test>[0]["page"]) {
    return page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > doc.clientWidth + 1;
    });
}

for (const profile of PROFILES) {
    test(`responsive smoke - ${profile.name}`, async ({ page }, testInfo) => {
        await page.setViewportSize(profile.viewport);
        await page.setExtraHTTPHeaders({ "user-agent": profile.userAgent });

        await page.goto("/en", { waitUntil: "domcontentloaded" });
        await expect(page.locator("h1").first()).toBeVisible();
        await page.screenshot({
            path: testInfo.outputPath(`${profile.name}-home.png`),
            fullPage: false,
        });

        const homeOverflow = await hasHorizontalOverflow(page);
        expect(homeOverflow, `${profile.name}: home should not overflow horizontally`).toBeFalsy();

        await page.goto("/en/pricing", { waitUntil: "domcontentloaded" });
        await expect(page).toHaveURL(/\/en\/pricing/);
        await page.screenshot({
            path: testInfo.outputPath(`${profile.name}-pricing.png`),
            fullPage: false,
        });

        const pricingOverflow = await hasHorizontalOverflow(page);
        expect(pricingOverflow, `${profile.name}: pricing should not overflow horizontally`).toBeFalsy();

        await page.goto("/en/customizer?vision=coffee%20shop%20premium", {
            waitUntil: "domcontentloaded",
        });
        await expect(page.url()).toContain("/en/login");
        await page.screenshot({
            path: testInfo.outputPath(`${profile.name}-customizer-guard.png`),
            fullPage: false,
        });
    });
}
