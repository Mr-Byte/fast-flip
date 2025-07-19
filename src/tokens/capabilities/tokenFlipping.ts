import type { Capability } from "@/tokens/capabilities/capability";
import { LOCALIZATION } from "@/common/constants";
import type { Settings } from "@/common/settings";
import { getIcon } from "@/common/helpers";

export const enum FlipDirection {
    HORIZONTAL = "scaleX",
    VERTICAL = "scaleY",
}

export default function tokenFlipping(settings: Settings): Capability {
    return {
        hudButtonGroups: [
            {
                side: "left",
                buttons: [
                    {
                        title: LOCALIZATION.FLIP_TOKEN_HORIZONTAL_BUTTON,
                        icon: getIcon("mirror-horizontal"),
                        onClick: () => void mirrorSelected(FlipDirection.HORIZONTAL),
                        shouldShow: (token) => settings.showMirrorButtons && token.isOwner,
                    },
                    {
                        title: LOCALIZATION.FLIP_TOKEN_VERTICAL_BUTTON,
                        icon: getIcon("mirror-vertical"),
                        onClick: () => mirrorSelected(FlipDirection.VERTICAL),
                        shouldShow: (token) => settings.showMirrorButtons && token.isOwner,
                    },
                ],
            },
        ],
        keybinds: [
            {
                name: "flipToken",
                config: {
                    name: LOCALIZATION.FLIP_TOKEN_HOTKEY,
                    hint: game.i18n?.localize(LOCALIZATION.FLIP_TOKEN_HINT),
                    editable: [{ key: "KeyG" }],
                    onDown: (event) =>
                        mirrorSelected(event.isShift ? FlipDirection.VERTICAL : FlipDirection.HORIZONTAL),
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
                const key = `Token.${token.id}.animate`;
                const animationContext = token.animationContexts.get(key);

                if (animationContext?.promise) {
                    await animationContext.promise;
                }

                const flipMirror = -(token.document?.texture[tokenMirrorDirection] ?? 0);
                const animationDuration = settings.animationDuration;

                await token.document.update(
                    {
                        [`texture.${tokenMirrorDirection}`]: flipMirror,
                    },
                    {
                        animate: animationDuration !== 0,
                        animation: {
                            duration: animationDuration,
                        },
                    },
                );
            })();
        }
    }
}
