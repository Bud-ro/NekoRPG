import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'legacy-english-save.txt');
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

// each entry: [test name, function that opens the menu, locator for its content, text expected in an imported late-game save]
const MENUS = [
  ['Realm (quests) tab',     p => p.click('#journal_show_quests'),            '#journal_div', 'Gem Devourer'],
  ['Bestiary tab',           p => p.click('#journal_show_bestiary'),          '#journal_div', 'Zone'],
  ['Zone Guide tab',         p => p.click('#journal_show_levelary'),          '#journal_div', 'Zone'],
  ['Stats/Bank tab',         p => p.evaluate(() => window.showData()),        '#journal_div', null],
  ['Skills panel',           p => p.evaluate(() => window.showSkills()),      '#skills_and_stances_div', null],
  ['Stances panel',          p => p.evaluate(() => window.showStances()),     '#skills_and_stances_div', null],
  ['Family panel',           p => p.evaluate(() => window.showFamily()),      '#family_div', null],
  ['Character stats tab',    p => p.evaluate(() => window.showCharacterStats()), '#character_stats_div', null],
  ['Character equipment tab',p => p.evaluate(() => window.showCharacterEquipment()), 'body', 'Ice Marrow'],
  ['Character tools tab',    p => p.evaluate(() => window.showCharacterTools()), 'body', null],
  ['Inventory panel',        p => p.evaluate(() => window.switchToInventory()), '#inventory_div', null],
  ['Combat panel switch',    p => p.evaluate(() => window.switchToCombat()),  'body', null],
];

for (const [name, open, contentSel, expectedText] of MENUS) {
  test(`${name} works after importing legacy save`, async ({ page }) => {
    const errors = collectErrors(page);
    await loadGameAndImport(page);

    await open(page);
    await page.waitForTimeout(300);

    const text = await page.locator(contentSel).innerText();
    expect(text.trim().length, `${contentSel} is empty`).toBeGreaterThan(0);
    if (expectedText) expect(text).toContain(expectedText);
    const hits = [...new Set(text.match(/[一-鿿][^\n]*/g) || [])];
    expect(hits, `Chinese in ${name}: ${hits.slice(0, 5).join(' ; ')}`).toHaveLength(0);
    expect(errors, `errors in ${name}: ${errors.join('\n')}`).toHaveLength(0);
  });
}

test('family panel table headers are English after import', async ({ page }) => {
  const errors = collectErrors(page);
  await loadGameAndImport(page);
  await page.evaluate(() => window.showFamily());
  await page.waitForTimeout(300);
  const family = await page.locator('#family_div').innerText();
  // only assert headers when the family system is unlocked for this save
  if (/Realm/.test(family)) {
    expect(family).toContain('Training Strategy');
    expect(family).toContain('Breakthroughs');
  }
  expect(CJK.test(family), `family panel has Chinese: ${family.slice(0, 200)}`).toBe(false);
  expect(errors, `errors: ${errors.join('\n')}`).toHaveLength(0);
});

test('all menus still work after manual save and page refresh', async ({ page }) => {
  const errors = collectErrors(page);
  await loadGameAndImport(page);

  // persist to localStorage the way the Save button does, then reload
  await page.evaluate(() => window.saveProgress());
  await page.reload();
  await expect(page.locator('#loading_screen')).toBeHidden({ timeout: 10000 });
  await page.waitForTimeout(1000);

  // the reloaded state must be the imported character, not a fresh game
  const info = await page.locator('#basic_character_info_div').innerText();
  expect(info).not.toContain('Dust Rank: Novice');

  for (const [name, open, contentSel] of MENUS) {
    await open(page);
    await page.waitForTimeout(200);
    const text = await page.locator(contentSel).innerText();
    expect(text.trim().length, `${name}: ${contentSel} empty after refresh`).toBeGreaterThan(0);
    const hits = [...new Set(text.match(/[一-鿿][^\n]*/g) || [])];
    expect(hits, `Chinese in ${name} after refresh: ${hits.slice(0, 5).join(' ; ')}`).toHaveLength(0);
  }
  expect(errors, `errors: ${errors.join('\n')}`).toHaveLength(0);
});

test('Realm tab renders quest content after refresh (regression)', async ({ page }) => {
  const errors = collectErrors(page);
  await loadGameAndImport(page);
  await page.evaluate(() => window.saveProgress());
  await page.reload();
  await expect(page.locator('#loading_screen')).toBeHidden({ timeout: 10000 });
  await page.waitForTimeout(1000);

  await page.click('#journal_show_quests');
  await page.waitForTimeout(300);
  const journal = await page.locator('#journal_div').innerText();
  expect(journal).toContain('Gem Devourer');
  expect(errors, `errors: ${errors.join('\n')}`).toHaveLength(0);
});

test('family newborn input is initialized (not undefined) after legacy import', async ({ page }) => {
  const errors = collectErrors(page);
  await loadGameAndImport(page);

  // the legacy save predates the family system entirely
  const babyValue = await page.locator('#baby_born_num').inputValue();
  expect(babyValue).not.toBe('undefined');
  expect(Number(babyValue)).toBe(0);

  const family = await page.evaluate(async () => {
    const m = await import('./src/main.js');
    return { hasMem: Array.isArray(m.family_data?.mem), mem0: m.family_data?.mem?.[0] ?? null };
  }).catch(() => null);
  if (family) {
    expect(family.hasMem).toBe(true);
    expect(family.mem0).not.toBeNull();
  }
  expect(errors, `errors: ${errors.join('\n')}`).toHaveLength(0);
});

test('bestiary enemy hover shows a tooltip with stats', async ({ page }) => {
  const errors = collectErrors(page);
  await loadGameAndImport(page);
  await page.click('#journal_show_bestiary');
  await page.waitForTimeout(400);

  // hover the first real enemy row (zone header rows are wrapped in <b> and skipped)
  const idx = await page.evaluate(() =>
    [...document.querySelectorAll('#bestiary_box_div .bestiary_entry_div')]
      .findIndex(d => d.children[0] && !d.children[0].innerHTML.includes('<b>')));
  expect(idx).toBeGreaterThanOrEqual(0);
  await page.mouse.move(5, 5);
  await page.locator('#bestiary_box_div .bestiary_entry_div').nth(idx).hover();
  await page.waitForTimeout(400);

  const tip = await page.locator('#bestiary_box_div .bestiary_entry_tooltip').first().innerText();
  expect(tip).toContain('Stats:');
  expect(CJK.test(tip), `tooltip has Chinese: ${tip.slice(0, 150)}`).toBe(false);
  expect(errors, `errors: ${errors.join('\n')}`).toHaveLength(0);
});

test('zone guide hover shows a tooltip with the zone description', async ({ page }) => {
  const errors = collectErrors(page);
  await loadGameAndImport(page);
  await page.click('#journal_show_levelary');
  await page.waitForTimeout(400);

  await page.mouse.move(5, 5);
  await page.locator('#levelary_box_div .bestiary_entry_div').first().hover();
  await page.waitForTimeout(400);

  const tip = await page.locator('#levelary_box_div .bestiary_entry_tooltip').first().innerText();
  expect(tip.trim().length).toBeGreaterThan(0);
  expect(CJK.test(tip), `tooltip has Chinese: ${tip.slice(0, 150)}`).toBe(false);
  expect(errors, `errors: ${errors.join('\n')}`).toHaveLength(0);
});
