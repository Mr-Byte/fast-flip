import {
	LOCALIZATION,
	MODULE_NAME,
	REFRESH_RAISE_HAND_OVERLAYS_HOOK,
	SETTING,
} from "@/common/constants";
import { getIcon } from "@/common/helpers";
import type { ModuleSettings } from "@/common/types";

export type Settings = ModuleSettings;

// World setting changes propagate to every client and run onChange there,
// so this refreshes raised hand overlays for all players when the GM saves.
function refreshRaiseHandOverlays(): void {
	foundry.helpers.Hooks.callAll(REFRESH_RAISE_HAND_OVERLAYS_HOOK);
}

export function registerSettings(game: foundry.Game): Settings {
	game.settings.register(MODULE_NAME, SETTING.ANIMATION_DURATION, {
		name: LOCALIZATION.SETTINGS_FLIP_ANIMATION_DURATION_VALUE,
		hint: LOCALIZATION.SETTINGS_FLIP_ANIMATION_DURATION_HINT,
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
		name: LOCALIZATION.SETTINGS_SPEECH_BUBBLE_ALLOW_VALUE,
		hint: LOCALIZATION.SETTINGS_SPEECH_BUBBLE_ALLOW_HINT,
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	game.settings.register(MODULE_NAME, SETTING.SPEECH_BUBBLE_FONT_SIZE, {
		name: LOCALIZATION.SETTINGS_SPEECH_BUBBLE_FONT_SIZE_VALUE,
		hint: LOCALIZATION.SETTINGS_SPEECH_BUBBLE_FONT_SIZE_HINT,
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
		name: LOCALIZATION.SETTINGS_AFK_OVERLAY_ICON_PATH_VALUE,
		hint: LOCALIZATION.SETTINGS_AFK_OVERLAY_ICON_PATH_HINT,
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
		name: LOCALIZATION.SETTINGS_AFK_ALLOW_VALUE,
		hint: LOCALIZATION.SETTINGS_AFK_ALLOW_HINT,
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	game.settings.register(MODULE_NAME, SETTING.SHOW_AFK_STATUS_IN_CHAT, {
		name: LOCALIZATION.SETTINGS_AFK_SHOW_STATUS_IN_CHAT_VALUE,
		hint: LOCALIZATION.SETTINGS_AFK_SHOW_STATUS_IN_CHAT_HINT,
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	game.settings.register(MODULE_NAME, SETTING.SHOW_MIRROR_BUTTONS_HUD, {
		name: LOCALIZATION.SETTINGS_FLIP_SHOW_VALUE,
		hint: LOCALIZATION.SETTINGS_FLIP_SHOW_HINT,
		scope: "client",
		config: true,
		default: true,
		type: Boolean,
	});

	game.settings.register(MODULE_NAME, SETTING.SHOW_TOGGLE_AFK_HUD, {
		name: LOCALIZATION.SETTINGS_AFK_SHOW_TOGGLE_BUTTON_VALUE,
		hint: LOCALIZATION.SETTINGS_AFK_SHOW_TOGGLE_BUTTON_HINT,
		scope: "client",
		config: true,
		default: true,
		type: Boolean,
	});

	// TODO: Look into why this typing breaks?
	game.settings.register(MODULE_NAME, SETTING.RAISE_HAND_OVERLAY_ICON_PATH, {
		name: LOCALIZATION.SETTINGS_RAISE_HAND_OVERLAY_ICON_PATH_VALUE,
		hint: LOCALIZATION.SETTINGS_RAISE_HAND_OVERLAY_ICON_PATH_HINT,
		scope: "world",
		config: true,
		type: String,
		filePicker: "imagevideo",
		default: getIcon("raised-hand"),
		onChange: refreshRaiseHandOverlays,
	} as foundry.helpers.ClientSettings.RegisterData<
		string,
		typeof MODULE_NAME,
		foundry.helpers.ClientSettings.KeyFor<typeof MODULE_NAME>
	>);

	// Defaults are the palm center of the bundled Font Awesome hand icon.
	game.settings.register(MODULE_NAME, SETTING.RAISE_HAND_NUMBER_ANCHOR_X, {
		name: LOCALIZATION.SETTINGS_RAISE_HAND_NUMBER_ANCHOR_X_VALUE,
		hint: LOCALIZATION.SETTINGS_RAISE_HAND_NUMBER_ANCHOR_X_HINT,
		scope: "world",
		config: true,
		default: 0.575,
		type: Number,
		range: {
			min: 0,
			max: 1,
			step: 0.005,
		},
		onChange: refreshRaiseHandOverlays,
	});

	game.settings.register(MODULE_NAME, SETTING.RAISE_HAND_NUMBER_ANCHOR_Y, {
		name: LOCALIZATION.SETTINGS_RAISE_HAND_NUMBER_ANCHOR_Y_VALUE,
		hint: LOCALIZATION.SETTINGS_RAISE_HAND_NUMBER_ANCHOR_Y_HINT,
		scope: "world",
		config: true,
		default: 0.73,
		type: Number,
		range: {
			min: 0,
			max: 1,
			step: 0.005,
		},
		onChange: refreshRaiseHandOverlays,
	});

	game.settings.register(MODULE_NAME, SETTING.ALLOW_RAISE_HAND, {
		name: LOCALIZATION.SETTINGS_RAISE_HAND_ALLOW_VALUE,
		hint: LOCALIZATION.SETTINGS_RAISE_HAND_ALLOW_HINT,
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	game.settings.register(MODULE_NAME, SETTING.SHOW_RAISE_HAND_STATUS_IN_CHAT, {
		name: LOCALIZATION.SETTINGS_RAISE_HAND_SHOW_STATUS_IN_CHAT_VALUE,
		hint: LOCALIZATION.SETTINGS_RAISE_HAND_SHOW_STATUS_IN_CHAT_HINT,
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(MODULE_NAME, SETTING.SHOW_TOGGLE_RAISE_HAND_HUD, {
		name: LOCALIZATION.SETTINGS_RAISE_HAND_SHOW_TOGGLE_BUTTON_VALUE,
		hint: LOCALIZATION.SETTINGS_RAISE_HAND_SHOW_TOGGLE_BUTTON_HINT,
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
		get allowRaiseHand(): boolean {
			return game.settings.get(MODULE_NAME, SETTING.ALLOW_RAISE_HAND);
		},
		get showRaiseHandStatusInChat(): boolean {
			return game.settings.get(
				MODULE_NAME,
				SETTING.SHOW_RAISE_HAND_STATUS_IN_CHAT,
			);
		},
		get showToggleRaiseHandHud(): boolean {
			return game.settings.get(MODULE_NAME, SETTING.SHOW_TOGGLE_RAISE_HAND_HUD);
		},
		get raiseHandOverlayIconPath(): string {
			return game.settings.get(
				MODULE_NAME,
				SETTING.RAISE_HAND_OVERLAY_ICON_PATH,
			);
		},
		get raiseHandNumberAnchorX(): number {
			return game.settings.get(MODULE_NAME, SETTING.RAISE_HAND_NUMBER_ANCHOR_X);
		},
		get raiseHandNumberAnchorY(): number {
			return game.settings.get(MODULE_NAME, SETTING.RAISE_HAND_NUMBER_ANCHOR_Y);
		},
	} as const;
}
