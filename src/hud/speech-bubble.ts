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

type TemplateData = {
    token: Token;
    message: string;
};

export class SpeechBubbles {
    readonly #template: string = "templates/hud/chat-bubble.html";
    readonly #settings: Settings;

    constructor(settings: Settings) {
        this.#settings = settings;
    }

    get container(): HTMLElement | null {
        return document.getElementById("chat-bubbles");
    }

    async show(token: Token): Promise<void> {
        const html = await this.#renderHTML({ token, message: token.name });
        const element = document.createElement("div");
        element.innerHTML = html;
        const bubble = element.firstElementChild as HTMLElement;

        const dimensions = this.#getMessageDimensions(token.name);
        this.#setPosition(token, bubble, dimensions);
        this.container?.appendChild(bubble);

        bubble.style.display = "block";
        bubble.style.opacity = "0";

        await bubble.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 250,
            fill: "forwards",
        }).finished;
    }

    async hide(token: Token): Promise<void> {
        const existing = document.querySelector(`.chat-bubble[data-token-id="${token.id}"]`) as HTMLElement;

        if (!existing) {
            return;
        }

        await existing.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 100,
            fill: "forwards",
        }).finished;

        existing.remove();
    }

    async #renderHTML(data: TemplateData): Promise<string> {
        return renderTemplate(this.#template, data);
    }

    #getMessageDimensions(message: string): MessageDimensions {
        const div = document.createElement("div");
        div.className = "chat-bubble";
        div.style.visibility = "hidden";
        div.style.fontSize = `${this.#settings.speechBubbleFontSize}px`;
        div.textContent = message;

        document.body.appendChild(div);
        const dims = {
            width: div.clientWidth + 8,
            height: div.clientHeight,
            unconstrained: undefined as number | undefined,
        };

        div.style.maxHeight = "none";
        dims.unconstrained = div.clientHeight;
        div.remove();

        return dims;
    }

    #setPosition(token: Token, element: HTMLElement, dimensions: { width: number; height: number }): void {
        element.classList.add("right");
        element.style.fontSize = `${this.#settings.speechBubbleFontSize}px`;

        Object.assign(element.style, {
            height: `${dimensions.height}px`,
            width: `${dimensions.width}px`,
            top: `${token.y - dimensions.height - 8}px`,
            left: `${token.x - (dimensions.width - token.w)}px`,
        });
    }
}
