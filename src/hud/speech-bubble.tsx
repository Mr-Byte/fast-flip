import { Settings } from "../settings";

export class SpeechBubbles {
    readonly #settings: Settings;
    readonly #canvas: HTMLCanvasElement;
    readonly #fontFamily: string;

    constructor(settings: Settings) {
        this.#settings = settings;
        this.#canvas = document.createElement("canvas");

        const style = getComputedStyle(<div className="bubble-content"></div>);
        this.#fontFamily = style.fontFamily;
    }

    get container(): HTMLElement | null {
        return document.getElementById("chat-bubbles");
    }

    async show(token: Token): Promise<void> {
        const context = this.#canvas.getContext("2d")!;
        context.font = `${this.#settings.speechBubbleFontSize}px ${this.#fontFamily}`;
        const fontMetrics = context.measureText(token.name);
        const yOffset = fontMetrics.actualBoundingBoxAscent + fontMetrics.actualBoundingBoxDescent + 36;
        const width = fontMetrics.width + 40;

        const chatBubble = (
            <div
                className="chat-bubble right"
                style={`display: block; opacity: 0; top: ${token.y - yOffset}px; left: ${token.x}px; font-size: ${this.#settings.speechBubbleFontSize}px`}
                data-token-id={token.id}
            >
                <div className="bubble-content" style={`width: ${width}px`}>
                    {token.name}
                </div>
            </div>
        );

        this.container?.appendChild(chatBubble);

        await chatBubble.animate([{ opacity: 0 }, { opacity: 1 }], {
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
}
