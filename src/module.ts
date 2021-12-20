import * as constants from "./constants";
import { TokenManager, TokenMirror } from "./managers/TokenManager";
import { TileManager, TileMirror } from "./managers/TileManager";
import { TokenHUDManager } from "managers/TokenHUDManager";

Hooks.once("init", () => {
    if (game instanceof Game) {
        new FastFlipModule(game);
    }
});

class FastFlipModule {
    readonly #tokenHUDManager: TokenHUDManager;
    readonly #tokenManager: TokenManager;
    readonly #tileManager: TileManager;
    readonly #game: Game;

    constructor(game: Game) {
        this.#game = game;
        this.#tokenHUDManager = new TokenHUDManager(game);
        this.#tokenManager = new TokenManager(game);
        this.#tileManager = new TileManager(game);

        this.#registerSettings();
        this.#registerKeybindings();
        this.#registerHUDButtons();
    }

    #registerSettings() {
        this.#game.settings.register(constants.MODULE_NAME, constants.SHOW_MIRROR_BUTTONS_SETTING, {
            name: this.#game.i18n.localize(constants.SHOW_MIRROR_BUTTONS),
            hint: this.#game.i18n.localize(constants.SHOW_MIRROR_BUTTONS_HINT),
            scope: "client",
            config: true,
            type: Boolean,
            default: true,
        });

        this.#game.settings.register(constants.MODULE_NAME, constants.SHOW_TOGGLE_AFK_HUD_SETTING, {
            name: this.#game.i18n.localize(constants.SHOW_TOGGLE_AFK_BUTTON),
            hint: this.#game.i18n.localize(constants.SHOW_TOGGLE_AFK_HINT),
            scope: "client",
            config: true,
            type: Boolean,
            default: true,
        });
    }

    #registerKeybindings() {
        this.#game.keybindings.register(constants.MODULE_NAME, "horizontalFlip", {
            name: constants.MIRROR_HORIZONTAL_HOTKEY,
            hint: this.#game.i18n.localize(constants.MIRROR_HORIZONTAL_HINT),
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

        this.#game.keybindings.register(constants.MODULE_NAME, "verticalFlip", {
            name: constants.MIRROR_VERTICAL_HOTKEY,
            hint: this.#game.i18n.localize(constants.MIRROR_VERTICAL_HINT),
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

        this.#game.keybindings.register(constants.MODULE_NAME, constants.TOGGLE_AFK_HOTKEY, {
            name: constants.TOGGLE_AFK_HOTKEY,
            hint: this.#game.i18n.localize(constants.TOGGLE_AFK_HINT),
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

    #registerHUDButtons() {
        this.#tokenHUDManager.registerButton(`${constants.MODULE_NAME}.mirror-horizontal`, {
            side: "left",
            title: constants.MIRROR_HORIZONTAL_BUTTON,
            icon: "mirror-horizontal",
            onClick: this.#onHorizontalMirror.bind(this),
            shouldShow: () => this.#game.settings.get(constants.MODULE_NAME, constants.SHOW_MIRROR_BUTTONS_SETTING) as boolean,
        });

        this.#tokenHUDManager.registerButton(`${constants.MODULE_NAME}.mirror-vertical`, {
            side: "left",
            title: constants.MIRROR_VERTICAL_BUTTON,
            icon: "mirror-vertical",
            onClick: this.#onVerticalMirror.bind(this),
            shouldShow: () => this.#game.settings.get(constants.MODULE_NAME, constants.SHOW_MIRROR_BUTTONS_SETTING) as boolean,
        });

        this.#tokenHUDManager.registerButton(`${constants.MODULE_NAME}.toggle-afk`, {
            side: "right",
            title: constants.TOGGLE_AFK_BUTTON,
            icon: "toggle-afk",
            onClick: this.#onToggleAFK.bind(this),
            shouldShow: () => this.#game.settings.get(constants.MODULE_NAME, constants.SHOW_TOGGLE_AFK_HUD_SETTING) as boolean,
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
