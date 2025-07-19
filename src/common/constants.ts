import type { Identity, KebabToShoutingSnake, WithoutModuleName } from "@/common/types";
import type localization from "@/../static/lang/en.json";

export const MODULE_NAME = "fast-flip";

function moduleKey<T extends string>(key: T) {
    return `${MODULE_NAME}.${key}` as const;
}

type Settings = Identity<{
    [K in keyof SettingConfig as KebabToShoutingSnake<WithoutModuleName<K>>]: WithoutModuleName<K>;
}>;

export const SETTING: Settings = {
    ANIMATION_DURATION: "animation-duration",
    ALLOW_AFK_TOGGLE: "allow-afk-toggle",
    SHOW_AFK_STATUS_IN_CHAT: "show-afk-status-in-chat",
    SHOW_MIRROR_BUTTONS_HUD: "show-mirror-buttons-hud",
    SHOW_TOGGLE_AFK_HUD: "show-toggle-afk-hud",
    AFK_OVERLAY_ICON_PATH: "afk-overlay-icon-path",
    ALLOW_SPEECH_BUBBLES: "allow-speech-bubbles",
    SPEECH_BUBBLE_FONT_SIZE: "speech-bubble-font-size",
};

type LocalizationKeys = Identity<{
    [K in keyof typeof localization as KebabToShoutingSnake<WithoutModuleName<K>>]: K;
}>;

export const LOCALIZATION: LocalizationKeys = {
    FLIP_TOKEN_HOTKEY: moduleKey("flip-token-hotkey"),
    FLIP_TOKEN_HINT: moduleKey("flip-token-hint"),
    FLIP_TOKEN_HORIZONTAL_BUTTON: moduleKey("flip-token-horizontal-button"),
    FLIP_TOKEN_VERTICAL_BUTTON: moduleKey("flip-token-vertical-button"),
    FLIP_TILE_HOTKEY: moduleKey("flip-tile-hotkey"),
    FLIP_TILE_HINT: moduleKey("flip-tile-hint"),
    FLIP_TILE_HORIZONTAL_BUTTON: moduleKey("flip-tile-horizontal-button"),
    FLIP_TILE_VERTICAL_BUTTON: moduleKey("flip-tile-vertical-button"),
    TOGGLE_AFK_HOTKEY: moduleKey("toggle-afk-hotkey"),
    TOGGLE_AFK_HINT: moduleKey("toggle-afk-hint"),
    TOGGLE_AFK_BUTTON: moduleKey("toggle-afk-button"),
    SHOW_SPEECH_BUBBLE_HOTKEY: moduleKey("show-speech-bubble-hotkey"),
    SHOW_SPEECH_BUBBLE_HINT: moduleKey("show-speech-bubble-hint"),
    SHOW_FLIP_BUTTONS: moduleKey("show-flip-buttons"),
    SHOW_FLIP_BUTTONS_HINT: moduleKey("show-flip-buttons-hint"),
    SHOW_TOGGLE_AFK_BUTTON: moduleKey("show-toggle-afk-button"),
    SHOW_TOGGLE_AFK_HINT: moduleKey("show-toggle-afk-hint"),
    AFK_OVERLAY_ICON_PATH: moduleKey("afk-overlay-icon-path"),
    AFK_OVERLAY_ICON_PATH_HINT: moduleKey("afk-overlay-icon-path-hint"),
    ALLOW_AFK_TOGGLE: moduleKey("allow-afk-toggle"),
    ALLOW_AFK_TOGGLE_HINT: moduleKey("allow-afk-toggle-hint"),
    SHOW_AFK_STATUS_IN_CHAT: moduleKey("show-afk-status-in-chat"),
    SHOW_AFK_STATUS_IN_CHAT_HINT: moduleKey("show-afk-status-in-chat-hint"),
    CHAT_AFK_MESSAGE: moduleKey("chat-afk-message"),
    CHAT_RETURNED_MESSAGE: moduleKey("chat-returned-message"),
    ALLOW_SPEECH_BUBBLES: moduleKey("allow-speech-bubbles"),
    ALLOW_SPEECH_BUBBLES_HINT: moduleKey("allow-speech-bubbles-hint"),
    SPEECH_BUBBLE_FONT_SIZE: moduleKey("speech-bubble-font-size"),
    SPEECH_BUBBLE_FONT_SIZE_HINT: moduleKey("speech-bubble-font-size-hint"),
    ANIMATION_DURATION: moduleKey("animation-duration"),
    ANIMATION_DURATION_HINT: moduleKey("animation-duration-hint"),
};
