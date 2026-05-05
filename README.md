# coin-collector

First game built on `@f0rbit/forge`. A player moves around a 640x480 stage and collects 5 coins. Used as the API pressure-test for forge v0.1.0.

## Setup

forge is consumed via `bun link` during dev — it isn't published yet.

```sh
# one-time, in the forge repo
cd ~/dev/forge
bun run build      # exports point at dist/, must be built
bun link

# in this repo
cd ~/dev/coin-collector
bun link @f0rbit/forge
bun install
```

Whenever forge source changes, re-run `bun run build` in the forge repo so the linked `dist/` is up to date.

## Scripts

| Script | What |
|---|---|
| `bun run dev` | Bundles `src/main.ts` -> `dist/main.js` in watch mode (open `index.html` separately) |
| `bun run build` | Production bundle |
| `bun test` | Headless plugin + replay tests |
| `bun run typecheck` | tsc --noEmit |
| `bun run record:win` | Re-record `replays/win.replay.json` |

## Layout

- `src/components.ts` — `vel_c`, `player_c`, `coin_c`
- `src/resources.ts` — `score_r`
- `src/level.ts` — startup spawn (player at 320,240; 5 coins along x = 400..620)
- `src/systems/` — input, movement, collection
- `src/plugin.ts` — `game_plugin(world, schedule)` registers everything
- `src/main.ts` — browser entry, calls `boot()` and starts the loop
- `test/` — plugin smoke + replay deliverable
- `tools/record-win.ts` — regenerates the replay fixture
- `replays/win.replay.json` — recorded action stream that collects all 5 coins
