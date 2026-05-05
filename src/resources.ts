import { resource, type ResKey } from "@f0rbit/forge";

export type Score = { value: number };

export const score_r: ResKey<Score> = resource<Score>("coin.score");
