import type { System } from "@f0rbit/forge";
import { pos_c } from "@f0rbit/forge";
import { player_c, vel_c } from "../components.ts";

const speed = 240;

export const player_input_system: System = (w, ctx) => {
	const [ax, ay] = ctx.input.vector("move.x", "move.y");
	for (const [id] of w.query([player_c, vel_c] as const)) {
		w.set(id, vel_c, { dx: ax * speed, dy: ay * speed });
	}
};

export const movement_system: System = (w, ctx) => {
	const dt = ctx.time.fixed_dt;
	for (const [, p, v] of w.query([pos_c, vel_c] as const)) {
		p.x += v.dx * dt;
		p.y += v.dy * dt;
	}
};
