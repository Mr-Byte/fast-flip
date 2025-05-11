import { Settings } from "../settings";

export enum SpeechBubbleShowType {
    Keybind,
    Socket,
}

type MessageDimensions = {
    width: number;
    height: number;
    unconstrained: number | undefined;
};

export class SpeechBubbles {
    readonly #template: string;
    readonly #settings: Settings;

    constructor(settings: Settings) {
        this.#settings = settings;
        this.#template = "templates/hud/chat-bubble.html";
    }

    get container(): JQuery<HTMLElement> {
        return $("#chat-bubbles");
    }

    async show(token: Token): Promise<void> {
        const html = $(await this.#renderHTML({ token, message: token.name }));
        const dimensions = this.#getMessageDimensions(token.name);

        this.#setPosition(token, html, dimensions);
        this.container.append(html);

        return await new Promise<void>((resolve) =>
            html.fadeIn(250, () => {
                resolve();
            }),
        );
    }

    hide(token: Token): Promise<void> | undefined {
        const existing = $(`.chat-bubble[data-token-id="${token.id}"]`);
        if (!existing.length) {
            return;
        }

        return new Promise<void>((resolve) => {
            existing.fadeOut(100, () => {
                existing.remove();
                resolve();
            });
        });
    }

    async #renderHTML(data: {
        token: Token;
        message: string;
    }): Promise<string> {
        return renderTemplate(this.#template, data);
    }

    #getMessageDimensions(message: string): MessageDimensions {
        const div = $(
            `<div class="chat-bubble" style="visibility:hidden; font-size: ${
                this.#settings.speechBubbleFontSize
            }px">${message}</div>`,
        );
        $("body").append(div);
        const dims = {
            width: div[0].clientWidth + 8,
            height: div[0].clientHeight,
            unconstrained: undefined as number | undefined,
        };

        div.css({ maxHeight: "none" });
        dims.unconstrained = div[0].clientHeight;
        div.remove();

        return dims;
    }

    #setPosition(
        token: Token,
        html: JQuery,
        dimensions: { width: number; height: number },
    ): void {
        html.addClass("right");
        html.css("font-size", `${this.#settings.speechBubbleFontSize}px`);
        const position = {
            height: dimensions.height,
            width: dimensions.width,
            top: token.y - dimensions.height - 8,
            left: token.x - (dimensions.width - token.w),
        };

        html.css(position);
    }
}
