import { MODULE_NAME, type LocalizationKeys, type SettingsKeys } from "@/common/types";
export { MODULE_NAME } from "@/common/types";

function moduleKey<T extends string>(key: T) {
    return `${MODULE_NAME}.${key}` as const;
}

export const SETTING: SettingsKeys = {
    ANIMATION_DURATION: "animation-duration",
    ALLOW_AFK_TOGGLE: "allow-afk-toggle",
    SHOW_AFK_STATUS_IN_CHAT: "show-afk-status-in-chat",
    SHOW_MIRROR_BUTTONS_HUD: "show-mirror-buttons-hud",
    SHOW_TOGGLE_AFK_HUD: "show-toggle-afk-hud",
    AFK_OVERLAY_ICON_PATH: "afk-overlay-icon-path",
    ALLOW_SPEECH_BUBBLES: "allow-speech-bubbles",
    SPEECH_BUBBLE_FONT_SIZE: "speech-bubble-font-size",
};

export const LOCALIZATION: LocalizationKeys = {
    KEYBINDS_FLIP_TOKEN_HOTKEY: moduleKey("keybinds.flip-token.hotkey"),
    KEYBINDS_FLIP_TOKEN_HINT: moduleKey("keybinds.flip-token.hint"),
    KEYBINDS_FLIP_TILE_HOTKEY: moduleKey("keybinds.flip-tile.hotkey"),
    KEYBINDS_FLIP_TILE_HINT: moduleKey("keybinds.flip-tile.hint"),
    KEYBINDS_AFK_TOGGLE_HOTKEY: moduleKey("keybinds.afk-toggle.hotkey"),
    KEYBINDS_AFK_TOGGLE_HINT: moduleKey("keybinds.afk-toggle.hint"),
    KEYBINDS_SHOW_SPEECH_BUBBLE_HOTKEY: moduleKey("keybinds.show-speech-bubble.hotkey"),
    KEYBINDS_SHOW_SPEECH_BUBBLE_HINT: moduleKey("keybinds.show-speech-bubble.hint"),
    SETTINGS_AFK_SHOW_TOGGLE_BUTTON_VALUE: moduleKey("settings.afk.show-toggle-button.value"),
    SETTINGS_AFK_SHOW_TOGGLE_BUTTON_HINT: moduleKey("settings.afk.show-toggle-button.hint"),
    SETTINGS_AFK_ALLOW_VALUE: moduleKey("settings.afk.allow.value"),
    SETTINGS_AFK_ALLOW_HINT: moduleKey("settings.afk.allow.hint"),
    SETTINGS_AFK_OVERLAY_ICON_PATH_VALUE: moduleKey("settings.afk.overlay-icon-path.value"),
    SETTINGS_AFK_OVERLAY_ICON_PATH_HINT: moduleKey("settings.afk.overlay-icon-path.hint"),
    SETTINGS_AFK_SHOW_STATUS_IN_CHAT_VALUE: moduleKey("settings.afk.show-status-in-chat.value"),
    SETTINGS_AFK_SHOW_STATUS_IN_CHAT_HINT: moduleKey("settings.afk.show-status-in-chat.hint"),
    SETTINGS_SPEECH_BUBBLE_ALLOW_VALUE: moduleKey("settings.speech-bubble.allow.value"),
    SETTINGS_SPEECH_BUBBLE_ALLOW_HINT: moduleKey("settings.speech-bubble.allow.hint"),
    SETTINGS_SPEECH_BUBBLE_FONT_SIZE_VALUE: moduleKey("settings.speech-bubble.font-size.value"),
    SETTINGS_SPEECH_BUBBLE_FONT_SIZE_HINT: moduleKey("settings.speech-bubble.font-size.hint"),
    SETTINGS_FLIP_SHOW_VALUE: moduleKey("settings.flip.show.value"),
    SETTINGS_FLIP_SHOW_HINT: moduleKey("settings.flip.show.hint"),
    SETTINGS_FLIP_ANIMATION_DURATION_VALUE: moduleKey("settings.flip.animation-duration.value"),
    SETTINGS_FLIP_ANIMATION_DURATION_HINT: moduleKey("settings.flip.animation-duration.hint"),
    TEXT_AFK_TOGGLE_BUTTON: moduleKey("text.afk.toggle-button"),
    TEXT_FLIP_TOKEN_HORIZONTAL_BUTTON: moduleKey("text.flip-token.horizontal-button"),
    TEXT_FLIP_TOKEN_VERTICAL_BUTTON: moduleKey("text.flip-token.vertical-button"),
    TEXT_FLIP_TILE_HORIZONTAL_BUTTON: moduleKey("text.flip-tile.horizontal-button"),
    TEXT_FLIP_TILE_VERTICAL_BUTTON: moduleKey("text.flip-tile.vertical-button"),
    TEXT_AFK_CHAT_MESSAGE: moduleKey("text.afk.chat.message"),
    TEXT_AFK_CHAT_RETURNED_MESSAGE: moduleKey("text.afk.chat.returned-message"),
};
