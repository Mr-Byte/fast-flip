import {
	type LocalizationKeys,
	MODULE_NAME,
	type SettingsKeys,
} from "@/common/types";

export { MODULE_NAME } from "@/common/types";

function moduleKey<T extends string>(key: T) {
	return `${MODULE_NAME}.${key}` as const;
}

// Fired on every client when a world setting that affects raised hand
// rendering changes, so all overlays redraw with the new values.
export const REFRESH_RAISE_HAND_OVERLAYS_HOOK =
	`${MODULE_NAME}.refreshRaiseHandOverlays` as const;

export const SETTING: SettingsKeys = {
	ANIMATION_DURATION: "animation-duration",
	ALLOW_AFK_TOGGLE: "allow-afk-toggle",
	SHOW_AFK_STATUS_IN_CHAT: "show-afk-status-in-chat",
	SHOW_MIRROR_BUTTONS_HUD: "show-mirror-buttons-hud",
	SHOW_TOGGLE_AFK_HUD: "show-toggle-afk-hud",
	AFK_OVERLAY_ICON_PATH: "afk-overlay-icon-path",
	ALLOW_SPEECH_BUBBLES: "allow-speech-bubbles",
	SPEECH_BUBBLE_FONT_SIZE: "speech-bubble-font-size",
	ALLOW_RAISE_HAND: "allow-raise-hand",
	SHOW_RAISE_HAND_STATUS_IN_CHAT: "show-raise-hand-status-in-chat",
	SHOW_TOGGLE_RAISE_HAND_HUD: "show-toggle-raise-hand-hud",
	RAISE_HAND_OVERLAY_ICON_PATH: "raise-hand-overlay-icon-path",
	RAISE_HAND_NUMBER_ANCHOR_X: "raise-hand-number-anchor-x",
	RAISE_HAND_NUMBER_ANCHOR_Y: "raise-hand-number-anchor-y",
};

