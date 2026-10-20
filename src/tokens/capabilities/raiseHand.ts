import {
	LOCALIZATION,
	MODULE_NAME,
	REFRESH_RAISE_HAND_OVERLAYS_HOOK,
} from "@/common/constants";
import { forcedDeletion, getIcon, hasModuleFlagChange } from "@/common/helpers";
import type { Settings } from "@/common/settings";
import { injectNumberAnchorPreview } from "@/tokens/capabilities/_components/numberAnchorPreview";
import { RaiseHandOverlay } from "@/tokens/capabilities/_components/raiseHandOverlay";
import type { Capability } from "@/tokens/capabilities/capability";

import Hooks = foundry.helpers.Hooks;

export const RAISED_HAND_AT_KEY = "hand-raised-at";
export const RAISED_HAND_BY_KEY = "hand-raised-by";

export default function raiseHand(settings: Settings): Capability {
	Hooks.on("updateToken", (_document, change) => {
		if (!hasModuleFlagChange(change, RAISED_HAND_AT_KEY)) {
			return;
		}

		void refreshAllOverlays();
	});

	Hooks.on("drawToken", async (token) => {
		if (!token) {
			return;
		}

		await updateSingleOverlay(token);
	});

	Hooks.on(REFRESH_RAISE_HAND_OVERLAYS_HOOK, () => {
		void refreshAllOverlays();
	});

	Hooks.on("updateUser", (_user, change) => {
		if (!("color" in change)) {
			return;
		}

		void refreshAllOverlays();
	});

	Hooks.on("renderSettingsConfig", (_app, element) => {
		injectNumberAnchorPreview(element);
	});

	Hooks.on("preCreateToken", (document) => {
		if (typeof document.getFlag(MODULE_NAME, RAISED_HAND_AT_KEY) !== "number") {
			return;
		}

		document.updateSource({
			flags: {
				[MODULE_NAME]: {
					[RAISED_HAND_AT_KEY]: forcedDeletion<number>(),
					[RAISED_HAND_BY_KEY]: forcedDeletion<string>(),
				},
			},
		});
	});

	Hooks.on("deleteToken", (document) => {
		if (typeof document.getFlag(MODULE_NAME, RAISED_HAND_AT_KEY) !== "number") {
			return;
		}

		void refreshAllOverlays();
	});

	return {
		hudButtonGroups: [
			{
				side: "right",
				buttons: [
					{
						title: LOCALIZATION.TEXT_RAISE_HAND_TOGGLE_BUTTON,
						icon: getIcon("toggle-raise-hand"),
						onClick: () => void toggleRaiseHand(),
						shouldShow: (token) =>
							settings.allowRaiseHand &&
							settings.showToggleRaiseHandHud &&
							token.isOwner &&
							(token.actor?.hasPlayerOwner ?? false),
					},
				],
			},
		],
		keybinds: [
			{
				name: "toggleRaiseHand",
				config: {
					name: LOCALIZATION.KEYBINDS_RAISE_HAND_TOGGLE_HOTKEY,
					hint: LOCALIZATION.KEYBINDS_RAISE_HAND_TOGGLE_HINT,
					editable: [{ key: "KeyH", modifiers: ["SHIFT"] }],
					onDown: () => void toggleRaiseHand(),
					precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
					restricted: false,
					reservedModifiers: [],
					repeat: false,
				},
			},
			{
				name: "lowerAllHands",
				config: {
					name: LOCALIZATION.KEYBINDS_LOWER_ALL_HANDS_HOTKEY,
					hint: LOCALIZATION.KEYBINDS_LOWER_ALL_HANDS_HINT,
					editable: [{ key: "KeyH", modifiers: ["SHIFT", "ALT"] }],
					onDown: () => void lowerAllHands(),
					precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
					restricted: true,
					reservedModifiers: [],
					repeat: false,
				},
			},
		],
	};

	async function toggleRaiseHand() {
		if (!settings.allowRaiseHand) {
			return;
		}

		const controlledTokens = game.canvas?.tokens?.controlled ?? [];
		for (const token of controlledTokens) {
			if (!token.isOwner || !token.actor?.hasPlayerOwner) {
				continue;
			}

			const raisedAt = token.document.getFlag(MODULE_NAME, RAISED_HAND_AT_KEY);

			if (typeof raisedAt === "number") {
				await lowerTokenHand(token);
			} else {
				await raiseTokenHand(token);
			}
		}
	}

	async function lowerAllHands() {
		if (!game.user?.isGM) {
			return;
		}

		const tokens = game.canvas?.tokens?.placeables ?? [];
		for (const token of tokens) {
			const raisedAt = token.document.getFlag(MODULE_NAME, RAISED_HAND_AT_KEY);

			if (typeof raisedAt === "number") {
				await unsetRaisedHandFlags(token);
			}
		}
	}

	async function unsetRaisedHandFlags(
		token: foundry.canvas.placeables.Token,
	): Promise<void> {
		await token.document.update({
			flags: {
				[MODULE_NAME]: {
					[RAISED_HAND_AT_KEY]: forcedDeletion<number>(),
					[RAISED_HAND_BY_KEY]: forcedDeletion<string>(),
				},
			},
		});
	}

	async function raiseTokenHand(
		token: foundry.canvas.placeables.Token,
	): Promise<void> {
		await token.document.update({
			flags: {
				[MODULE_NAME]: {
					[RAISED_HAND_AT_KEY]: game.time?.serverTime ?? Date.now(),
					[RAISED_HAND_BY_KEY]: game.user?.id ?? "",
				},
			},
		});

		if (!settings.showRaiseHandStatusInChat) {
			return;
		}

		await foundry.documents.ChatMessage.create({
			style: CONST.CHAT_MESSAGE_STYLES.OOC,
			speaker: { token: token.id },
			content: game.i18n?.format(LOCALIZATION.TEXT_RAISE_HAND_CHAT_MESSAGE, {
				name: token.name,
			}),
		});
	}

	async function lowerTokenHand(
		token: foundry.canvas.placeables.Token,
	): Promise<void> {
		await unsetRaisedHandFlags(token);

		if (!settings.showRaiseHandStatusInChat) {
			return;
		}

		await foundry.documents.ChatMessage.create({
			style: CONST.CHAT_MESSAGE_STYLES.OOC,
			speaker: { token: token.id },
			content: game.i18n?.format(
				LOCALIZATION.TEXT_RAISE_HAND_CHAT_LOWERED_MESSAGE,
				{
					name: token.name,
				},
			),
		});
	}

	function getQueuePositions(): Map<string, number> {
		const tokens = game.canvas?.tokens?.placeables ?? [];
		const raised = tokens
			.map((token) => ({
				id: token.id,
				raisedAt: token.document.getFlag(MODULE_NAME, RAISED_HAND_AT_KEY),
			}))
			.filter(
				(entry): entry is { id: string; raisedAt: number } =>
					typeof entry.raisedAt === "number" && entry.id !== null,
			)
			.sort((a, b) => a.raisedAt - b.raisedAt || a.id.localeCompare(b.id));

		return new Map(raised.map(({ id }, index) => [id, index + 1]));
	}

	async function refreshAllOverlays(): Promise<void> {
		const positions = getQueuePositions();
		const tokens = game.canvas?.tokens?.placeables ?? [];
		for (const token of tokens) {
			await applyOverlay(token, positions.get(token.id ?? ""));
		}
	}

	async function updateSingleOverlay(
		token: foundry.canvas.placeables.Token,
	): Promise<void> {
		const positions = getQueuePositions();
		await applyOverlay(token, positions.get(token.id ?? ""));
	}

	async function applyOverlay(
		token: foundry.canvas.placeables.Token,
		position: number | undefined,
	): Promise<void> {
		const overlay =
			token.getChildByName<RaiseHandOverlay>(RaiseHandOverlay.NAME, true) ??
			new RaiseHandOverlay(settings, token);

		if (position === undefined) {
			overlay.hide();
			return;
		}

		const raisedBy = token.document.getFlag(MODULE_NAME, RAISED_HAND_BY_KEY);
		const color = raisedBy ? (game.users?.get(raisedBy)?.color ?? null) : null;

		await overlay.show(position, position === 1, color);
	}
}
