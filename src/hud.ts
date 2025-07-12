export interface ButtonGroupProps<T extends foundry.canvas.placeables.PlaceableObject.Any> {
    side: "left" | "right";
    buttons: ButtonProps<T>[];
}

export interface ButtonProps<T extends foundry.canvas.placeables.PlaceableObject.Any> {
    title: string;
    icon: string;
    onClick: (object: T) => void | Promise<void>;
    shouldShow?: (object: T) => boolean;
}

interface HUDObjectRegistry {
    Token: foundry.canvas.placeables.Token;
    Tile: foundry.canvas.placeables.Tile;
}

type HUDName = keyof HUDObjectRegistry;
type Brand<T extends HUDName> = `${T}HUD`;

export class HUD<T extends HUDName, P extends HUDObjectRegistry[T] = HUDObjectRegistry[T]> {
    readonly __brand: Brand<T>;
    readonly #game: Game;
    readonly #buttonsGroups: ButtonGroupProps<P>[];

    constructor(game: Game, name: Brand<T>) {
        this.#game = game;
        this.#buttonsGroups = [];
        this.__brand = name;

        foundry.helpers.Hooks.on(`render${name}`, this.#render.bind(this));
    }

    registerButtonGroup(props: ButtonGroupProps<P>): void {
        this.#buttonsGroups.push(props);
    }

    #render(hud: foundry.applications.hud.BasePlaceableHUD, html: HTMLElement): void {
        for (const groupProps of this.#buttonsGroups) {
            if (!hud.object) {
                continue;
            }

            const hudObject = hud.object;
            const shouldShow = groupProps.buttons.some((button) => button.shouldShow?.(hudObject as P) ?? true);

            if (!shouldShow || groupProps.buttons.length === 0) {
                continue;
            }

            if (groupProps.buttons.length === 1 && groupProps.buttons[0]) {
                const element = this.#createHudButton(
                    groupProps.buttons[0],
                    hud as foundry.applications.hud.BasePlaceableHUD<P>,
                );
                html.querySelector(`div.${groupProps.side}`)?.append(element);

                continue;
            }

            const group = document.createElement("div");
            const buttons = groupProps.buttons.map((props) =>
                this.#createHudButton(props, hud as foundry.applications.hud.BasePlaceableHUD<P>),
            );
            group.append(...buttons);

            Object.assign(group.style, {
                display: "flex",
                flexDirection: "horizontal",
                gap: "8px",
            });

            html.querySelector(`div.${groupProps.side}`)?.append(group);
        }
    }

    #createHudButton(props: ButtonProps<P>, hud: foundry.applications.hud.BasePlaceableHUD<P>) {
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
}
