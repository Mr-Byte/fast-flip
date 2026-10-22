import { LOCALIZATION, MODULE_NAME } from "@/common/constants";
import { normalizeKeys } from "@/common/keyboard";
import type { Settings } from "@/common/settings";
import {
	createImageWheel,
	populateImageWheel,
} from "@/tokens/capabilities/_components/imageWheel";
import type { Capability } from "@/tokens/capabilities/capability";

import Hooks = foundry.helpers.Hooks;
import TextureTransitionFilter = foundry.canvas.rendering.filters.TextureTransitionFilter;

const KEYBIND_NAME = "pickTokenImage";

export default function wildcardImages(settings: Settings): Capability {
	let openWheel: HTMLElement | null = null;
	let openToken: foundry.canvas.placeables.Token | undefined;
	let hoveredImage: string | undefined;
	let keyClearInterval: NodeJS.Timeout | undefined;
	let repeatWatchdogArmed = false;
	let lastRepeatAt = 0;

	const clearKeyInterval = () => {
		if (keyClearInterval !== undefined) {
			clearInterval(keyClearInterval);
			keyClearInterval = undefined;
		}
	};

	const onEscape = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			closeImageWheel(false);
		}
	};

	const onCanvasTearDown = () => {
		closeImageWheel(false);
	};

	// Losing window focus (alt-tab) swallows the keyup and leaves the key in
	// Foundry's downKeys set, so the interval guard never fires. Treat focus
	// loss as a cancel.
	const onWindowBlur = () => {
		closeImageWheel(false);
	};

	// System overlays like the macOS screenshot tool grab the keyboard
	// WITHOUT blurring the window, so neither the keyup nor a blur event ever
	// arrives. While a key is held the OS delivers auto-repeat keydowns;
	// once those have been seen, their disappearance means the key no longer
	// reaches this window. The watchdog only arms after the first repeat, so
	// users with key repeat disabled are unaffected.
	const onRepeatProbe = (event: KeyboardEvent) => {
		if (!event.repeat) {
			return;
		}

		const [bindings] =
			game.keybindings?.bindings?.get(`${MODULE_NAME}.${KEYBIND_NAME}`) ?? [];

		if (bindings && event.code === bindings.key) {
			repeatWatchdogArmed = true;
			lastRepeatAt = Date.now();
		}
	};

	return {
		hudButtonGroups: [],
		keybinds: [
			{
				name: KEYBIND_NAME,
				config: {
					name: LOCALIZATION.KEYBINDS_PICK_TOKEN_IMAGE_HOTKEY,
					hint: LOCALIZATION.KEYBINDS_PICK_TOKEN_IMAGE_HINT,
					editable: [{ key: "KeyI" }],
					onDown: () => void openImageWheel(),
					// Foundry emulates keyups (isTrusted: false) when the window
					// blurs; only a genuine release selects.
					onUp: (context) => closeImageWheel(context?.event?.isTrusted ?? true),
					precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
					restricted: false,
					reservedModifiers: [],
					repeat: false,
				},
			},
		],
	};

	async function openImageWheel(): Promise<void> {
		if (!settings.allowTokenImageWheel || openWheel) {
			return;
		}

		const token = game.canvas?.tokens?.controlled?.[0];

		if (!token?.isOwner || !token.actor) {
			return;
		}

		const hud = document.getElementById("hud");

		if (!hud) {
			return;
		}

		// The wheel element is created before any async work so that every
		// close path has something to remove; it doubles as the cancellation
		// token for the image fetch below.
		const wheel = createImageWheel();
		hud.appendChild(wheel);
		openWheel = wheel;
		openToken = token;
		hoveredImage = undefined;

		repeatWatchdogArmed = false;
		document.addEventListener("keydown", onEscape);
		window.addEventListener("keydown", onRepeatProbe, true);
		window.addEventListener("blur", onWindowBlur);
		Hooks.once("canvasTearDown", onCanvasTearDown);

		clearKeyInterval();
		keyClearInterval = setInterval(() => {
			if (repeatWatchdogArmed && Date.now() - lastRepeatAt > 1500) {
				closeImageWheel(false);
				return;
			}

			const [bindings] =
				game.keybindings?.bindings?.get(`${MODULE_NAME}.${KEYBIND_NAME}`) ?? [];
			const keys = bindings
				? [bindings.key, ...(bindings.modifiers ?? [])]
				: [];
			const keySet = new Set(keys);
			const downKeys = normalizeKeys(game.keyboard?.downKeys);

			if (!keySet.isSubsetOf(downKeys)) {
				closeImageWheel(true);
			}
		}, 250);

		const images = await token.actor.getTokenImages().catch(() => []);

		// Closed, or the scene was torn down, while the list was fetched.
		if (!wheel.isConnected) {
			return;
		}

		if (images.length <= 1) {
			closeImageWheel(false);
			return;
		}

		populateImageWheel(wheel, {
			images,
			currentSrc: token.document.texture.src ?? "",
			cx: token.center.x,
			cy: token.center.y,
			// The half-diagonal, so the ring clears the square token's corners.
			tokenRadius: Math.hypot(token.w, token.h) / 2,
			onHover: (image) => {
				hoveredImage = image;
			},
		});
	}

	function closeImageWheel(select: boolean): void {
		clearKeyInterval();
		document.removeEventListener("keydown", onEscape);
		window.removeEventListener("keydown", onRepeatProbe, true);
		window.removeEventListener("blur", onWindowBlur);
		Hooks.off("canvasTearDown", onCanvasTearDown);

		const token = openToken;
		const image = hoveredImage;
		openWheel?.remove();
		openWheel = null;
		openToken = undefined;
		hoveredImage = undefined;

		if (
			!select ||
			!image ||
			!token?.isOwner ||
			image === token.document.texture.src
		) {
			return;
		}

		applyImage(token, image).catch((error) =>
			console.error(
				"Fast Flip! Token Tools | Failed to change token image.",
				error,
			),
		);
	}

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
