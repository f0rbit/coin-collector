import { describe, expect, test } from "bun:test";
import { harness, pos_c } from "@f0rbit/forge";
import { presets } from "@f0rbit/forge/presets";
import { player_c } from "../src/components.ts";
import { game_plugin } from "../src/plugin.ts";
import { score_r } from "../src/resources.ts";

describe("game_plugin", () => {
	test("player input drives movement and collects coins", () => {
		const h = harness({ bindings: presets.movement2d });
		game_plugin(h.world, h.schedule);

		h.input.inject_actions([{ kind: "axis", action: "move.x", value: 1 }]);

		for (let i = 0; i < 60; i++) {
			h.time.advance(1 / 60);
			h.schedule.tick(h.world, h.ctx);
		}

		const player_pos = h.world.query([pos_c, player_c] as const).collect();
		expect(player_pos.length).toBe(1);
		expect(player_pos[0]![1].x).toBeGreaterThan(40);

		const score = h.res.get(score_r);
		expect(score.ok).toBe(true);
		if (score.ok) expect(score.value.value).toBeGreaterThanOrEqual(10);
	});
});
