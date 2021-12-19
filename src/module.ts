import { MODULE_NAME, MIRROR_HORIZONTAL_HOT_KEY, MIRROR_VERTICAL_HOT_KEY, TOGGLE_AFK_HOT_KEY } from "./constants";
import { TokenManager, TokenMirror } from "./managers/TokenManager";
import { TileManager, TileMirror } from "./managers/TileManager";

Hooks.once("init", () => {
    if (game instanceof Game) {
        new FastFlipModule(game);
    }
});

class FastFlipModule {
    readonly #tokenManager: TokenManager;
    readonly #tileManager: TileManager;

    constructor(game: Game) {
        this.#tokenManager = new TokenManager(game);
        this.#tileManager = new TileManager(game);

        this.#registerKeybindings(game.keybindings);
    }

    #registerKeybindings(keybindings: ClientKeybindings) {
        keybindings.register(MODULE_NAME, "horizontalFlip", {
            name: MIRROR_HORIZONTAL_HOT_KEY,
            hint: "Horizontally mirrors the selected tile or token",
            editable: [
                { key: "KeyF" },
            ],
            onDown: this.#onHorizontalMirror.bind(this),
            // TODO: Fix this once V9 bindings are out.
            precedence: (CONST as any).KEYBINDING_PRECEDENCE.NORMAL,
            restrictied: false,
            reservedModifiers: [],
            repeat: false,
        });

        keybindings.register(MODULE_NAME, "verticalFlip", {
            name: MIRROR_VERTICAL_HOT_KEY,
            hint: "Vertically mirrors the selected tile or token",
            editable: [
                { key: "KeyF", modifiers: ["SHIFT"] },
            ],
            onDown: this.#onVerticalMirror.bind(this),
            // TODO: Fix this once V9 bindings are out.
            precedence: (CONST as any).KEYBINDING_PRECEDENCE.NORMAL,
            restrictied: false,
            reservedModifiers: [],
            repeat: false,
        });

        keybindings.register(MODULE_NAME, TOGGLE_AFK_HOT_KEY, {
            name: MIRROR_VERTICAL_HOT_KEY,
            hint: "Marks the selected tokens as AFK",
            editable: [
                { key: "KeyK", modifiers: ["SHIFT"] },
            ],
            onDown: this.#onToggleAFK.bind(this),
            // TODO: Fix this once V9 bindings are out.
            precedence: (CONST as any).KEYBINDING_PRECEDENCE.NORMAL,
            restrictied: false,
            reservedModifiers: [],
            repeat: false,
        });
    }

    async #onToggleAFK() {
        await this.#tokenManager.toggleAFK();
    }

    async #onHorizontalMirror() {
        await this.#tokenManager.mirrorSelected(TokenMirror.HORIZONTAL);
        await this.#tileManager.mirrorSelectedTiles(TileMirror.HORIZONTAL);
    };

    async #onVerticalMirror() {
        await this.#tokenManager.mirrorSelected(TokenMirror.VERTICAL);
        await this.#tileManager.mirrorSelectedTiles(TileMirror.VERTICAL);
    };
}
