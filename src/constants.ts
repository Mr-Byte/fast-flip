export const MODULE_NAME = "fast-flip";

export const LOCALIZATION = {
    MIRROR_HORIZONTAL_HOTKEY: moduleKey("mirror-horizontal-hotkey"),
    MIRROR_HORIZONTAL_HINT: moduleKey("mirror-horizontal-hint"),
    MIRROR_HORIZONTAL_BUTTON: moduleKey("mirror-horizontal-button"),
    MIRROR_VERTICAL_HOTKEY: moduleKey("mirror-vertical-hotkey"),
    MIRROR_VERTICAL_HINT: moduleKey("mirror-vertical-hint"),
    MIRROR_VERTICAL_BUTTON: moduleKey("mirror-vertical-button"),
    TOGGLE_AFK_HOTKEY: moduleKey("toggle-afk-hotkey"),
    TOGGLE_AFK_HINT: moduleKey("toggle-afk-hint"),
    TOGGLE_AFK_BUTTON: moduleKey("toggle-afk-button"),
    SHOW_MIRROR_BUTTONS: moduleKey("show-mirror-buttons"),
    SHOW_MIRROR_BUTTONS_HINT: moduleKey("show-mirror-buttons-hint"),
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
    SHOW_SPEECH_BUBBLE_HOTKEY: moduleKey("show-speech-bubble-hotkey"),
    SHOW_SPEECH_BUBBLE_HINT: moduleKey("show-speech-bubble-hint"),
    ALLOW_SPEECH_BUBBLES: moduleKey("allow-speech-bubbles"),
    ALLOW_SPEECH_BUBBLES_HINT: moduleKey("allow-speech-bubbles-hint"),
    SPEECH_BUBBLE_FONT_SIZE: moduleKey("speech-bubble-font-size"),
    SPEECH_BUBBLE_FONT_SIZE_HINT: moduleKey("speech-bubble-font-size-hint"),
    ANIMATION_DURATION: moduleKey("animation-duration"),
    ANIMATION_DURATION_HINT: moduleKey("animation-duration-hint"),
} as const;

export function moduleKey<K extends string>(
    key: K,
): `${typeof MODULE_NAME}.${K}` {
    return `${MODULE_NAME}.${key}`;
}
