const BASE_URL = process.env.AUDIT_BASE_URL || "https://getyousite.com";

async function fetchText(path: string) {
    const url = `${BASE_URL}${path}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const text = await res.text();
    return { url, status: res.status, text };
}

function hasLocalhostLeak(text: string): boolean {
    return text.includes("http://localhost") || text.includes("https://localhost");
}

async function run() {
    const robots = await fetchText("/robots.txt");
    const sitemap = await fetchText("/sitemap.xml");

    console.log(`robots\t${robots.status}\t${robots.url}`);
    console.log(`sitemap\t${sitemap.status}\t${sitemap.url}`);

    const robotsHasWrongSitemap = !robots.text.includes(`${BASE_URL}/sitemap.xml`);
    const sitemapHasLocalhost = hasLocalhostLeak(sitemap.text);

    console.log(`robots_has_expected_sitemap\t${!robotsHasWrongSitemap}`);
    console.log(`sitemap_has_localhost_leak\t${sitemapHasLocalhost}`);

    if (robotsHasWrongSitemap || sitemapHasLocalhost) {
        if (robotsHasWrongSitemap) {
            console.log("FAIL: robots.txt sitemap does not match production base URL.");
        }
        if (sitemapHasLocalhost) {
            console.log("FAIL: sitemap.xml contains localhost URLs.");
        }
        process.exitCode = 1;
    } else {
        console.log("PASS: SEO endpoint audit clean.");
    }
}

run().catch((error) => {
    console.error("SEO audit crashed:", error);
    process.exitCode = 1;
});

export {};
