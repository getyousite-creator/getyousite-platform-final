const BASE_URL = process.env.AUDIT_BASE_URL || 'https://getyousite.com';
const LOCALES = ['en', 'ar', 'fr', 'es'] as const;

const seedPaths = [
  '',
  '/pricing',
  '/services',
  '/templates',
  '/showcase',
  '/blog',
  '/contact',
  '/privacy',
  '/terms',
  '/login',
  '/signup',
];

type LinkCheck = { url: string; status: number; location?: string; source: string };

function absolutize(href: string): string | null {
  if (!href) return null;
  if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return null;
  }
  if (href.startsWith('http://') || href.startsWith('https://')) return href;
  if (href.startsWith('/')) return `${BASE_URL}${href}`;
  return null;
}

function extractHrefs(html: string): string[] {
  const hrefs = Array.from(html.matchAll(/href="([^"]+)"/g)).map((m) => m[1]);
  return Array.from(new Set(hrefs));
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function checkUrl(url: string, source: string): Promise<LinkCheck> {
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const location = res.headers.get('location') || undefined;
    return { url, status: res.status, location, source };
  } catch {
    return { url, status: 0, source };
  }
}

async function run() {
  const discovered = new Map<string, string>();

  for (const locale of LOCALES) {
    for (const path of seedPaths) {
      const seed = `${BASE_URL}/${locale}${path}`;
      const html = await fetchHtml(seed);
      if (!html) continue;

      const hrefs = extractHrefs(html);
      for (const href of hrefs) {
        const abs = absolutize(href);
        if (!abs) continue;

        const isSameOrigin = abs.startsWith(BASE_URL);
        const isLocaleScoped = abs.startsWith(`${BASE_URL}/${locale}/`) || abs === `${BASE_URL}/${locale}`;
        if (isSameOrigin && isLocaleScoped && !discovered.has(abs)) {
          discovered.set(abs, seed);
        }
      }
    }
  }

  const checks: LinkCheck[] = [];
  for (const [url, source] of discovered.entries()) {
    checks.push(await checkUrl(url, source));
  }

  let pass = 0;
  let fail = 0;
  for (const c of checks) {
    const isOk = c.status >= 200 && c.status < 400;
    if (isOk) {
      pass += 1;
      console.log(`${c.status}\t${c.url}`);
    } else {
      fail += 1;
      console.log(`${c.status}\t${c.url}\t(source: ${c.source})${c.location ? ` -> ${c.location}` : ''}`);
    }
  }

  console.log('\n=== LINK AUDIT SUMMARY ===');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Checked: ${checks.length}`);
  console.log(`Pass: ${pass}`);
  console.log(`Fail: ${fail}`);

  if (fail > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal link audit failure:', err);
  process.exit(1);
});

