import { component, type Component } from "@f0rbit/forge";

export const vel_c: Component<{ dx: number; dy: number }> = component<{ dx: number; dy: number }>("vel");
export const player_c: Component<true> = component<true>("player");
export const coin_c: Component<true> = component<true>("coin");
