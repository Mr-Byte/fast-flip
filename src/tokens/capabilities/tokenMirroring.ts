import { LOCALIZATION, MODULE_NAME } from "@common/constants";
import type { ButtonGroupProps } from "@common/placeableHud";
import type { Settings } from "@common/settings";
import { getIcon } from "@common/helpers";

export const enum TokenMirror {
    HORIZONTAL = "scaleX",
    VERTICAL = "scaleY",
}

export function tokenMirroring(settings: Settings): ButtonGroupProps<foundry.canvas.placeables.Token>[] {
    game.keybindings?.register(MODULE_NAME, "horizontalFlip", {
        name: LOCALIZATION.MIRROR_HORIZONTAL_HOTKEY,
        hint: game.i18n?.localize(LOCALIZATION.MIRROR_HORIZONTAL_HINT),
        editable: [{ key: "KeyG" }],
        onDown: () => mirrorSelected(TokenMirror.HORIZONTAL),
        precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        restricted: false,
        reservedModifiers: [],
        repeat: false,
    });

    game.keybindings?.register(MODULE_NAME, "verticalFlip", {
        name: LOCALIZATION.MIRROR_VERTICAL_HOTKEY,
        hint: game.i18n?.localize(LOCALIZATION.MIRROR_VERTICAL_HINT),
        editable: [{ key: "KeyG", modifiers: ["SHIFT"] }],
        onDown: () => mirrorSelected(TokenMirror.VERTICAL),
        precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        restricted: false,
        reservedModifiers: [],
        repeat: false,
    });

    const mirrorHorizontalIcon = getIcon("mirror-horizontal");
    const mirrorVerticalIcon = getIcon("mirror-vertical");

    return [
        {
            side: "left",
            buttons: [
                {
                    title: LOCALIZATION.MIRROR_HORIZONTAL_BUTTON,
                    icon: mirrorHorizontalIcon,
                    onClick: () => void mirrorSelected(TokenMirror.HORIZONTAL),
                    shouldShow: (token) => settings.showMirrorButtons && token.isOwner,
                },
                {
                    title: LOCALIZATION.MIRROR_VERTICAL_BUTTON,
                    icon: mirrorVerticalIcon,
                    onClick: () => mirrorSelected(TokenMirror.VERTICAL),
                    shouldShow: (token) => settings.showMirrorButtons && token.isOwner,
                },
            ],
        },
    ];

    function mirrorSelected(tokenMirrorDirection: TokenMirror) {
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
