import { LOCALIZATION, MODULE_NAME } from "@common/constants";
import { AfkOverlay } from "@tokens/pixi/afkOverlay";
import type { ButtonGroupProps } from "@common/placeableHud";
import type { Settings } from "@common/settings";
import { getIcon } from "@common/helpers";

export const AFK_STATE_KEY = "afk-state";

export function afkOverlay(settings: Settings): ButtonGroupProps<foundry.canvas.placeables.Token>[] {
    Hooks.on("updateToken", async (_, document) => {
        if (!document._id || typeof document._id !== "string") {
            return;
        }

        const token = game.canvas?.tokens?.get(document._id);

        if (!token) {
            return;
        }

        await updateTokenAFKOverlay(token);
    });

    Hooks.on("drawToken", async (token) => {
        if (!token) {
            return;
        }

        if (!token.actor?.hasPlayerOwner) {
            return;
        }

        await updateTokenAFKOverlay(token);
    });

    game.keybindings?.register(MODULE_NAME, LOCALIZATION.TOGGLE_AFK_HOTKEY, {
        name: LOCALIZATION.TOGGLE_AFK_HOTKEY,
        hint: game.i18n?.localize(LOCALIZATION.TOGGLE_AFK_HINT),
        editable: [{ key: "KeyK", modifiers: ["SHIFT"] }],
        onDown: () => void toggleAFK(),
        precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        restricted: false,
        reservedModifiers: [],
        repeat: false,
    });

    const toggleAFKIcon = getIcon("toggle-afk");

    return [
        {
            side: "right",
            buttons: [
                {
                    title: LOCALIZATION.TOGGLE_AFK_BUTTON,
                    icon: toggleAFKIcon,
                    onClick: () => void toggleAFK(),
                    shouldShow: (token) =>
                        settings.allowAFKToggle &&
                        settings.showToggleAFKButton &&
                        token.isOwner &&
                        (token.actor?.hasPlayerOwner ?? false),
                },
            ],
        },
    ];

    async function toggleAFK() {
        if (!settings.allowAFKToggle) {
            return;
        }

        const controlledTokens = game.canvas?.tokens?.controlled ?? [];
        for (const token of controlledTokens) {
            if (!token.isOwner || !token.actor?.hasPlayerOwner) {
                continue;
            }

            const isAFK = token.document.getFlag(MODULE_NAME, AFK_STATE_KEY);

            if (isAFK) {
                await unsetAFK(token);
            } else {
                await setAFK(token);
            }
        }
    }

    async function setAFK(token: foundry.canvas.placeables.Token): Promise<void> {
        await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, true);

        if (!settings.showAFKStatusInChat) {
            return;
        }

        await foundry.documents.ChatMessage.create({
            style: CONST.CHAT_MESSAGE_STYLES.OOC,
            speaker: { token: token.id },
            content: game.i18n?.format(LOCALIZATION.CHAT_AFK_MESSAGE, {
                name: token.name,
            }),
        });
    }

    async function unsetAFK(token: foundry.canvas.placeables.Token): Promise<void> {
        await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, false);

        if (settings.showAFKStatusInChat) {
            return;
        }

        await foundry.documents.ChatMessage.create({
            style: CONST.CHAT_MESSAGE_STYLES.OOC,
            speaker: { token: token.id },
            content: game.i18n?.format(LOCALIZATION.CHAT_RETURNED_MESSAGE, {
                name: token.name,
            }),
        });
    }

    async function updateTokenAFKOverlay(token: foundry.canvas.placeables.Token): Promise<void> {
        const overlay = token.getChildByName<AfkOverlay>(AfkOverlay.NAME, true) ?? new AfkOverlay(settings, token);
        const isAFK = token.document.getFlag(MODULE_NAME, AFK_STATE_KEY);

        if (!isAFK) {
            overlay.hide();
            return;
        }

        await overlay.show();
    }
}
