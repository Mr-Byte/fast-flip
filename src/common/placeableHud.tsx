import HudButtonGroup, { type ButtonProps } from "@/common/_components/hudButtonGroup";

import PlaceableObject = foundry.canvas.placeables.PlaceableObject;
import hud = foundry.applications.hud;
import Hooks = foundry.helpers.Hooks;

export interface ButtonGroupProps<T extends PlaceableObject> {
    side: "left" | "right";
    buttons: ButtonProps<T>[];
}

interface HudRegistry {
    TokenHUD: hud.TokenHUD.Any;
    TileHUD: hud.TileHUD.Any;
}

type HudName = keyof HudRegistry;
type HudObject<T extends HudName> = HudRegistry[T]["object"];

export function setupPlaceableHUD<T extends HudName>(name: T, buttonGroups: ButtonGroupProps<HudObject<T>>[]) {
    Hooks.on(`render${name}`, (hud: hud.BasePlaceableHUD<HudObject<T>>, html: HTMLElement) => {
        for (const groupProps of buttonGroups) {
            const shouldShow = groupProps.buttons.some((button) => button.shouldShow?.(hud.object) ?? true);

            if (!shouldShow) {
                continue;
            }

            html.querySelector(`div.${groupProps.side}`)?.append(
                <HudButtonGroup buttons={groupProps.buttons} object={hud.object} />,
            );
        }
    });
}
