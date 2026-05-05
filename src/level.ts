import type { System } from "@f0rbit/forge";
import { pos_c } from "@f0rbit/forge";
import { coin_c, player_c, vel_c } from "./components.ts";
import { score_r } from "./resources.ts";

export const player_start = { x: 320, y: 240 } as const;
export const coin_xs = [400, 460, 520, 580, 620] as const;
export const coin_y = 240 as const;

export const setup: System = (w, ctx) => {
	if (!ctx.res.has(score_r)) ctx.res.set(score_r, { value: 0 });

	w.spawn(
		[pos_c, { x: player_start.x, y: player_start.y }],
		[vel_c, { dx: 0, dy: 0 }],
		[player_c, true],
	);

	for (const x of coin_xs) {
		w.spawn([pos_c, { x, y: coin_y }], [coin_c, true]);
	}
};
