import { describe, expect, test } from "bun:test";
import { debug_noop, input, palette_noop, pos_c, rng, resources, schedule, time, world } from "@f0rbit/forge";
import type { Ctx } from "@f0rbit/forge";
import { presets } from "@f0rbit/forge/presets";
import { player_c } from "../src/components.ts";
import { game_plugin } from "../src/plugin.ts";
import { score_r } from "../src/resources.ts";

const make_ctx = (): { ctx: Ctx; w: ReturnType<typeof world>; sch: ReturnType<typeof schedule> } => {
	const w = world();
	const sch = schedule();
	const t = time();
	const r = rng(1);
	const res = resources();
	const inp = input(presets.movement2d);
	const ctx: Ctx = {
		time: t,
		rng: r,
		res,
		input: inp,
		debug: debug_noop(),
		palette: palette_noop(),
	};
	return { ctx, w, sch };
};

describe("game_plugin", () => {
	test("player input drives movement and collects coins", () => {
		const { ctx, w, sch } = make_ctx();
		game_plugin(w, sch);

		ctx.input.inject_actions([{ kind: "axis", action: "move.x", value: 1 }]);

		for (let i = 0; i < 60; i++) {
			ctx.time.advance(1 / 60);
			sch.tick(w, ctx);
		}

		const player_pos = w.query([pos_c, player_c] as const).collect();
		expect(player_pos.length).toBe(1);
		expect(player_pos[0]![1].x).toBeGreaterThan(320);

		const score = ctx.res.get(score_r);
		expect(score.ok).toBe(true);
		if (score.ok) expect(score.value.value).toBeGreaterThanOrEqual(10);
	});
});
