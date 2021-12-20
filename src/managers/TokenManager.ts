import { getIcon } from "../helpers";
import { SETTING, MODULE_NAME } from "../constants";

export const enum TokenMirror {
    HORIZONTAL = "mirrorX",
    VERTICAL = "mirrorY"
}

const AFK_STATE_KEY = "afk-state";
const PREVIOUS_OVERLAY_STATE_FFECT_KEY = "previous-overlay-effect";

export class TokenManager {
    readonly #game: Game;

    constructor(game: Game) {
        this.#game = game;
    }

    async mirrorSelected(tokenMirrorDirection: TokenMirror) {
        for (const token of this.#controlledTokens) {
            await token.document.update({
                [tokenMirrorDirection]: !token.data[tokenMirrorDirection]
            });
        }
    }

    async toggleAFK() {
        for (const token of this.#controlledTokens) {
            const isAFK = token.document.getFlag(MODULE_NAME, AFK_STATE_KEY);
            const afkIconPath = this.#game.settings.get(MODULE_NAME, SETTING.AFK_OVERLAY_ICON_PATH) as string;

            if (isAFK) {
                const previousOverlayEffect = token.document.getFlag(MODULE_NAME, PREVIOUS_OVERLAY_STATE_FFECT_KEY) as string | null | undefined;
                await token.document.unsetFlag(MODULE_NAME, PREVIOUS_OVERLAY_STATE_FFECT_KEY);
                await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, false);
                await token.document.update({ overlayEffect: previousOverlayEffect ?? null });
            } else {
                const previousOverlayEffect = token.data.overlayEffect;
                await token.document.setFlag(MODULE_NAME, PREVIOUS_OVERLAY_STATE_FFECT_KEY, previousOverlayEffect);
                await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, true);
                await token.document.update({ overlayEffect: afkIconPath });
            }
        }
    }

    get #controlledTokens(): Token[] {
        return this.#game.canvas.tokens?.controlled ?? [];;
    }
}
