import type localization from "@/../static/lang/en.json";

type LocalizationKey<T extends string> = `${typeof MODULE_NAME}.${T}` extends keyof typeof localization ? T : never;

export const MODULE_NAME = "fast-flip";

function localizationKey<T extends string>(key: LocalizationKey<T>) {
    return `${MODULE_NAME}.${key}` as const;
}

export const LOCALIZATION = {
    FLIP_TOKEN_HOTKEY: localizationKey("flip-token-hotkey"),
    FLIP_TOKEN_HINT: localizationKey("flip-token-hint"),
    FLIP_TOKEN_HORIZONTAL_BUTTON: localizationKey("flip-token-horizontal-button"),
    FLIP_TOKEN_VERTICAL_BUTTON: localizationKey("flip-token-vertical-button"),

    FLIP_TILE_HOTKEY: localizationKey("flip-tile-hotkey"),
    FLIP_TILE_HINT: localizationKey("flip-tile-hint"),
    FLIP_TILE_HORIZONTAL_BUTTON: localizationKey("flip-tile-horizontal-button"),
    FLIP_TILE_VERTICAL_BUTTON: localizationKey("flip-tile-vertical-button"),

    TOGGLE_AFK_HOTKEY: localizationKey("toggle-afk-hotkey"),
    TOGGLE_AFK_HINT: localizationKey("toggle-afk-hint"),
    TOGGLE_AFK_BUTTON: localizationKey("toggle-afk-button"),

    SHOW_SPEECH_BUBBLE_HOTKEY: localizationKey("show-speech-bubble-hotkey"),
    SHOW_SPEECH_BUBBLE_HINT: localizationKey("show-speech-bubble-hint"),

    SHOW_MIRROR_BUTTONS: localizationKey("show-flip-buttons"),
    SHOW_MIRROR_BUTTONS_HINT: localizationKey("show-flip-buttons-hint"),

    SHOW_TOGGLE_AFK_BUTTON: localizationKey("show-toggle-afk-button"),
    SHOW_TOGGLE_AFK_HINT: localizationKey("show-toggle-afk-hint"),

    AFK_OVERLAY_ICON_PATH: localizationKey("afk-overlay-icon-path"),
    AFK_OVERLAY_ICON_PATH_HINT: localizationKey("afk-overlay-icon-path-hint"),
    ALLOW_AFK_TOGGLE: localizationKey("allow-afk-toggle"),
    ALLOW_AFK_TOGGLE_HINT: localizationKey("allow-afk-toggle-hint"),
    SHOW_AFK_STATUS_IN_CHAT: localizationKey("show-afk-status-in-chat"),
    SHOW_AFK_STATUS_IN_CHAT_HINT: localizationKey("show-afk-status-in-chat-hint"),
    CHAT_AFK_MESSAGE: localizationKey("chat-afk-message"),
    CHAT_RETURNED_MESSAGE: localizationKey("chat-returned-message"),

    ALLOW_SPEECH_BUBBLES: localizationKey("allow-speech-bubbles"),
    ALLOW_SPEECH_BUBBLES_HINT: localizationKey("allow-speech-bubbles-hint"),
    SPEECH_BUBBLE_FONT_SIZE: localizationKey("speech-bubble-font-size"),
    SPEECH_BUBBLE_FONT_SIZE_HINT: localizationKey("speech-bubble-font-size-hint"),
    ANIMATION_DURATION: localizationKey("animation-duration"),
    ANIMATION_DURATION_HINT: localizationKey("animation-duration-hint"),
} as const;
