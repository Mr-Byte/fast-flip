import { LOCALIZATION, MODULE_NAME } from "@/common/constants";
import { SETTING, type SettingEntries } from "@/configuration";
import { getIcon } from "@/common/helpers";

export type Settings = Readonly<{
    animationDuration: number;
    afkOverlayIconPath: string;
    showMirrorButtons: boolean;
    allowAFKToggle: boolean;
    showAFKStatusInChat: boolean;
    showToggleAFKButton: boolean;
    allowSpeechBubbles: boolean;
    speechBubbleFontSize: number;
}>;

export function registerSettings(game: foundry.Game): Settings {
    const settings = {
        [SETTING.ANIMATION_DURATION]: {
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
        },
        [SETTING.ALLOW_SPEECH_BUBBLES]: {
            name: game.i18n?.localize(LOCALIZATION.ALLOW_SPEECH_BUBBLES),
            hint: game.i18n?.localize(LOCALIZATION.ALLOW_SPEECH_BUBBLES_HINT),
            scope: "world",
            config: true,
            default: true,
            type: Boolean,
        },
        [SETTING.SPEECH_BUBBLE_FONT_SIZE]: {
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
        },
        [SETTING.AFK_OVERLAY_ICON_PATH]: {
            name: game.i18n?.localize(LOCALIZATION.AFK_OVERLAY_ICON_PATH),
            hint: game.i18n?.localize(LOCALIZATION.AFK_OVERLAY_ICON_PATH_HINT),
            scope: "world",
            config: true,
            default: getIcon("afk"),
            filePicker: "imagevideo",
        },
        [SETTING.ALLOW_AFK_TOGGLE]: {
            name: game.i18n?.localize(LOCALIZATION.ALLOW_AFK_TOGGLE),
            hint: game.i18n?.localize(LOCALIZATION.ALLOW_AFK_TOGGLE_HINT),
            scope: "world",
            config: true,
            default: true,
            type: Boolean,
        },
        [SETTING.SHOW_AFK_STATUS_IN_CHAT]: {
            name: game.i18n?.localize(LOCALIZATION.SHOW_AFK_STATUS_IN_CHAT),
            hint: game.i18n?.localize(LOCALIZATION.SHOW_AFK_STATUS_IN_CHAT_HINT),
            scope: "world",
            config: true,
            default: true,
            type: Boolean,
        },
        [SETTING.SHOW_MIRROR_BUTTONS_HUD]: {
            name: game.i18n?.localize(LOCALIZATION.SHOW_MIRROR_BUTTONS),
            hint: game.i18n?.localize(LOCALIZATION.SHOW_MIRROR_BUTTONS_HINT),
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
        },
        [SETTING.SHOW_TOGGLE_AFK_HUD]: {
            name: game.i18n?.localize(LOCALIZATION.SHOW_TOGGLE_AFK_BUTTON),
            hint: game.i18n?.localize(LOCALIZATION.SHOW_TOGGLE_AFK_HINT),
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
        },
    };

    const entries = Object.entries(settings) as SettingEntries;
    for (const [name, value] of entries) {
        game.settings.register(MODULE_NAME, name, value);
    }

    return {
        get animationDuration(): number {
            return game.settings.get(MODULE_NAME, SETTING.ANIMATION_DURATION) * 1000;
        },
        get afkOverlayIconPath(): string {
            return game.settings.get(MODULE_NAME, SETTING.AFK_OVERLAY_ICON_PATH);
        },
        get showMirrorButtons(): boolean {
            return game.settings.get(MODULE_NAME, SETTING.SHOW_MIRROR_BUTTONS_HUD);
        },
        get allowAFKToggle(): boolean {
            return game.settings.get(MODULE_NAME, SETTING.ALLOW_AFK_TOGGLE);
        },
        get showAFKStatusInChat(): boolean {
            return game.settings.get(MODULE_NAME, SETTING.SHOW_AFK_STATUS_IN_CHAT);
        },
        get showToggleAFKButton(): boolean {
            return game.settings.get(MODULE_NAME, SETTING.SHOW_TOGGLE_AFK_HUD);
        },
        get allowSpeechBubbles(): boolean {
            return game.settings.get(MODULE_NAME, SETTING.ALLOW_SPEECH_BUBBLES);
        },
        get speechBubbleFontSize(): number {
            return game.settings.get(MODULE_NAME, SETTING.SPEECH_BUBBLE_FONT_SIZE);
        },
    };
}
