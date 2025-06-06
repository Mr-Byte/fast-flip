import "./api";

import * as hud from "./hud";

import { LOCALIZATION, MODULE_NAME } from "./constants";
import { TileMirror, TokenMirror } from "./model";

import { Settings } from "./settings";
import { SpeechManager } from "./managers/speech-manager";
import { TileManager } from "./managers/tile-manager";
import { TokenManager } from "./managers/token-manager";
import { getIcon } from "./helpers";

Hooks.once("init", () => {
    if (game instanceof Game) {
        const settings = new Settings(game);

        const tokenHUD = new hud.HUD<Token>(game, "TokenHUD");
        const tokenManager = new TokenManager(game, settings);
        const tileHUD = new hud.HUD<Tile>(game, "TileHUD");
        const tileManager = new TileManager(game);
        const speechManager = new SpeechManager(game, settings);

        registerKeybindings(game, tokenManager, tileManager, speechManager);
        registerHUDButtons(settings, tokenHUD, tileHUD, tokenManager, tileManager);
    }
});

function registerKeybindings(
    game: Game,
    tokenManager: TokenManager,
    tileManager: TileManager,
    speechManager: SpeechManager,
) {
    const horizontalFlip: () => void = async () => {
        tokenManager.mirrorSelected(TokenMirror.HORIZONTAL);
        await tileManager.mirrorSelectedTiles(TileMirror.HORIZONTAL);
    };

    game.keybindings?.register(MODULE_NAME, "horizontalFlip", {
        name: LOCALIZATION.MIRROR_HORIZONTAL_HOTKEY,
        hint: game.i18n?.localize(LOCALIZATION.MIRROR_HORIZONTAL_HINT),
        editable: [{ key: "KeyG" }],
        onDown: horizontalFlip,
        precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        restricted: false,
        reservedModifiers: [],
        repeat: false,
    });

    const verticalFlip: () => void = async () => {
        tokenManager.mirrorSelected(TokenMirror.VERTICAL);
        await tileManager.mirrorSelectedTiles(TileMirror.VERTICAL);
    };
    game.keybindings?.register(MODULE_NAME, "verticalFlip", {
        name: LOCALIZATION.MIRROR_VERTICAL_HOTKEY,
        hint: game.i18n?.localize(LOCALIZATION.MIRROR_VERTICAL_HINT),
        editable: [{ key: "KeyG", modifiers: ["SHIFT"] }],
        onDown: verticalFlip,
        precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        restricted: false,
        reservedModifiers: [],
        repeat: false,
    });

    const toggleAFK: () => void = async () => await tokenManager.toggleAFK();
    game.keybindings?.register(MODULE_NAME, LOCALIZATION.TOGGLE_AFK_HOTKEY, {
        name: LOCALIZATION.TOGGLE_AFK_HOTKEY,
        hint: game.i18n?.localize(LOCALIZATION.TOGGLE_AFK_HINT),
        editable: [{ key: "KeyK", modifiers: ["SHIFT"] }],
        onDown: toggleAFK,
        precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        restricted: false,
        reservedModifiers: [],
        repeat: false,
    });

    const onStartSpeaking: () => void = async () => {
        await speechManager.showSpeechBubble();
    };
    const onStopSpeaking = () => {
        speechManager.hideSpeechBubble();
    };
    game.keybindings?.register(MODULE_NAME, LOCALIZATION.SHOW_SPEECH_BUBBLE_HOTKEY, {
        name: LOCALIZATION.SHOW_SPEECH_BUBBLE_HOTKEY,
        hint: game.i18n?.localize(LOCALIZATION.SHOW_SPEECH_BUBBLE_HINT),
        editable: [{ key: "KeyS", modifiers: ["ALT"] }],
        onDown: onStartSpeaking,
        onUp: onStopSpeaking,
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

    tokenHUD.registerButtonGroup({
        side: "left",
        buttons: [
            {
                title: LOCALIZATION.MIRROR_HORIZONTAL_BUTTON,
                icon: mirrorHorizontalIcon,
                onClick: () => void tokenManager.mirrorSelected(TokenMirror.HORIZONTAL),
                shouldShow: (token) => settings.showMirrorButtons && token.isOwner,
            },
            {
                title: LOCALIZATION.MIRROR_VERTICAL_BUTTON,
                icon: mirrorVerticalIcon,
                onClick: () => void tokenManager.mirrorSelected(TokenMirror.VERTICAL),
                shouldShow: (token) => settings.showMirrorButtons && token.isOwner,
            },
        ],
    });

    tokenHUD.registerButtonGroup({
        side: "right",
        buttons: [
            {
                title: LOCALIZATION.TOGGLE_AFK_BUTTON,
                icon: toggleAFKIcon,
                onClick: () => void tokenManager.toggleAFK(),
                shouldShow: (token) =>
                    settings.allowAFKToggle &&
                    settings.showToggleAFKButton &&
                    token.isOwner &&
                    (token.actor?.hasPlayerOwner ?? false),
            },
        ],
    });

    tileHUD.registerButtonGroup({
        side: "left",
        buttons: [
            {
                title: LOCALIZATION.MIRROR_HORIZONTAL_BUTTON,
                icon: mirrorHorizontalIcon,
                onClick: () => void tileManager.mirrorSelectedTiles(TileMirror.HORIZONTAL),
            },
            {
                title: LOCALIZATION.MIRROR_VERTICAL_BUTTON,
                icon: mirrorVerticalIcon,
                onClick: () => void tileManager.mirrorSelectedTiles(TileMirror.VERTICAL),
            },
        ],
    });
}
