import { LOCALIZATION, MODULE_NAME } from "@/common/constants";
import { getIcon } from "@/common/helpers";
import type { Settings } from "@/common/settings";
import type { Capability } from "@/tokens/capabilities/capability";

export enum FlipDirection {
	HORIZONTAL = "scaleX",
	VERTICAL = "scaleY",
}

export const FLIP_FLAG = "is-flipping";

export default function tokenFlipping(settings: Settings): Capability {
	return {
		hudButtonGroups: [
			{
				side: "left",
				buttons: [
					{
						title: LOCALIZATION.TEXT_FLIP_TOKEN_HORIZONTAL_BUTTON,
						icon: getIcon("mirror-horizontal"),
						onClick: () => mirrorSelected(FlipDirection.HORIZONTAL),
						shouldShow: (token) =>
							settings.showMirrorButtonsHud && token.isOwner,
					},
					{
						title: LOCALIZATION.TEXT_FLIP_TOKEN_VERTICAL_BUTTON,
						icon: getIcon("mirror-vertical"),
						onClick: () => mirrorSelected(FlipDirection.VERTICAL),
						shouldShow: (token) =>
							settings.showMirrorButtonsHud && token.isOwner,
					},
				],
			},
		],
		keybinds: [
			{
				name: "flipToken",
				config: {
					name: LOCALIZATION.KEYBINDS_FLIP_TOKEN_HOTKEY,
					hint: LOCALIZATION.KEYBINDS_FLIP_TOKEN_HINT,
					editable: [{ key: "KeyG" }],
					onDown: (event) =>
						mirrorSelected(
							event.isShift ? FlipDirection.VERTICAL : FlipDirection.HORIZONTAL,
						),
					precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
					restricted: false,
					reservedModifiers: ["SHIFT"],
					repeat: false,
				},
			},
		],
	};

	function mirrorSelected(tokenMirrorDirection: FlipDirection) {
		const controlledTokens = game.canvas?.tokens?.controlled ?? [];

		for (const token of controlledTokens) {
			if (!token.isOwner) {
				continue;
			}

			(async () => {
				if (token.document.getFlag(MODULE_NAME, FLIP_FLAG)) {
					return;
				}

				await token.document.setFlag(MODULE_NAME, FLIP_FLAG, true);

				try {
					const currentScale =
						token.document._source.texture?.[tokenMirrorDirection];

					if (currentScale === undefined) {
						console.warn(
							"Fast Flip! Token Tools | Unable to retrieve the token's current scale, aborting animation.",
						);

						return;
					}

					const targetScale = -currentScale;
					const duration = settings.animationDuration;

					await token.document.update(
						{
							[`texture.${tokenMirrorDirection}`]: targetScale,
						},
						{
							animate: duration !== 0,
							animation: {
								duration,
							},
						},
					);

					const key = token.animationName;
					const animationContext = token.animationContexts.get(key);

					await animationContext?.promise;
				} finally {
					await token.document.unsetFlag(MODULE_NAME, FLIP_FLAG);
				}
			})().catch((error) =>
				console.error("Fast Flip! Token Tools | Failed to flip token.", error),
			);
		}
	}
}
