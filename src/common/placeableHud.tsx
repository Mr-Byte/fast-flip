import HudButtonGroup, {
	type ButtonProps,
} from "@/common/_components/hudButtonGroup";

import hud = foundry.applications.hud;
import Hooks = foundry.helpers.Hooks;

export interface ButtonGroupProps<T> {
	side: "left" | "right";
	buttons: ButtonProps<T>[];
}

interface HudRegistry {
	TokenHUD: foundry.canvas.placeables.Token;
	TileHUD: foundry.canvas.placeables.Tile;
}

type HudName = keyof HudRegistry;
type HudObject<T extends HudName> = HudRegistry[T];

export function setupPlaceableHUD<T extends HudName>(
	name: T,
	buttonGroups: ButtonGroupProps<HudObject<T>>[],
) {
	Hooks.on(
		`render${name}`,
		(hud: hud.BasePlaceableHUD.Any, html: HTMLElement) => {
			const object = hud.object as HudObject<T> | undefined;

			if (!object) {
				return;
			}

			for (const groupProps of buttonGroups) {
				const visibleButtons = groupProps.buttons.filter(
					(button) => button.shouldShow?.(object) ?? true,
				);

				if (visibleButtons.length === 0) {
					continue;
				}

				html.querySelector(`div.${groupProps.side}`)?.append(
					HudButtonGroup<HudObject<T>>({
						buttons: visibleButtons,
						object,
					}),
				);
			}
		},
	);
}
