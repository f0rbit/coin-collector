import type { Schedule, World } from "@f0rbit/forge";
import { setup } from "./level.ts";
import { collection_system } from "./systems/collection.ts";
import { movement_system, player_input_system } from "./systems/movement.ts";

export const game_plugin = (_w: World, sch: Schedule): void => {
	sch.add("startup", setup, "coin.setup");
	sch.add("update", player_input_system, "coin.input");
	sch.add("update", movement_system, "coin.movement");
	sch.add("update", collection_system, "coin.collect");
};
