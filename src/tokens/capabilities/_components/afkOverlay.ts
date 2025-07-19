import { type Settings } from "@/common/settings";

export interface TokenElement {
    show(): Promise<void>;
    hide(): void;
}

export class AfkOverlay extends PIXI.Container implements TokenElement {
    readonly #settings: Settings;
    readonly #token: Token;
    static readonly NAME = "afk-overlay";

    #sprite: PIXI.Sprite | null = null;

    constructor(settings: Settings, token: Token) {
        super();

        this.name = AfkOverlay.NAME;
        this.#settings = settings;
        this.#token = token;
        this.#token.addChild(this);
    }

    async show(): Promise<void> {
        const token = this.#token;
        const texture = await foundry.canvas.loadTexture(this.#settings.afkOverlayIconPath);

        if (!texture) {
            return;
        }

        if (this.#sprite) {
            this.#sprite.destroy({ children: true });
        }

        this.#sprite = new PIXI.Sprite(texture as PIXI.Texture<PIXI.Resource>);
        this.#sprite.position = new PIXI.Point(0, 0);
        this.#sprite.anchor.set(0.5);

        const { width, height } = token.bounds;
        this.#sprite.width = width * 0.8;
        this.#sprite.height = height * 0.8;
        this.#sprite.position.set(width / 2, height / 2);

        this.addChild(this.#sprite);

        this.renderable = true;
    }

    hide(): void {
        this.renderable = false;
        if (this.#sprite) {
            this.#sprite.destroy({ children: true });
            this.#sprite = null;
        }
    }
}
