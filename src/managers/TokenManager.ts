import { AFKOverlay } from "../pixi/AFKOverlay";
import { findChild } from "../pixi";
import { LOCALIZATION, MODULE_NAME } from "../constants";
import { Settings } from "../Settings";
import { AFK_STATE_KEY, TokenMirror } from "../configuration";
export { TokenMirror } from "../configuration";

export class TokenManager {
    readonly #game: Game;
    readonly #settings: Settings;

    constructor(game: Game, settings: Settings) {
        this.#game = game;
        this.#settings = settings;

        Hooks.on("updateToken", this.#onUpdateToken.bind(this));
        Hooks.on("drawToken", this.#onDrawToken.bind(this));
    }

    mirrorSelected(tokenMirrorDirection: TokenMirror) {
        for (const token of this.#controlledTokens) {
            if (!token.isOwner) {
                continue;
            }

            (async () => {
                const key = `Token.${token.id}.animate`;
                console.log(key);
                const animationContext = token.animationContexts.get(key);

                if (animationContext?.promise) {
                    await animationContext.promise;
                }

                const flipMirror = -(
                    token.document?.texture[tokenMirrorDirection] ?? 0
                );
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

    async toggleAFK() {
        if (!this.#settings.allowAFKToggle) {
            return;
        }

        for (const token of this.#controlledTokens) {
            if (!token.isOwner || !token.actor?.hasPlayerOwner) {
                continue;
            }

            const isAFK = token.document.getFlag(MODULE_NAME, AFK_STATE_KEY);

            isAFK ? this.#unsetAFK(token) : this.#setAFK(token);
        }
    }

    async #setAFK(token: Token) {
        await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, true);

        this.#settings.showAFKStatusInChat &&
            ChatMessage.create({
                style: CONST.CHAT_MESSAGE_STYLES.OOC,
                speaker: { token: token.id },
                content: this.#game.i18n?.format(
                    LOCALIZATION.CHAT_AFK_MESSAGE,
                    {
                        name: token.name,
                    },
                ),
            });
    }

    async #unsetAFK(token: Token) {
        await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, false);

        this.#settings.showAFKStatusInChat &&
            ChatMessage.create({
                style: CONST.CHAT_MESSAGE_STYLES.OOC,
                speaker: { token: token.id },
                content: this.#game.i18n?.format(
                    LOCALIZATION.CHAT_RETURNED_MESSAGE,
                    {
                        name: token.name,
                    },
                ),
            });

        return;
    }

    get #controlledTokens(): Token[] {
        return this.#game.canvas?.tokens?.controlled ?? [];
    }

    async #onDrawToken(token: Token) {
        if (!token) {
            return;
        }

        if (!token.actor?.hasPlayerOwner) {
            return;
        }

        await this.#updateTokenAFKOverlay(token);
    }

    async #onUpdateToken(_: unknown, document: foundry.documents.BaseToken) {
        if (!document._id) {
            return;
        }

        const token = this.#game.canvas?.tokens?.get(document._id);

        if (!token) {
            return;
        }

        await this.#updateTokenAFKOverlay(token);
    }

    async #updateTokenAFKOverlay(token: Token) {
        const overlay =
            findChild(token, AFKOverlay) ??
            new AFKOverlay(this.#settings, token);

        const isAFK = token.document.getFlag(MODULE_NAME, AFK_STATE_KEY);

        if (!isAFK) {
            overlay.hide();
            return;
        }

        await overlay.show();
    }
}
