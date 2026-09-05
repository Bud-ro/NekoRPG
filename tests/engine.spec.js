import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'legacy-english-save.txt');
const isAutoplayError = (msg) => msg.includes('play method is not allowed') || msg.includes('autoplay');

test('phase-change engine: env buttons, heart conversion, layout', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error' && !isAutoplayError(msg.text())) errors.push(msg.text());
  });

  await page.goto('/');
  await expect(page.locator('#loading_screen')).toBeHidden({ timeout: 10000 });
  await page.setInputFiles('#saved_file_input', FIXTURE);
  await page.waitForTimeout(1500);

  await page.evaluate(() => { window.start_dialogue('极寒相变引擎'); window.start_textline('engine'); });
  await page.waitForTimeout(800);
  await expect(page.locator('#engine_div')).toBeVisible();

  // environment buttons unlocked at Domain Stage 2 (the save's realm) and clickable
  await expect(page.locator('#engine_env1')).toBeVisible();
  await expect(page.locator('#engine_env2')).toBeVisible();
  await page.click('#engine_env1');
  await expect(page.locator('#engine_result_temp')).toContainText('960');

  // no engine element may spill past the panel's right/bottom edge
  const overflows = await page.evaluate(() => {
    const div = document.getElementById('engine_div').getBoundingClientRect();
    return ['piston_defill', 'piston_stats', 'engine_result_stats', 'engine_container_stats'].map(id => {
      const b = document.getElementById(id).getBoundingClientRect();
      return { id, right: Math.round(b.right - div.right), bottom: Math.round(b.bottom - div.bottom) };
    });
  });
  for (const o of overflows) {
    expect(o.right, `${o.id} overflows right edge`).toBeLessThanOrEqual(0);
    expect(o.bottom, `${o.id} overflows bottom edge`).toBeLessThanOrEqual(0);
  }

  // Spaceship Heart converts to its material version when equipped
  const conv = await page.evaluate(async () => {
    const c = await import('./src/character.js');
    const it = await import('./src/items.js');
    c.character.equipment.special = it.getItem({ ...it.item_templates['飞船之心'] });
    window.engine_e(-1);
    return {
      specialAfter: c.character.equipment.special,
      material: Object.keys(c.character.inventory).some(k => k.includes('飞船之心·材')),
    };
  });
  expect(conv.specialAfter).toBeNull();
  expect(conv.material).toBe(true);

  expect(errors, `errors: ${errors.join('\n')}`).toHaveLength(0);
});
