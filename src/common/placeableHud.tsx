import HudButtonGroup, { type ButtonProps } from "@common/_components/hudButtonGroup";

type PlaceableObject = foundry.canvas.placeables.PlaceableObject;

export interface ButtonGroupProps<T extends PlaceableObject> {
    side: "left" | "right";
    buttons: ButtonProps<T>[];
}

interface HudRegistry {
    TokenHUD: [foundry.applications.hud.TokenHUD.Any];
    TileHUD: [foundry.applications.hud.TileHUD.Any];
}

type HudName = keyof HudRegistry & {};
type HudObject<T extends HudName> = HudRegistry[T][0]["object"];

export function setupPlaceableHUD<T extends HudName>(name: T, buttonGroups: ButtonGroupProps<HudObject<T>>[]) {
    foundry.helpers.Hooks.on(
        `render${name}`,
        (hud: foundry.applications.hud.BasePlaceableHUD<HudObject<T>>, html: HTMLElement) => {
            for (const groupProps of buttonGroups) {
                const shouldShow = groupProps.buttons.some((button) => button.shouldShow?.(hud.object) ?? true);

                if (!shouldShow) {
                    continue;
                }

                html.querySelector(`div.${groupProps.side}`)?.append(
                    <HudButtonGroup buttons={groupProps.buttons} object={hud.object} />,
                );
            }
        },
    );
}
