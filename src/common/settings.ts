import type { ModuleSettings } from "@/common/types";
import { LOCALIZATION, MODULE_NAME, SETTING } from "@/common/constants";
import { getIcon } from "@/common/helpers";

export type Settings = ModuleSettings;

export function registerSettings(game: foundry.Game): Settings {
    game.settings.register(MODULE_NAME, SETTING.ANIMATION_DURATION, {
        name: game.i18n?.localize(LOCALIZATION.ANIMATION_DURATION),
        hint: game.i18n?.localize(LOCALIZATION.ANIMATION_DURATION_HINT),
        scope: "world",
        config: true,
        default: 0.0,
        type: Number,
        range: {
            min: 0,
            max: 1.0,
            step: 0.1,
        },
    });

    game.settings.register(MODULE_NAME, SETTING.ALLOW_SPEECH_BUBBLES, {
        name: game.i18n?.localize(LOCALIZATION.ALLOW_SPEECH_BUBBLES),
        hint: game.i18n?.localize(LOCALIZATION.ALLOW_SPEECH_BUBBLES_HINT),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register(MODULE_NAME, SETTING.SPEECH_BUBBLE_FONT_SIZE, {
        name: game.i18n?.localize(LOCALIZATION.SPEECH_BUBBLE_FONT_SIZE),
        hint: game.i18n?.localize(LOCALIZATION.SPEECH_BUBBLE_FONT_SIZE_HINT),
        scope: "client",
        config: true,
        default: 14,
        type: Number,
        range: {
            min: 14,
            max: 42,
            step: 1,
        },
    });

    // TODO: Look into why this typing breaks?
    game.settings.register(MODULE_NAME, SETTING.AFK_OVERLAY_ICON_PATH, {
        name: game.i18n?.localize(LOCALIZATION.AFK_OVERLAY_ICON_PATH),
        hint: game.i18n?.localize(LOCALIZATION.AFK_OVERLAY_ICON_PATH_HINT),
        scope: "world",
        config: true,
        type: String,
        filePicker: "imagevideo",
        default: getIcon("afk"),
    } as foundry.helpers.ClientSettings.RegisterData<
        string,
        typeof MODULE_NAME,
        foundry.helpers.ClientSettings.KeyFor<typeof MODULE_NAME>
    >);

    game.settings.register(MODULE_NAME, SETTING.ALLOW_AFK_TOGGLE, {
        name: game.i18n?.localize(LOCALIZATION.ALLOW_AFK_TOGGLE),
        hint: game.i18n?.localize(LOCALIZATION.ALLOW_AFK_TOGGLE_HINT),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register(MODULE_NAME, SETTING.SHOW_AFK_STATUS_IN_CHAT, {
        name: game.i18n?.localize(LOCALIZATION.SHOW_AFK_STATUS_IN_CHAT),
        hint: game.i18n?.localize(LOCALIZATION.SHOW_AFK_STATUS_IN_CHAT_HINT),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register(MODULE_NAME, SETTING.SHOW_MIRROR_BUTTONS_HUD, {
        name: game.i18n?.localize(LOCALIZATION.SHOW_FLIP_BUTTONS),
        hint: game.i18n?.localize(LOCALIZATION.SHOW_FLIP_BUTTONS_HINT),
        scope: "client",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register(MODULE_NAME, SETTING.SHOW_TOGGLE_AFK_HUD, {
        name: game.i18n?.localize(LOCALIZATION.SHOW_TOGGLE_AFK_BUTTON),
        hint: game.i18n?.localize(LOCALIZATION.SHOW_TOGGLE_AFK_HINT),
        scope: "client",
        config: true,
        default: true,
        type: Boolean,
    });

    return {
        get animationDuration(): number {
            return game.settings.get(MODULE_NAME, SETTING.ANIMATION_DURATION) * 1000;
        },
        get afkOverlayIconPath(): string {
            return game.settings.get(MODULE_NAME, SETTING.AFK_OVERLAY_ICON_PATH);
        },
        get showMirrorButtonsHud(): boolean {
            return game.settings.get(MODULE_NAME, SETTING.SHOW_MIRROR_BUTTONS_HUD);
        },
        get allowAfkToggle(): boolean {
            return game.settings.get(MODULE_NAME, SETTING.ALLOW_AFK_TOGGLE);
        },
        get showAfkStatusInChat(): boolean {
            return game.settings.get(MODULE_NAME, SETTING.SHOW_AFK_STATUS_IN_CHAT);
        },
        get showToggleAfkHud(): boolean {
            return game.settings.get(MODULE_NAME, SETTING.SHOW_TOGGLE_AFK_HUD);
        },
        get allowSpeechBubbles(): boolean {
            return game.settings.get(MODULE_NAME, SETTING.ALLOW_SPEECH_BUBBLES);
        },
        get speechBubbleFontSize(): number {
            return game.settings.get(MODULE_NAME, SETTING.SPEECH_BUBBLE_FONT_SIZE);
        },
    } as const;
}
