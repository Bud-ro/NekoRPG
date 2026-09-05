import { test, expect } from '@playwright/test';

// Runs the game's own integrity checker (src/verifier.js) against all loaded
// templates. Any console.error it prints (id mismatches, dangling effect refs,
// bad location connections, milestone rewards for non-existent skills, ...)
// fails this test.
test('Verify_Game_Objects reports no integrity errors', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('/');
  await expect(page.locator('#loading_screen')).toBeHidden({ timeout: 10000 });

  const ran = await page.evaluate(async () => {
    const mod = await import('./src/verifier.js');
    mod.Verify_Game_Objects();
    return true;
  });
  expect(ran).toBe(true);

  const real = errors.filter(e => !/play method is not allowed|autoplay/.test(e));
  expect(real, `integrity errors:\n${real.join('\n')}`).toHaveLength(0);
});
