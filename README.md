# coin-collector

A tiny game built on [`@f0rbit/forge`](https://www.npmjs.com/package/@f0rbit/forge). Move the player around a 640x480 stage and collect 5 coins. Doubles as the API pressure-test for forge v0.1.0.

**Play it live:** https://f0rbit.github.io/coin-collector/

## Setup

```sh
bun install
```

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
