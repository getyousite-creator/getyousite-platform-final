export {};

const BASE_URL = process.env.AUDIT_BASE_URL || 'https://getyousite.com';
const LOCALES = ['en', 'ar', 'fr', 'es'] as const;

type UiIssue = {
  locale: string;
  type: 'placeholder_link' | 'icon_only_button_without_aria';
  detail: string;
};

function extractMatches(html: string, pattern: RegExp): string[] {
  return Array.from(html.matchAll(pattern)).map((m) => m[0]);
}

function isIconOnly(innerHtml: string): boolean {
  const withoutTags = innerHtml.replace(/<[^>]+>/g, '').replace(/\s+/g, '').trim();
  return withoutTags.length === 0;
}

async function run() {
  const issues: UiIssue[] = [];

  for (const locale of LOCALES) {
    const url = `${BASE_URL}/${locale}`;
    let html = '';
    try {
      const res = await fetch(url, { redirect: 'follow' });
      html = await res.text();
    } catch {
      issues.push({ locale, type: 'placeholder_link', detail: `Failed to fetch ${url}` });
      continue;
    }

    const placeholderAnchors = extractMatches(html, /<a\b[^>]*href="#"[^>]*>/gi);
    for (const a of placeholderAnchors) {
      issues.push({
        locale,
        type: 'placeholder_link',
        detail: a.slice(0, 180),
      });
    }

    const buttons = Array.from(html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi));
    for (const match of buttons) {
      const attrs = match[1] || '';
      const inner = match[2] || '';
      const hasAriaLabel = /\baria-label\s*=\s*"[^"]+"/i.test(attrs);
      if (isIconOnly(inner) && !hasAriaLabel) {
        issues.push({
          locale,
          type: 'icon_only_button_without_aria',
          detail: `<button${attrs}>...</button>`.slice(0, 180),
        });
      }
    }
  }

  const placeholderCount = issues.filter((i) => i.type === 'placeholder_link').length;
  const unlabeledIconButtons = issues.filter((i) => i.type === 'icon_only_button_without_aria').length;

  console.log('=== UI AUDIT SUMMARY ===');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Locales: ${LOCALES.join(', ')}`);
  console.log(`placeholder_link: ${placeholderCount}`);
  console.log(`icon_only_button_without_aria: ${unlabeledIconButtons}`);

  if (issues.length > 0) {
    console.log('\n=== UI ISSUES ===');
    for (const issue of issues) {
      console.log(`${issue.locale}\t${issue.type}\t${issue.detail}`);
    }
  }

  if (placeholderCount > 0 || unlabeledIconButtons > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal UI audit failure:', err);
  process.exit(1);
});
