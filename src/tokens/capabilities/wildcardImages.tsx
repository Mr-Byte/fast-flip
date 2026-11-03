import { LOCALIZATION } from "@/common/constants";
import type { Settings } from "@/common/settings";
import { createHoldWheel } from "@/tokens/capabilities/_components/holdWheel";
import {
	isSameImage,
	type WheelEntry,
} from "@/tokens/capabilities/_components/imageWheel";
import type { Capability } from "@/tokens/capabilities/capability";

import TextureTransitionFilter = foundry.canvas.rendering.filters.TextureTransitionFilter;

const KEYBIND_NAME = "pickTokenImage";

type ImageEntry = WheelEntry & { image: string };

export default function wildcardImages(settings: Settings): Capability {
	const handlers = createHoldWheel<ImageEntry>({
		keybindName: KEYBIND_NAME,
		isEnabled: () => settings.allowTokenImageWheel,
		// A single image leaves nothing to pick between.
		minEntries: 2,
		loadEntries: async (token) => {
			const images = (await token.actor?.getTokenImages()) ?? [];
			const currentSrc = token.document.texture.src ?? "";

			return images.map((image) => ({
				image,
				active: isSameImage(image, currentSrc),
			}));
		},
		onPick: async (token, { image }) => {
			if (isSameImage(image, token.document.texture.src ?? "")) {
				return;
			}

			await applyImage(token, image);
		},
		failureMessage: "Failed to change token image.",
	});

	return {
		hudButtonGroups: [],
		keybinds: [
			{
				name: KEYBIND_NAME,
				config: {
					name: LOCALIZATION.KEYBINDS_PICK_TOKEN_IMAGE_HOTKEY,
					hint: LOCALIZATION.KEYBINDS_PICK_TOKEN_IMAGE_HINT,
					editable: [{ key: "KeyI" }],
					...handlers,
					precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
					restricted: false,
					reservedModifiers: [],
					repeat: false,
				},
			},
		],
	};

	async function applyImage(
		token: foundry.canvas.placeables.Token,
		image: string,
	): Promise<void> {
		const transition = settings.tokenImageWheelTransition;

		if (transition === "none") {
			await token.document.update({ texture: { src: image } }, {
				animate: false,
			} as Parameters<typeof token.document.update>[1]);

			return;
		}

		await token.document.update({ texture: { src: image } }, {
			animation: {
				transition: transition as TextureTransitionFilter.TYPES,
				duration: 500,
			},
		} as Parameters<typeof token.document.update>[1]);
	}
}
