import type { System } from "@f0rbit/forge";
import { pos_c } from "@f0rbit/forge";
import { coin_c, player_c } from "../components.ts";
import { score_r } from "../resources.ts";

const pickup_radius = 32;
const radius_sq = pickup_radius * pickup_radius;

export const collection_system: System = (w, ctx) => {
	const players = w.query([pos_c, player_c] as const).collect();
	if (players.length === 0) return;
	const score = ctx.res.get(score_r);
	if (!score.ok) return;

	for (const [, pp] of players) {
		for (const [cid, cp] of w.query([pos_c, coin_c] as const).collect()) {
			const dx = pp.x - cp.x;
			const dy = pp.y - cp.y;
			if (dx * dx + dy * dy <= radius_sq) {
				w.despawn(cid);
				score.value.value += 10;
			}
		}
	}
};
