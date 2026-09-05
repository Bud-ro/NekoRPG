import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'legacy-english-save.txt');

const decodeSave = (b64) => JSON.parse(decodeURIComponent(Buffer.from(b64, 'base64').toString()));
const CJK = /[一-鿿]/;
const isAutoplayError = (msg) => msg.includes('play method is not allowed') || msg.includes('autoplay');

function collectErrors(page) {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error' && !isAutoplayError(msg.text())) errors.push(msg.text());
  });
  return errors;
}

async function loadGameAndImport(page) {
  await page.goto('/');
  await expect(page.locator('#loading_screen')).toBeHidden({ timeout: 10000 });
  await page.setInputFiles('#saved_file_input', FIXTURE);
  await page.waitForTimeout(1500);
}

test('legacy English save imports without errors', async ({ page }) => {
  const errors = collectErrors(page);
  await loadGameAndImport(page);

  await expect(page.locator('#main_content')).toBeVisible();
  // character state from the save is loaded (not a fresh Dust Rank character)
  const info = await page.locator('#basic_character_info_div').innerText();
  expect(info).not.toContain('Dust Rank: Novice');
  expect(errors, `errors: ${errors.join('\n')}`).toHaveLength(0);
});

test('no Chinese appears in the UI after importing legacy save', async ({ page }) => {
  collectErrors(page);
  await loadGameAndImport(page);
  const body = await page.locator('body').innerText();
  const hits = [...new Set(body.match(/[一-鿿][^\n]*/g) || [])];
  expect(hits, `Chinese text found: ${hits.slice(0, 10).join(' ; ')}`).toHaveLength(0);
});

test('Export button produces a download after importing legacy save', async ({ page }) => {
  const errors = collectErrors(page);
  await loadGameAndImport(page);

  const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
  await page.click('#save_to_file_button');
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^neko-rpg .*\.txt$/);

  // the export must contain a decodable save with the character's inventory intact
  const path = await download.path();
  const save = decodeSave(readFileSync(path, 'utf8').trim());
  expect(save.character.inventory['{"id":"荒兽凭证"}']).toBeTruthy();
  expect(errors, `errors: ${errors.join('\n')}`).toHaveLength(0);
});

test('save-reward buff renders an English effect tooltip (no crash)', async ({ page }) => {
  const errors = collectErrors(page);
  await loadGameAndImport(page);

  // exporting grants the Inspiration buff via GetSaveRewards()
  const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
  await page.click('#save_to_file_button');
  await downloadPromise;

  await expect(page.locator('#active_effect_count')).not.toHaveText(/^\s*0\s*$/);
  const tooltip = await page.locator('#effects_tooltip').innerText();
  expect(tooltip).toContain('Inspiration');
  expect(CJK.test(tooltip), `tooltip has Chinese: ${tooltip}`).toBe(false);
  expect(errors, `errors: ${errors.join('\n')}`).toHaveLength(0);
});

test('exported save re-imports cleanly (round trip)', async ({ page }) => {
  const errors = collectErrors(page);
  await loadGameAndImport(page);

  const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
  await page.click('#save_to_file_button');
  const download = await downloadPromise;
  const exported = readFileSync(await download.path(), 'utf8').trim();

  await page.setInputFiles('#saved_file_input', {
    name: 'reimport.txt', mimeType: 'text/plain', buffer: Buffer.from(exported),
  });
  await page.waitForTimeout(1500);
  await expect(page.locator('#main_content')).toBeVisible();
  const info = await page.locator('#basic_character_info_div').innerText();
  expect(info).not.toContain('Dust Rank: Novice');
  expect(errors, `errors: ${errors.join('\n')}`).toHaveLength(0);
});

test('beast voucher exchange consumes vouchers and grants Mithril Ingots', async ({ page }) => {
  const errors = collectErrors(page);
  await loadGameAndImport(page);

  const before = decodeSave(readFileSync(FIXTURE, 'utf8').trim());
  const vouchersBefore = before.character.inventory['{"id":"荒兽凭证"}'].count;
  const ingotsBefore = before.character.inventory['{"id":"秘银锭"}']?.count ?? 0;
  const expectedTrades = Math.floor(vouchersBefore / 30);

  // drive the Barrier Lake Converter dialogue exactly as the UI buttons do
  await page.evaluate(() => {
    window.start_dialogue('结界湖转化器');
    window.start_textline('pz-my');
  });
  await page.waitForTimeout(500);

  const exported = await page.evaluate(() => window.save_to_file());
  const after = decodeSave(exported);
  const vouchersAfter = after.character.inventory['{"id":"荒兽凭证"}']?.count ?? 0;
  const ingotsAfter = after.character.inventory['{"id":"秘银锭"}']?.count ?? 0;

  // the character keeps earning vouchers in the background after import, so
  // assert bounds rather than exact counts: ~19.1M vouchers must have been
  // consumed and at least the fixture-derived number of ingots granted
  expect(vouchersAfter).toBeLessThan(5000);
  expect(ingotsAfter - ingotsBefore).toBeGreaterThanOrEqual(expectedTrades);
  expect(errors, `errors: ${errors.join('\n')}`).toHaveLength(0);
});

test('equipped Arcane Method grants skill XP from kills after import', async ({ page }) => {
  const errors = collectErrors(page);
  await loadGameAndImport(page);

  const before = decodeSave(readFileSync(FIXTURE, 'utf8').trim());
  const xpBefore = before.skills.StarDestruction.total_xp; // save has Star-Dissolution Technique equipped

  // the save resumes combat in Hel Swamp - 4; let some kills happen
  await page.waitForTimeout(8000);

  const after = decodeSave(await page.evaluate(() => window.save_to_file()));
  expect(after.character.equipment.method.name).toBe('星解之术'); // saved as upstream key
  expect(after.skills.StarDestruction.total_xp).toBeGreaterThan(xpBefore);
  expect(errors, `errors: ${errors.join('\n')}`).toHaveLength(0);
});
