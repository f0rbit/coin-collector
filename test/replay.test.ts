import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { harness, replay } from "@f0rbit/forge";
import type { Ctx, ReplayDoc, World } from "@f0rbit/forge";
import { presets } from "@f0rbit/forge/presets";
import { coin_c, player_c } from "../src/components.ts";
import { game_plugin } from "../src/plugin.ts";
import { score_r } from "../src/resources.ts";

const replay_path = new URL("../replays/win.replay.json", import.meta.url).pathname;
const replay_json = readFileSync(replay_path, "utf8");

type Sim = { ctx: Ctx; w: World; tick: () => void };

const make_sim = (doc: ReplayDoc): Sim => {
	const h = harness({ seed: doc.seed, fixed_dt: doc.fixed_dt, bindings: presets.movement2d });
	game_plugin(h.world, h.schedule);
	replay.play(doc, h.input, () => h.time.tick);
	return {
		ctx: h.ctx,
		w: h.world,
		tick: () => {
			h.time.advance(doc.fixed_dt);
			h.schedule.tick(h.world, h.ctx);
		},
	};
};

const hash_world = (w: World, score: number): string => {
	const players = w.query([player_c] as const).collect().length;
	const coins = w.query([coin_c] as const).collect().length;
	return `p=${players}|c=${coins}|s=${score}`;
};

const tick_count = 200;

describe("replay deliverable", () => {
	test("loaded replay JSON parses cleanly", () => {
		const r = replay.load(replay_json);
		expect(r.ok).toBe(true);
	});

	test("replaying win.replay.json collects all 5 coins (score = 50)", () => {
		const r = replay.load(replay_json);
		expect(r.ok).toBe(true);
		if (!r.ok) return;
		const sim = make_sim(r.value);
		for (let i = 0; i < tick_count; i++) sim.tick();
		const score = sim.ctx.res.get(score_r);
		expect(score.ok).toBe(true);
		if (score.ok) expect(score.value.value).toBe(50);
	});

	test("replay is deterministic — two runs produce identical world state", () => {
		const r1 = replay.load(replay_json);
		const r2 = replay.load(replay_json);
		expect(r1.ok).toBe(true);
		expect(r2.ok).toBe(true);
		if (!r1.ok || !r2.ok) return;

		const sim_a = make_sim(r1.value);
		const sim_b = make_sim(r2.value);
		for (let i = 0; i < tick_count; i++) {
			sim_a.tick();
			sim_b.tick();
		}
		const sa = sim_a.ctx.res.get(score_r);
		const sb = sim_b.ctx.res.get(score_r);
		const va = sa.ok ? sa.value.value : -1;
		const vb = sb.ok ? sb.value.value : -1;
		expect(hash_world(sim_a.w, va)).toBe(hash_world(sim_b.w, vb));
	});
});
