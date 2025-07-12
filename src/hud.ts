export interface ButtonGroupProps<T extends foundry.canvas.placeables.PlaceableObject> {
    side: "left" | "right";
    buttons: ButtonProps<T>[];
}

export interface ButtonProps<T extends foundry.canvas.placeables.PlaceableObject> {
    title: string;
    icon: string;
    onClick: (object: T) => void | Promise<void>;
    shouldShow?: (object: T) => boolean;
}

export class TokenHUD extends BaseHud("TokenHUD") {}
export class TileHUD extends BaseHud("TileHUD") {}

interface HudRegistry {
    TokenHUD: [foundry.applications.hud.TokenHUD.Any];
    TileHUD: [foundry.applications.hud.TileHUD.Any];
}

type HudName = keyof HudRegistry & {};
type HudType<T extends HudName> = HudRegistry[T][0];
type HudObject<T extends HudName> = HudType<T>["object"];

function BaseHud<T extends HudName>(name: T) {
    return class {
        readonly __brand!: T;
        readonly #game: foundry.Game;
        readonly #buttonsGroups: ButtonGroupProps<HudObject<T>>[];

        constructor(game: foundry.Game) {
            this.#game = game;
            this.#buttonsGroups = [];

            foundry.helpers.Hooks.on(`render${name}`, this.#render.bind(this));
        }

        registerButtonGroup(props: ButtonGroupProps<HudObject<T>>): void {
            this.#buttonsGroups.push(props);
        }

        #render(hud: HudType<T>, html: HTMLElement): void {
            for (const groupProps of this.#buttonsGroups) {
                if (!hud.object) {
                    continue;
                }

                const hudObject = hud.object;
                const shouldShow = groupProps.buttons.some((button) => button.shouldShow?.(hudObject) ?? true);

                if (!shouldShow || groupProps.buttons.length === 0) {
                    continue;
                }

                if (groupProps.buttons.length === 1 && groupProps.buttons[0]) {
                    const element = this.#createHudButton(groupProps.buttons[0], hud);
                    html.querySelector(`div.${groupProps.side}`)?.append(element);

                    continue;
                }

                const group = document.createElement("div");
                const buttons = groupProps.buttons.map((props) => this.#createHudButton(props, hud));
                group.append(...buttons);

                Object.assign(group.style, {
                    display: "flex",
                    flexDirection: "horizontal",
                    gap: "8px",
                });

                html.querySelector(`div.${groupProps.side}`)?.append(group);
            }
        }

        #createHudButton(props: ButtonProps<HudObject<T>>, hud: HudType<T>) {
            const title = this.#game.i18n?.localize(props.title) ?? "";
            const button = document.createElement("button");
            button.classList.add("control-icon");
            button.onclick = () => {
                if (!hud.object) {
                    return;
                }

                props.onClick(hud.object);
            };
            button.title = title;

            const img = Object.assign(document.createElement("img"), {
                title,
                alt: title,
                src: props.icon,
                width: 36,
                height: 36,
            });

            button.appendChild(img);
            return button;
        }
    };
}
