import { expect, test } from '@playwright/test';

const LOCALES = ['en', 'ar', 'fr', 'es'] as const;

test('production customer flow with live screenshots', async ({ page, request }, testInfo) => {
  test.setTimeout(300_000);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const email = process.env.E2E_SIGNUP_EMAIL || `qa+${stamp}@example.com`;
  const password = process.env.E2E_SIGNUP_PASSWORD || 'Sovereign!Pass12345';

  const shot = async (name: string) => {
    await page.screenshot({
      path: testInfo.outputPath(`${name}.png`),
      fullPage: true,
    });
  };

  const resilientFill = async (selector: string, value: string) => {
    const input = page.locator(selector).first();
    await expect(input).toBeVisible();

    try {
      await input.fill(value, { force: true, timeout: 10_000 });
      return;
    } catch {
      await input.evaluate((el, v) => {
        const node = el as HTMLInputElement;
        node.value = v;
        node.dispatchEvent(new Event('input', { bubbles: true }));
        node.dispatchEvent(new Event('change', { bubbles: true }));
      }, value);
    }
  };

  await test.step('Home page load + scroll screenshots', async () => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/en$/);
    await shot('01-home-top');

    await page.mouse.wheel(0, 1800);
    await page.waitForTimeout(700);
    await shot('02-home-mid');

    await page.mouse.wheel(0, 2200);
    await page.waitForTimeout(700);
    await shot('03-home-bottom');
  });

  await test.step('Core localized routes should open', async () => {
    const criticalUrls = ['/', '/en/pricing', '/en/services', '/en/templates', '/en/showcase', '/ar', '/fr', '/es'];
    for (const url of criticalUrls) {
      const res = await request.get(url);
      expect(res.status(), `${url} should not fail`).toBeLessThan(400);
    }
  });

  await test.step('Signup as a live customer candidate', async () => {
    await page.goto('/en/signup', { waitUntil: 'domcontentloaded' });
    await shot('04-signup-open');

    await resilientFill('input[name="email"]', email);
    await resilientFill('input[name="password"]', password);
    await shot('05-signup-filled');

    await page.getByRole('button', { name: /Create My Account/i }).click();
    await page.waitForTimeout(2500);
    await shot('06-signup-result');

    const checkEmailVisible = await page.getByText(/Check your email/i).isVisible().catch(() => false);
    const inlineErrorVisible = await page.locator('div.text-red-500, div.bg-red-500\\/10').first().isVisible().catch(() => false);
    expect(checkEmailVisible || inlineErrorVisible).toBeTruthy();
  });

  await test.step('Login page UX check + screenshot', async () => {
    await page.goto('/en/login', { waitUntil: 'domcontentloaded' });
    await shot('07-login-open');
    await expect(page.getByRole('button', { name: /Login/i })).toBeVisible();
  });

  await test.step('Anonymous generate endpoint should stay protected', async () => {
    const res = await request.post('/api/generate', {
      data: { prompt: 'create a coffee website', businessType: 'coffee' },
    });
    expect([400, 401]).toContain(res.status());
  });
});
