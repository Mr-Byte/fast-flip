import { getIcon } from "../helpers";

export interface ButtonProps {
    side: "left" | "right";
    title: string;
    icon: string;
    onClick: () => void | Promise<void>;
    shouldShow?: () => boolean;
}

export class TokenHUDManager {
    readonly #game: Game;
    readonly #buttons: Map<string, ButtonProps>;

    constructor(game: Game) {
        this.#game = game;
        this.#buttons = new Map();

        Hooks.on("renderTokenHUD", this.#renderTokenHUD.bind(this));
    }

    registerButton(id: string, props: ButtonProps) {
        this.#buttons.set(id, props);
    }

    #renderTokenHUD(_: unknown, html: JQuery) {
        for (const [_, props] of this.#buttons) {
            const shouldShow = props.shouldShow?.() ?? true;

            if (shouldShow) {
                const button = this.#createButton(props);
                html.find(`div.${props.side}`).append(button);
            }
        }
    }

    #createButton(props: ButtonProps): JQuery {
        const element = document.createElement("div");
        element.classList.add("control-icon");
        element.innerHTML = `<img src="${getIcon(props.icon)}" width="36" height="36" title="${props.title}" />`;
        element.title = this.#game.i18n.localize(props.title);

        const button = $(element).on("click", () => props.onClick());

        return button;
    }
}