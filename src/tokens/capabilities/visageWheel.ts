import { LOCALIZATION } from "@/common/constants";
import type { Settings } from "@/common/settings";
import type { VisageApi, VisageEntry, VisageMode } from "@/common/types/visage";
import {
	getVisageApi,
	isVisageActive,
	VISAGE_MODULE_ID,
} from "@/common/visage";
import { createHoldWheel } from "@/tokens/capabilities/_components/holdWheel";
import type { WheelEntry } from "@/tokens/capabilities/_components/imageWheel";
import type { Capability } from "@/tokens/capabilities/capability";

type Token = foundry.canvas.placeables.Token;

const KEYBIND_NAME = "pickVisage";

const REVERT_ICON = "fa-solid fa-rotate-left";
const IDENTITY_ICON = "fa-solid fa-masks-theater";
const OVERLAY_ICON = "fa-solid fa-layer-group";

const OVERLAY_CLASS = "fast-flip-image-wheel__slice--overlay";
const ACTION_CLASS = "fast-flip-image-wheel__slice--action";

type VisageWheelEntry = WheelEntry &
	(
		| { kind: "revert"; layerIds: string[] }
		| { kind: "visage"; id: string; mode: VisageMode }
	);

export default function visageWheel(settings: Settings): Capability {
	if (!isVisageActive()) {
		return { hudButtonGroups: [] };
	}

	let warnedMissingApi = false;

	const hasApi = (): boolean => {
		if (getVisageApi()) {
			return true;
		}

		if (!warnedMissingApi) {
			warnedMissingApi = true;
			console.warn(
				"Fast Flip! Token Tools | Visage is active but its API is missing or has changed. The visage wheel is disabled.",
			);
		}

		return false;
	};

	const handlers = createHoldWheel<VisageWheelEntry>({
		keybindName: KEYBIND_NAME,
		isEnabled: () => settings.allowVisageWheel && !isLockedToGM() && hasApi(),
		minEntries: 1,
		loadEntries: async (token) => {
			const api = getVisageApi();

			return api ? buildEntries(api, token, settings.visageWheelTag) : [];
		},
		onPick: async (token, entry) => {
			const api = getVisageApi();

			if (!api) {
				return;
			}

			if (entry.kind === "revert") {
				await revert(api, token, entry.layerIds);
				return;
			}

			// Read the state again: it may have changed while the wheel was open.
			if (!api.isActive(token, entry.id)) {
				await api.apply(token, entry.id);
				return;
			}

			// Picking the current identity again keeps it. Removing it would
			// drop the token back to its default look; "Revert" does that.
			if (entry.mode === "overlay") {
				await api.remove(token, entry.id);
			}
		},
		failureMessage: "Failed to change the token's visage.",
	});

	return {
		hudButtonGroups: [],
		keybinds: [
			{
				name: KEYBIND_NAME,
				config: {
					name: LOCALIZATION.KEYBINDS_PICK_VISAGE_HOTKEY,
					hint: LOCALIZATION.KEYBINDS_PICK_VISAGE_HINT,
					editable: [{ key: "KeyV" }],
					...handlers,
					precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
					restricted: false,
					reservedModifiers: [],
					repeat: false,
				},
			},
		],
	};
}

// Visage's "GM only mode" refuses every change a player makes, so the wheel
// stays closed rather than offering picks that would all fail.
function isLockedToGM(): boolean {
	if (game.user?.isGM) {
		return false;
	}

	try {
		return game.settings?.get(VISAGE_MODULE_ID, "gmOnlyMode") ?? false;
	} catch {
		// The setting was renamed or removed; let Visage decide on apply.
		return false;
	}
}

function buildEntries(
	api: VisageApi,
	token: Token,
	tag: string,
): VisageWheelEntry[] {
	const wantedTag = tag.trim().toLowerCase();

	// The tag only filters global visages. An actor's own visages are few
	// and always relevant to it.
	const visages = api.getAvailable(token).filter(
		(visage) =>
			// Visage hides binned global visages itself, but not binned
			// local ones.
			!visage.deleted &&
			(visage.type === "local" ||
				!wantedTag ||
				(visage.tags ?? []).some(
					(visageTag) => visageTag.trim().toLowerCase() === wantedTag,
				)),
	);

	const entries: VisageWheelEntry[] = visages.map((visage) => {
		// Visage applies the same default when an entry has no mode.
		const mode =
			visage.mode ?? (visage.type === "local" ? "identity" : "overlay");
		const image = representativeImage(api, visage);

		return {
			kind: "visage",
			id: visage.id,
			mode,
			label: visage.label,
			active: api.isActive(token, visage.id),
			...(image
				? { image }
				: { icon: mode === "overlay" ? OVERLAY_ICON : IDENTITY_ICON }),
			...(mode === "overlay" ? { className: OVERLAY_CLASS } : {}),
		};
	});

	const layerIds = entries.flatMap((entry) =>
		entry.kind === "visage" && entry.active ? [entry.id] : [],
	);
	const canRevert = game.user?.isGM
		? hasActiveStack(token)
		: layerIds.length > 0;

	if (canRevert) {
		entries.unshift({
			kind: "revert",
			layerIds,
			label: game.i18n?.localize(LOCALIZATION.TEXT_VISAGE_WHEEL_REVERT) ?? "",
			icon: REVERT_ICON,
			active: false,
			className: ACTION_CLASS,
		});
	}

	return entries;
}

// Visage's revert API skips its visibility checks, so only GMs use it.
// Players remove the active layers they can see instead, which keeps hidden
// visages the GM applied in place.
async function revert(
	api: VisageApi,
	token: Token,
	layerIds: string[],
): Promise<void> {
	if (game.user?.isGM) {
		await api.revert(token);
		return;
	}

	for (const layerId of layerIds) {
		if (api.isActive(token, layerId)) {
			await api.remove(token, layerId);
		}
	}
}

function representativeImage(
	api: VisageApi,
	visage: VisageEntry,
): string | undefined {
	const image =
		api.Data?.getRepresentativeImage?.(visage.changes) ||
		visage.changes?.texture?.src ||
		"";

	// A wildcard path would show one random match, which is misleading.
	if (!image || image.includes("*") || image.includes("?")) {
		return undefined;
	}

	return image;
}

// Unlike the wheel's entries, the stack includes visages the user can't see.
function hasActiveStack(token: Token): boolean {
	const stack = foundry.utils.getProperty(
		token.document,
		`flags.${VISAGE_MODULE_ID}.activeStack`,
	);

	return Array.isArray(stack) && stack.length > 0;
}
