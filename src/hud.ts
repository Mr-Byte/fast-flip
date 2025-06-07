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

interface HUDRegistry {
    Token: Token;
    Tile: Tile;
}

type HUDType = HUDRegistry[keyof HUDRegistry];

type HUDTypeName<T> = T extends HUDType
    ? {
          [K in keyof HUDRegistry]: HUDRegistry[K] extends T ? K : never;
      }[keyof HUDRegistry]
    : never;

type Brand<T extends HUDType> = `${HUDTypeName<T>}HUD`;

export class HUD<T extends HUDType> {
    readonly __brand: Brand<T>;
    readonly #game: Game;
    readonly #buttonsGroups: ButtonGroupProps<T>[];

    constructor(game: Game, name: Brand<T>) {
        this.#game = game;
        this.#buttonsGroups = [];
        this.__brand = name;

        Hooks.on(`render${name}`, this.#render.bind(this));
    }

    registerButtonGroup(props: ButtonGroupProps<T>): void {
        this.#buttonsGroups.push(props);
    }

    #render(hud: BasePlaceableHUD<T>, html: HTMLElement): void {
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

    #createHudButton(props: ButtonProps<T>, hud: BasePlaceableHUD<T, Application.Options>) {
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
