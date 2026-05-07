import { writeFileSync } from "node:fs";
import { harness, replay } from "@f0rbit/forge";
import { presets } from "@f0rbit/forge/presets";
import { game_plugin } from "../src/plugin.ts";
import { score_r } from "../src/resources.ts";

const seed = 1;
const fixed_dt = 1 / 60;
const max_ticks = 600;

const h = harness({ seed, fixed_dt, bindings: presets.movement_2d });
const recorder = replay.record(h.input, h.ctx, { seed });

game_plugin(h.world, h.schedule);

h.input.inject_actions([{ kind: "axis", action: "move.x", value: 1 }]);

let win_tick = -1;
for (let i = 0; i < max_ticks; i++) {
	h.time.advance(fixed_dt);
	h.schedule.tick(h.world, h.ctx);
	const s = h.res.get(score_r);
	if (s.ok && s.value.value >= 50) {
		win_tick = h.time.tick;
		break;
	}
}

if (win_tick === -1) {
	console.error("did not reach win condition within", max_ticks, "ticks");
	process.exit(1);
}

h.input.inject_actions([{ kind: "axis", action: "move.x", value: 0 }]);
h.time.advance(fixed_dt);
h.schedule.tick(h.world, h.ctx);

const doc = recorder.stop();
const json = replay.save(doc);

const out_path = new URL("../replays/win.replay.json", import.meta.url).pathname;
writeFileSync(out_path, json + "\n");

console.log(`recorded ${doc.frames.length} frames over ${win_tick} ticks -> ${out_path}`);
