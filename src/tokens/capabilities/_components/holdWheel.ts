import { MODULE_NAME } from "@/common/constants";
import { normalizeKeys } from "@/common/keyboard";
import {
	createImageWheel,
	populateImageWheel,
	type WheelEntry,
} from "@/tokens/capabilities/_components/imageWheel";

import Hooks = foundry.helpers.Hooks;
type Token = foundry.canvas.placeables.Token;

export type HoldWheelOptions<T extends WheelEntry> = {
	keybindName: string;
	isEnabled: () => boolean;
	// Fewer entries than this closes the wheel before it is shown.
	minEntries: number;
	loadEntries: (token: Token) => Promise<T[]>;
	onPick: (token: Token, entry: T) => Promise<void>;
	failureMessage: string;
};

export type HoldWheelHandlers = Pick<
	foundry.helpers.interaction.ClientKeybindings.KeybindingActionConfig,
	"onDown" | "onUp"
>;

// Only one wheel may be open at a time, whichever key opened it.
let anyWheelOpen = false;

export function createHoldWheel<T extends WheelEntry>(
	options: HoldWheelOptions<T>,
): HoldWheelHandlers {
	const bindingId = `${MODULE_NAME}.${options.keybindName}`;

	let openWheel: HTMLElement | null = null;
	let openToken: Token | undefined;
	let hoveredEntry: T | undefined;
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
			closeWheel(false);
		}
	};

	const onCanvasTearDown = () => {
		closeWheel(false);
	};

	// Losing window focus (alt-tab) swallows the keyup and leaves the key in
	// Foundry's downKeys set, so the interval guard never fires. Treat focus
	// loss as a cancel.
	const onWindowBlur = () => {
		closeWheel(false);
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

		const [bindings] = game.keybindings?.bindings?.get(bindingId) ?? [];

		if (bindings && event.code === bindings.key) {
			repeatWatchdogArmed = true;
			lastRepeatAt = Date.now();
		}
	};

	return {
		onDown: () => void openHoldWheel(),
		// Foundry emulates keyups (isTrusted: false) when the window blurs; only
		// a genuine release selects.
		onUp: (context) => closeWheel(context?.event?.isTrusted ?? true),
	};

	async function openHoldWheel(): Promise<void> {
		if (anyWheelOpen || !options.isEnabled()) {
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
		// token for the entry fetch below.
		const wheel = createImageWheel();
		hud.appendChild(wheel);
		anyWheelOpen = true;
		openWheel = wheel;
		openToken = token;
		hoveredEntry = undefined;

		repeatWatchdogArmed = false;
		document.addEventListener("keydown", onEscape);
		window.addEventListener("keydown", onRepeatProbe, true);
		window.addEventListener("blur", onWindowBlur);
		Hooks.once("canvasTearDown", onCanvasTearDown);

		clearKeyInterval();
		keyClearInterval = setInterval(() => {
			if (repeatWatchdogArmed && Date.now() - lastRepeatAt > 1500) {
				closeWheel(false);
				return;
			}

			const [bindings] = game.keybindings?.bindings?.get(bindingId) ?? [];
			const keys = bindings
				? [bindings.key, ...(bindings.modifiers ?? [])]
				: [];
			const keySet = new Set(keys);
			const downKeys = normalizeKeys(game.keyboard?.downKeys);

			if (!keySet.isSubsetOf(downKeys)) {
				closeWheel(true);
			}
		}, 250);

		const entries = await options.loadEntries(token).catch((error) => {
			console.error(
				"Fast Flip! Token Tools | Failed to load the wheel entries.",
				error,
			);

			return [];
		});

		// Closed, or the scene was torn down, while the entries were fetched.
		if (!wheel.isConnected) {
			return;
		}

		if (entries.length < options.minEntries) {
			closeWheel(false);
			return;
		}

		populateImageWheel(wheel, {
			entries,
			cx: token.center.x,
			cy: token.center.y,
			// The half-diagonal, so the ring clears the square token's corners.
			tokenRadius: Math.hypot(token.w, token.h) / 2,
			onHover: (entry) => {
				hoveredEntry = entry;
			},
		});
	}

	function closeWheel(select: boolean): void {
		// The key was released without this wheel open, for example because
		// another wheel was already showing.
		if (!openWheel) {
			return;
		}

		clearKeyInterval();
		document.removeEventListener("keydown", onEscape);
		window.removeEventListener("keydown", onRepeatProbe, true);
		window.removeEventListener("blur", onWindowBlur);
		Hooks.off("canvasTearDown", onCanvasTearDown);

		const token = openToken;
		const entry = hoveredEntry;
		openWheel.remove();
		openWheel = null;
		openToken = undefined;
		hoveredEntry = undefined;
		anyWheelOpen = false;

		if (!select || !entry || !token?.isOwner) {
			return;
		}

		options
			.onPick(token, entry)
			.catch((error) =>
				console.error(
					`Fast Flip! Token Tools | ${options.failureMessage}`,
					error,
				),
			);
	}
}