export const LOCALIZATION: LocalizationKeys = {
	KEYBINDS_FLIP_TOKEN_HOTKEY: moduleKey("keybinds.flip-token.hotkey"),
	KEYBINDS_FLIP_TOKEN_HINT: moduleKey("keybinds.flip-token.hint"),
	KEYBINDS_FLIP_TILE_HOTKEY: moduleKey("keybinds.flip-tile.hotkey"),
	KEYBINDS_FLIP_TILE_HINT: moduleKey("keybinds.flip-tile.hint"),
	KEYBINDS_AFK_TOGGLE_HOTKEY: moduleKey("keybinds.afk-toggle.hotkey"),
	KEYBINDS_AFK_TOGGLE_HINT: moduleKey("keybinds.afk-toggle.hint"),
	KEYBINDS_SHOW_SPEECH_BUBBLE_HOTKEY: moduleKey(
		"keybinds.show-speech-bubble.hotkey",
	),
	KEYBINDS_SHOW_SPEECH_BUBBLE_HINT: moduleKey(
		"keybinds.show-speech-bubble.hint",
	),
	KEYBINDS_RAISE_HAND_TOGGLE_HOTKEY: moduleKey(
		"keybinds.raise-hand-toggle.hotkey",
	),
	KEYBINDS_RAISE_HAND_TOGGLE_HINT: moduleKey("keybinds.raise-hand-toggle.hint"),
	KEYBINDS_LOWER_ALL_HANDS_HOTKEY: moduleKey("keybinds.lower-all-hands.hotkey"),
	KEYBINDS_LOWER_ALL_HANDS_HINT: moduleKey("keybinds.lower-all-hands.hint"),
	SETTINGS_AFK_SHOW_TOGGLE_BUTTON_VALUE: moduleKey(
		"settings.afk.show-toggle-button.value",
	),
	SETTINGS_AFK_SHOW_TOGGLE_BUTTON_HINT: moduleKey(
		"settings.afk.show-toggle-button.hint",
	),
	SETTINGS_AFK_ALLOW_VALUE: moduleKey("settings.afk.allow.value"),
	SETTINGS_AFK_ALLOW_HINT: moduleKey("settings.afk.allow.hint"),
	SETTINGS_AFK_OVERLAY_ICON_PATH_VALUE: moduleKey(
		"settings.afk.overlay-icon-path.value",
	),
	SETTINGS_AFK_OVERLAY_ICON_PATH_HINT: moduleKey(
		"settings.afk.overlay-icon-path.hint",
	),
	SETTINGS_AFK_SHOW_STATUS_IN_CHAT_VALUE: moduleKey(
		"settings.afk.show-status-in-chat.value",
	),
	SETTINGS_AFK_SHOW_STATUS_IN_CHAT_HINT: moduleKey(
		"settings.afk.show-status-in-chat.hint",
	),
	SETTINGS_SPEECH_BUBBLE_ALLOW_VALUE: moduleKey(
		"settings.speech-bubble.allow.value",
	),
	SETTINGS_SPEECH_BUBBLE_ALLOW_HINT: moduleKey(
		"settings.speech-bubble.allow.hint",
	),
	SETTINGS_SPEECH_BUBBLE_FONT_SIZE_VALUE: moduleKey(
		"settings.speech-bubble.font-size.value",
	),
	SETTINGS_SPEECH_BUBBLE_FONT_SIZE_HINT: moduleKey(
		"settings.speech-bubble.font-size.hint",
	),
	SETTINGS_FLIP_SHOW_VALUE: moduleKey("settings.flip.show.value"),
	SETTINGS_FLIP_SHOW_HINT: moduleKey("settings.flip.show.hint"),
	SETTINGS_FLIP_ANIMATION_DURATION_VALUE: moduleKey(
		"settings.flip.animation-duration.value",
	),
	SETTINGS_FLIP_ANIMATION_DURATION_HINT: moduleKey(
		"settings.flip.animation-duration.hint",
	),
	SETTINGS_RAISE_HAND_SHOW_TOGGLE_BUTTON_VALUE: moduleKey(
		"settings.raise-hand.show-toggle-button.value",
	),
	SETTINGS_RAISE_HAND_SHOW_TOGGLE_BUTTON_HINT: moduleKey(
		"settings.raise-hand.show-toggle-button.hint",
	),
	SETTINGS_RAISE_HAND_ALLOW_VALUE: moduleKey("settings.raise-hand.allow.value"),
	SETTINGS_RAISE_HAND_ALLOW_HINT: moduleKey("settings.raise-hand.allow.hint"),
	SETTINGS_RAISE_HAND_OVERLAY_ICON_PATH_VALUE: moduleKey(
		"settings.raise-hand.overlay-icon-path.value",
	),
	SETTINGS_RAISE_HAND_OVERLAY_ICON_PATH_HINT: moduleKey(
		"settings.raise-hand.overlay-icon-path.hint",
	),
	SETTINGS_RAISE_HAND_NUMBER_ANCHOR_X_VALUE: moduleKey(
		"settings.raise-hand.number-anchor-x.value",
	),
	SETTINGS_RAISE_HAND_NUMBER_ANCHOR_X_HINT: moduleKey(
		"settings.raise-hand.number-anchor-x.hint",
	),
	SETTINGS_RAISE_HAND_NUMBER_ANCHOR_Y_VALUE: moduleKey(
		"settings.raise-hand.number-anchor-y.value",
	),
	SETTINGS_RAISE_HAND_NUMBER_ANCHOR_Y_HINT: moduleKey(
		"settings.raise-hand.number-anchor-y.hint",
	),
	SETTINGS_RAISE_HAND_NUMBER_PREVIEW: moduleKey(
		"settings.raise-hand.number-preview",
	),
	SETTINGS_RAISE_HAND_SHOW_STATUS_IN_CHAT_VALUE: moduleKey(
		"settings.raise-hand.show-status-in-chat.value",
	),
	SETTINGS_RAISE_HAND_SHOW_STATUS_IN_CHAT_HINT: moduleKey(
		"settings.raise-hand.show-status-in-chat.hint",
	),
	TEXT_AFK_TOGGLE_BUTTON: moduleKey("text.afk.toggle-button"),
	TEXT_FLIP_TOKEN_HORIZONTAL_BUTTON: moduleKey(
		"text.flip-token.horizontal-button",
	),
	TEXT_FLIP_TOKEN_VERTICAL_BUTTON: moduleKey("text.flip-token.vertical-button"),
	TEXT_FLIP_TILE_HORIZONTAL_BUTTON: moduleKey(
		"text.flip-tile.horizontal-button",
	),
	TEXT_FLIP_TILE_VERTICAL_BUTTON: moduleKey("text.flip-tile.vertical-button"),
	TEXT_AFK_CHAT_MESSAGE: moduleKey("text.afk.chat.message"),
	TEXT_AFK_CHAT_RETURNED_MESSAGE: moduleKey("text.afk.chat.returned-message"),
	TEXT_RAISE_HAND_TOGGLE_BUTTON: moduleKey("text.raise-hand.toggle-button"),
	TEXT_RAISE_HAND_CHAT_MESSAGE: moduleKey("text.raise-hand.chat.message"),
	TEXT_RAISE_HAND_CHAT_LOWERED_MESSAGE: moduleKey(
		"text.raise-hand.chat.lowered-message",
	),
};
