import { boot, sprite_c } from "@f0rbit/forge/pixi";
import { presets } from "@f0rbit/forge/presets";
import { pos_c } from "@f0rbit/forge";
import { coin_c, player_c } from "./components.ts";
import { game_plugin } from "./plugin.ts";

const main = async (): Promise<void> => {
	const r = await boot({
		mount: "#root",
		window: { width: globalThis.innerWidth, height: globalThis.innerHeight },
		camera: {
			design: { width: 320, height: 180 },
			mode: "extend",
			min: { width: 320, height: 180 },
		},
		bindings: presets.movement2d,
	});
	if (!r.ok) {
		console.error("boot failed", r.error);
		return;
	}
	const app = r.value;

	game_plugin(app.world, app.schedule);

	app.schedule.add("post", w => {
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

	globalThis.addEventListener("resize", () => {
		app.render.resize(globalThis.innerWidth, globalThis.innerHeight);
	});

	app.start();
};

main();
