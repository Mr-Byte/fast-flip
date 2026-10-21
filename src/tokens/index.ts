import { MODULE_NAME } from "@/common/constants";
import { setupPlaceableHUD } from "@/common/placeableHud";
import type { Settings } from "@/common/settings";
import afkOverlay from "@/tokens/capabilities/afkOverlay";
import type { Capability } from "@/tokens/capabilities/capability";
import raiseHand from "@/tokens/capabilities/raiseHand";
import speechBubbles from "@/tokens/capabilities/speechBubbles";
import tokenFlipping from "@/tokens/capabilities/tokenFlipping";
import wildcardImages from "@/tokens/capabilities/wildcardImages";

export function initialize(settings: Settings): void {
	const tokenMirroringCapability = tokenFlipping(settings);
	const afkOverlayCapability = afkOverlay(settings);
	const speechBubbleCapability = speechBubbles(settings);
	const raiseHandCapability = raiseHand(settings);
	const wildcardImagesCapability = wildcardImages(settings);

	registerCapabilities(
		tokenMirroringCapability,
		afkOverlayCapability,
		speechBubbleCapability,
		raiseHandCapability,
		wildcardImagesCapability,
	);
}

function registerCapabilities(...capabilities: Capability[]) {
	const hudButtonGroups = [];

	for (const capability of capabilities) {
		for (const keybind of capability.keybinds ?? []) {
			game?.keybindings?.register(MODULE_NAME, keybind.name, keybind.config);
		}

		hudButtonGroups.push(...capability.hudButtonGroups);
	}

	setupPlaceableHUD("TokenHUD", hudButtonGroups);
}
