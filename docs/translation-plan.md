# Translation Progress

See also: [Glossary](translation-glossary.md)

## Files

| # | File | Est. Strings | Status |
|---|------|-------------|--------|
| 1 | `main.js` (root) | ~293 | ✅ Done |
| 2 | `index.html` | ~104 | ✅ Done |
| 3 | `src/items.js` | ~562 | ✅ Done |
| 4 | `src/enemies.js` | ~788 | ✅ Done |
| 5 | `src/locations.js` | ~764 | ✅ Done |
| 6 | `src/dialogues.js` | ~265 | ✅ Done |
| 7 | `src/crafting_recipes.js` | ~292 | ✅ Done |
| 8 | `src/display.js` | ~284 | ✅ Done |
| 9 | `src/skills.js` | ~135 | ✅ Done |
| 10 | `src/traders.js` | ~121 | ✅ Done |
| 11 | `src/active_effects.js` | ~48 | ✅ Done |
| 12 | `src/combat_stances.js` | ~20 | ✅ Done |
| 13 | `src/character.js` | ~18 | ✅ Done |
| 14 | `src/misc.js` | ~10 | ✅ Done |
| 15 | `src/activities.js` | ~8 | ✅ Done |
| 16 | `src/trade.js` | ~1 | ✅ Done |
| 17 | `src/game_time.js` | ~3 | ✅ Done |

## Translation Rules

1. Always check the glossary before translating a term
2. Translate display strings only — not internal code keys/identifiers
3. Preserve all JS syntax exactly (no added/removed brackets, commas, etc.)
4. Item/enemy names used as lookup keys stay in Chinese — only the `name:` display field is translated
5. Run `npm test` after each file commit

## Remaining Chinese (Intentional)

The following Chinese remains in the codebase by design — these are **internal cross-reference keys**, not user-visible text:

- `item_templates["铁锭"]` style dict keys in `items.js`, `crafting_recipes.js`, `traders.js`, `locations.js`, `main.js`
- `enemy_templates["纳家待从"]` style keys in `enemies.js`, `locations.js`, `main.js`
- `locations["荒兽森林-1"]` style keys in `locations.js`, `display.js`, `main.js`
- `dialogues["猫妖"]` and textline choice keys in `dialogues.js`
- Switch-case realm-parsing characters in `main.js` (e.g. `case "微":`)
- Inventory JSON key strings (e.g. `{"id":"纳娜米"}`) in `main.js`
- Developer comments throughout all files

---

## V3.43c rebase (2026-09)

The `english` branch (translation of upstream V2.22c) was merged with upstream `btly0711/NekoRPG` at V3.43c (`02cc026`). Method:

1. `git merge` upstream into `english` (base V2.22c). 126 conflict hunks, all resolved to upstream so game logic is current.
2. A CN→EN dictionary was built from the V2.22c ↔ `english` diff (line pairs + string pairs) and re-applied to the merged tree, so every existing translation choice was carried forward verbatim. The applier is **key-aware**: it only substitutes display strings, never dict keys, `item_name`/`material_id`/`result_id`, `{"id":…}` JSON keys, `case` labels, or numeric-keyed lookup maps.
3. New V3 content (~1,750 strings across enemies, items, locations, dialogues, main, display, skills, effects, stances, crafting, index.html, help.html) translated by hand against the glossary.
4. Realm labels (`<span class=realm_*><b>云霄级四阶 +</b></span>`) are handled by pattern: Rank + `: Stage N` / `: Pinnacle` etc.

### Code changes beyond strings

- `get_enemy_realm()` rewritten to parse the English realm label (`Dust/Myriad/Tidal/Earth/Sky/Nimbus/Domain/World`, `Stage N`, `Pinnacle`, `Breakthrough`, `Novice/Adept/Expert`).
- `resolve_enemy_template()` in display.js: bestiary lookups accept a template key **or** an English display name. `enemy_killcount` is keyed by display name (as on the V2.22c site), so old saves load unchanged.
- Bed / quick-return logic uses `resolve_location_ref()` (key or name). Every `locations[key]` gets `.id = key` at module end; enemies already did.
- `ZoneNameMap` in display.js translated; `ZoneTpMap` (location keys) intentionally left Chinese.
- `烈日祝福·<trigram>` effect keys stay Chinese (built dynamically in main.js); only their `name:` is English.

### Verification

- `node --check` on every `src/*.js`.
- Cross-reference check: every referenced key in `item_templates`, `enemy_templates`, `locations`, `dialogues`, `traders`, `effect_templates`, `skills`, `stances` resolves to a definition (0 dangling).
- Headless (Playwright): fresh game, and a real V2.22c-era save imported as-is — 0 page errors, 0 Chinese on screen across Skills/Stances/Family/Realm/Bestiary/Zone Guide/Stats/crafting/tooltips/combat; export → re-import round trip clean; help.html renders with 0 errors.

### Remaining Chinese (intentional)

Same as the list above, plus: `changelog.html` / `changelog_old.html` (upstream changelog, not translated), `Plan.txt`, developer comments, and the `ZoneTpMap` / `烈日祝福·` key strings noted above.
