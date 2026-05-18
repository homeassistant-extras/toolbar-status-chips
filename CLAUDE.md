# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Cross-agent instructions (including the rule for diagnosing `yarn test` failures) live in [AGENTS.md](./AGENTS.md). Read that first, plus any nearer `AGENTS.md` in the subdirectory you're editing.

## Package Manager

This is a **Yarn project**. Use `yarn`, not `npm`.

## Development Commands

- `yarn build` — Parcel production build (entry `src/index.ts` → `dist/toolbar-status-chips.js`, single-file bundle including node_modules)
- `yarn watch` — Parcel watch mode
- `yarn test` — Mocha + ts-node + tsconfig-paths, all `test/**/*.spec.ts`
- `yarn test:coverage` — Tests with NYC/Istanbul coverage
- `yarn test:watch` — Mocha watch mode
- `yarn format` — Prettier (with `@trivago/prettier-plugin-sort-imports` and `prettier-plugin-organize-imports`)
- `yarn update` — `npm-check-updates -u` then reinstall

### Running a single test file

```bash
TS_NODE_PROJECT='./tsconfig.test.json' npx mocha test/path/to/specific.spec.ts
```

### Diagnosing `ERR_MODULE_NOT_FOUND` in tests

If `yarn test` fails with `Cannot find package '@/...' ... ERR_MODULE_NOT_FOUND`, this is almost never a module-resolution problem — path aliases are wired through `tsconfig.json` + `tsconfig-paths/register` (see [.mocharc.json](.mocharc.json)). The real cause is usually a TypeScript error in the imported file or a transitive import that ts-node surfaces as a misleading resolution error. Run:

```bash
npx tsc -p tsconfig.test.json --noEmit
```

Fix the type errors it reports before investigating path aliases or test config.

## Architecture

This is a **Home Assistant custom Lovelace card** built with **Lit 3** that renders a horizontal stack of status "chips" pinned to the dashboard toolbar. The card is intentionally small — its source lives mostly at the top of `src/`, not in deep subfolders.

### Entry and component registration

[src/index.ts](src/index.ts) registers two custom elements (`toolbar-status-chips`, `toolbar-status-chips-editor`) and pushes a card descriptor onto `window.customCards` so Home Assistant's dashboard UI lists the card.

### The main card flow ([src/card.ts](src/card.ts))

1. **Config in** — `setConfig(config)` is called by HA with the YAML/editor config; the card no-ops if config is deep-equal to the previous one (`fast-deep-equal`).
2. **State in** — HA calls the `hass` setter on every state change. The setter performs the entity-filtering pipeline:
   - Start with all entities whose `labels` include `solo_label` (or `'status'` by default).
   - If `solo_label` is unset, narrow further: by `additional_label`, or by area (matched against `config.area ?? URL slug`) unless the user is on the `status_path` (default `'home'`), in which case all areas are rolled up. Area matching considers both `entity.area_id` and the entity's device's `area_id`.
   - Hand the filtered list to `entitiesThatShouldBeChips` ([src/helpers.ts](src/helpers.ts)) which applies `on_state` / numeric-threshold logic and the `optional` flag.
3. **Render out** — A `@lit/task` (`_createChipsTask`) calls `loadCardHelpers()` to get HA's card helpers, maps each `ChipEntity` through `createChipConfig` ([src/config.ts](src/config.ts)) into a `custom:button-card` config, wraps them in a `horizontal-stack`, and assigns `.hass` so the stack renders. `addMarginForChips()` adjusts toolbar margin for mobile.

The card depends on the **button-card** custom component at runtime (it generates `custom:button-card` configs rather than rendering chips itself).

### Configuration precedence and "opinions" worth knowing

- `solo_label` overrides everything (ignores the `status` label requirement and area filtering).
- `additional_label` requires entities to have *both* `status` and the additional label.
- `area` overrides the URL slug; the URL slug is derived as the last path segment of `document.URL` with `-` → `_`.
- `status_path` (default `'home'`) is the route that rolls up chips from all areas and implicitly enables the `optional` feature (hide inactive chips).
- Per-entity customization (`on_state`, `on_color`, `navigation_path`, `numeric_state_pass_threshold`, `numeric_state_warning_threshold`, `exclude_on_status_path`) is read from HA entity *attributes*, set either via templates or HA `customize:`.

### Editor

[src/editor.ts](src/editor.ts) implements `toolbar-status-chips-editor` using HA's `ha-form` schema (types in [src/types/ha-form.ts](src/types/ha-form.ts)).

### TypeScript path aliases ([tsconfig.json](tsconfig.json))

- `@/*` → `./src/*`
- `@type/*` → `./src/types/*`
- `@common/*` → `./src/common/*`
- `@test/*` → `./src/tests/*`

`verbatimModuleSyntax`, `strict`, `noUncheckedIndexedAccess`, and `experimentalDecorators` are all on. Use `import type` for type-only imports.

### Testing setup

- Mocha + Chai + Sinon, JSDOM via [mocha.setup.ts](mocha.setup.ts).
- `tsconfig.test.json` is the active project for tests (`TS_NODE_PROJECT` env var); aliases resolve through `tsconfig-paths/register`.
- Spec files live at `test/*.spec.ts` mirroring `src/*.ts`.

### Build

Parcel 2.x, `source: src/index.ts`, `module: dist/toolbar-status-chips.js`, `includeNodeModules: true` — output is a single self-contained file consumed by HA as a Lovelace resource. `package.json` is imported directly by `src/card.ts` to log the running version.
