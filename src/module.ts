import { LOCALIZATION, MODULE_NAME } from "./constants";
import { TokenManager, TokenMirror } from "./managers/TokenManager";
import { TileManager, TileMirror } from "./managers/TileManager";
import { Settings } from "./Settings";
import { getIcon } from "helpers";
import * as hud from "./hud";

Hooks.once("init", () => {
    if (game instanceof Game) {
        const settings = new Settings(game);

        const tokenHUD = new hud.HUD<Token>(game, hud.Name.TokenHUD);
        const tokenManager = new TokenManager(game, settings);
        const tileHUD = new hud.HUD<Tile>(game, hud.Name.TileHUD);
        const tileManager = new TileManager(game);

        registerKeybindings(game, tokenManager, tileManager);
        registerHUDButtons(
            settings,
            tokenHUD,
            tileHUD,
            tokenManager,
            tileManager,
        );
    }
});

function registerKeybindings(
    game: Game,
    tokenManager: TokenManager,
    tileManager: TileManager,
) {
    const horizontalFlip: () => void = async () => {
        await tokenManager.mirrorSelected(TokenMirror.HORIZONTAL);
        await tileManager.mirrorSelectedTiles(TileMirror.HORIZONTAL);
    };

    game.keybindings.register(MODULE_NAME, "horizontalFlip", {
        name: LOCALIZATION.MIRROR_HORIZONTAL_HOTKEY,
        hint: game.i18n.localize(LOCALIZATION.MIRROR_HORIZONTAL_HINT),
        editable: [{ key: "KeyF" }],
        onDown: horizontalFlip,
        precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        restricted: false,
        reservedModifiers: [],
        repeat: false,
    });

    const verticalFlip: () => void = async () => {
        await tokenManager.mirrorSelected(TokenMirror.VERTICAL);
        await tileManager.mirrorSelectedTiles(TileMirror.VERTICAL);
    };
    game.keybindings.register(MODULE_NAME, "verticalFlip", {
        name: LOCALIZATION.MIRROR_VERTICAL_HOTKEY,
        hint: game.i18n.localize(LOCALIZATION.MIRROR_VERTICAL_HINT),
        editable: [{ key: "KeyF", modifiers: ["SHIFT"] }],
        onDown: verticalFlip,
        precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        restricted: false,
        reservedModifiers: [],
        repeat: false,
    });

    const toggleAFK: () => void = async () => await tokenManager.toggleAFK();
    game.keybindings.register(MODULE_NAME, LOCALIZATION.TOGGLE_AFK_HOTKEY, {
        name: LOCALIZATION.TOGGLE_AFK_HOTKEY,
        hint: game.i18n.localize(LOCALIZATION.TOGGLE_AFK_HINT),
        editable: [{ key: "KeyK", modifiers: ["SHIFT"] }],
        onDown: toggleAFK,
        precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        restricted: false,
        reservedModifiers: [],
        repeat: false,
    });
}

function registerHUDButtons(
    settings: Settings,
    tokenHUD: hud.HUD<Token>,
    tileHUD: hud.HUD<Tile>,
    tokenManager: TokenManager,
    tileManager: TileManager,
) {
    const mirrorHorizontalIcon = getIcon("mirror-horizontal");
    const mirrorVerticalIcon = getIcon("mirror-vertical");
    const toggleAFKIcon = getIcon("toggle-afk");

    tokenHUD.registerButton(`${MODULE_NAME}.mirror-horizontal`, {
        side: "left",
        title: LOCALIZATION.MIRROR_HORIZONTAL_BUTTON,
        icon: mirrorHorizontalIcon,
        onClick: () => void tokenManager.mirrorSelected(TokenMirror.HORIZONTAL),
        shouldShow: (token) => settings.showMirrorButtons && token.isOwner,
    });

    tokenHUD.registerButton(`${MODULE_NAME}.mirror-vertical`, {
        side: "left",
        title: LOCALIZATION.MIRROR_VERTICAL_BUTTON,
        icon: mirrorVerticalIcon,
        onClick: () => void tokenManager.mirrorSelected(TokenMirror.VERTICAL),
        shouldShow: (token) => settings.showMirrorButtons && token.isOwner,
    });

    tokenHUD.registerButton(`${MODULE_NAME}.toggle-afk`, {
        side: "right",
        title: LOCALIZATION.TOGGLE_AFK_BUTTON,
        icon: toggleAFKIcon,
        onClick: () => void tokenManager.toggleAFK(),
        shouldShow: (token) =>
            settings.allowAFKToggle &&
            settings.showToggleAFKButton &&
            token.isOwner &&
            (token.actor?.hasPlayerOwner ?? false),
    });

    tileHUD.registerButton(`${MODULE_NAME}.mirror-horizontal`, {
        side: "left",
        title: LOCALIZATION.MIRROR_HORIZONTAL_BUTTON,
        icon: mirrorHorizontalIcon,
        onClick: () =>
            void tileManager.mirrorSelectedTiles(TileMirror.HORIZONTAL),
    });

    tileHUD.registerButton(`${MODULE_NAME}.mirror-vertical`, {
        side: "left",
        title: LOCALIZATION.MIRROR_VERTICAL_BUTTON,
        icon: mirrorVerticalIcon,
        onClick: () =>
            void tileManager.mirrorSelectedTiles(TileMirror.VERTICAL),
    });
}
