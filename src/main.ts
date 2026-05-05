import { boot, sprite_c } from "@f0rbit/forge/pixi";
import { presets } from "@f0rbit/forge/presets";
import { pos_c } from "@f0rbit/forge";
import { coin_c, player_c } from "./components.ts";
import { game_plugin } from "./plugin.ts";

const main = async (): Promise<void> => {
	const r = await boot({
		mount: "#root",
		width: 640,
		height: 480,
		background: 0x101018,
		bindings: presets.movement2d,
	});
	if (!r.ok) {
		console.error("boot failed", r.error);
		return;
	}
	const { world, schedule, start } = r.value;

	game_plugin(world, schedule);

	schedule.add("post", w => {
		for (const [id] of w.query([pos_c, player_c] as const)) {
			if (!w.has(id, sprite_c)) {
				w.set(id, sprite_c, { texture: "__default__", frame: "__default_0__", anchor: { x: 0.5, y: 0.5 } });
			}
		}
		for (const [id] of w.query([pos_c, coin_c] as const)) {
			if (!w.has(id, sprite_c)) {
				w.set(id, sprite_c, { texture: "__default__", frame: "__default_1__", anchor: { x: 0.5, y: 0.5 } });
			}
		}
	}, "coin.sprites");

	start();
};

main();
