import { LOCALIZATION, MODULE_NAME } from "@/common/constants";
import { AfkOverlay } from "@/tokens/capabilities/_components/afkOverlay";
import type { Capability } from "@/tokens/capabilities/capability";
import type { Settings } from "@/common/settings";
import { getIcon } from "@/common/helpers";

import Hooks = foundry.helpers.Hooks;

export const AFK_STATE_KEY = "afk-state";

export default function afkOverlay(settings: Settings): Capability {
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

    return {
        hudButtonGroups: [
            {
                side: "right",
                buttons: [
                    {
                        title: LOCALIZATION.TOGGLE_AFK_BUTTON,
                        icon: getIcon("toggle-afk"),
                        onClick: () => void toggleAFK(),
                        shouldShow: (token) =>
                            settings.allowAfkToggle &&
                            settings.showToggleAfkHud &&
                            token.isOwner &&
                            (token.actor?.hasPlayerOwner ?? false),
                    },
                ],
            },
        ],
        keybinds: [
            {
                name: LOCALIZATION.TOGGLE_AFK_HOTKEY,
                config: {
                    name: LOCALIZATION.TOGGLE_AFK_HOTKEY,
                    hint: game.i18n?.localize(LOCALIZATION.TOGGLE_AFK_HINT),
                    editable: [{ key: "KeyK", modifiers: ["SHIFT"] }],
                    onDown: () => void toggleAFK(),
                    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
                    restricted: false,
                    reservedModifiers: [],
                    repeat: false,
                },
            },
        ],
    };

    async function toggleAFK() {
        if (!settings.allowAfkToggle) {
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

        if (!settings.showAfkStatusInChat) {
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

        if (!settings.showAfkStatusInChat) {
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
