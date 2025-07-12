import { AFK_STATE_KEY, TokenMirror } from "../model";
import { LOCALIZATION, MODULE_NAME } from "../constants";

import { AFKOverlay } from "../pixi/afk-overlay";
import { Settings } from "../settings";
import { findChild } from "../pixi";

export class TokenManager {
    readonly #game: foundry.Game;
    readonly #settings: Settings;

    constructor(game: foundry.Game, settings: Settings) {
        this.#game = game;
        this.#settings = settings;

        Hooks.on("updateToken", this.#onUpdateToken.bind(this));
        Hooks.on("drawToken", this.#onDrawToken.bind(this));
    }

    mirrorSelected(tokenMirrorDirection: TokenMirror): void {
        for (const token of this.#controlledTokens) {
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
                const animationDuration = this.#settings.animationDuration;

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

    async toggleAFK(): Promise<void> {
        if (!this.#settings.allowAFKToggle) {
            return;
        }

        for (const token of this.#controlledTokens) {
            if (!token.isOwner || !token.actor?.hasPlayerOwner) {
                continue;
            }

            const isAFK = token.document.getFlag(MODULE_NAME, AFK_STATE_KEY);

            if (isAFK) {
                await this.#unsetAFK(token);
            } else {
                await this.#setAFK(token);
            }
        }
    }

    async #setAFK(token: foundry.canvas.placeables.Token): Promise<void> {
        await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, true);

        if (!this.#settings.showAFKStatusInChat) {
            return;
        }

        await ChatMessage.create({
            style: CONST.CHAT_MESSAGE_STYLES.OOC,
            speaker: { token: token.id },
            content: this.#game.i18n?.format(LOCALIZATION.CHAT_AFK_MESSAGE, {
                name: token.name,
            }),
        });
    }

    async #unsetAFK(token: foundry.canvas.placeables.Token): Promise<void> {
        await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, false);

        if (!this.#settings.showAFKStatusInChat) {
            return;
        }

        await ChatMessage.create({
            style: CONST.CHAT_MESSAGE_STYLES.OOC,
            speaker: { token: token.id },
            content: this.#game.i18n?.format(LOCALIZATION.CHAT_RETURNED_MESSAGE, {
                name: token.name,
            }),
        });
    }

    get #controlledTokens(): foundry.canvas.placeables.Token[] {
        return this.#game.canvas?.tokens?.controlled ?? [];
    }

    async #onDrawToken(token: foundry.canvas.placeables.Token): Promise<void> {
        if (!token) {
            return;
        }

        if (!token.actor?.hasPlayerOwner) {
            return;
        }

        await this.#updateTokenAFKOverlay(token);
    }

    async #onUpdateToken(_: unknown, document: foundry.abstract.Document.UpdateDataForName<"Token">): Promise<void> {
        if (!document._id || typeof document._id !== "string") {
            return;
        }

        const token = this.#game.canvas?.tokens?.get(document._id);

        if (!token) {
            return;
        }

        await this.#updateTokenAFKOverlay(token);
    }

    async #updateTokenAFKOverlay(token: foundry.canvas.placeables.Token): Promise<void> {
        const overlay = findChild(token, AFKOverlay) ?? new AFKOverlay(this.#settings, token);

        const isAFK = token.document.getFlag(MODULE_NAME, AFK_STATE_KEY);

        if (!isAFK) {
            overlay.hide();
            return;
        }

        await overlay.show();
    }
}
