type PlaceableObject = foundry.canvas.placeables.PlaceableObject;

export interface ButtonGroupProps<T extends PlaceableObject> {
    side: "left" | "right";
    buttons: ButtonProps<T>[];
}

export interface ButtonProps<T extends PlaceableObject> {
    title: string;
    icon: string;
    onClick: (object: T) => void | Promise<void>;
    shouldShow?: (object: T) => boolean;
}

interface HudRegistry {
    TokenHUD: [foundry.applications.hud.TokenHUD.Any];
    TileHUD: [foundry.applications.hud.TileHUD.Any];
}

type HudName = keyof HudRegistry & {};
type HudObject<T extends HudName> = HudRegistry[T][0]["object"];

export function setupPlaceableHUD<T extends HudName>(
    game: foundry.Game,
    name: T,
    buttonGroups: ButtonGroupProps<HudObject<T>>[],
) {
    foundry.helpers.Hooks.on(
        `render${name}`,
        (hud: foundry.applications.hud.BasePlaceableHUD<HudObject<T>>, html: HTMLElement) => {
            for (const groupProps of buttonGroups) {
                const shouldShow = groupProps.buttons.some((button) => button.shouldShow?.(hud.object) ?? true);

                if (!shouldShow) {
                    continue;
                }

                const buttons = groupProps.buttons.map((props) => {
                    const title = game.i18n?.localize(props.title) ?? "";
                    const handleClick = () => {
                        props.onClick(hud.object);
                    };

                    return (
                        <button className="control-icon" onClick={handleClick} title={title}>
                            <img src={props.icon} title={title} alt={title} width={36} height={36} />
                        </button>
                    );
                });

                const group = <div style="display: flex; flexDirection: horizontal; gap: 8px">{buttons}</div>;

                html.querySelector(`div.${groupProps.side}`)?.append(group);
            }
        },
    );
}
