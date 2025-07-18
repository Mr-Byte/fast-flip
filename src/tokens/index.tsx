import { setupPlaceableHUD } from "@common/placeableHud";
import { type Settings } from "@common/settings";
import { afkOverlay } from "@tokens/capabilities/afkOverlay";
import { tokenMirroring } from "@tokens/capabilities/tokenMirroring";
// import { SpeechBubble } from "@tokens/speechBubble";

export function initialize(settings: Settings): void {
    const tokenMirroringButtons = tokenMirroring(settings);
    const afkOverlayHudButtons = afkOverlay(settings);

    setupTokenSpeechBubbles(settings);

    setupPlaceableHUD("TokenHUD", [...tokenMirroringButtons, ...afkOverlayHudButtons]);
}

function setupTokenSpeechBubbles(_settings: Settings) {
    // const chatBubbleContainer = document.getElementById("chat-bubbles");
    // const style = getComputedStyle(<div className="bubble-content" />);
    // const fontFamily = style.fontFamily;
    //
    // async function _showBubble(token: Token): Promise<void> {
    //     await chatBubbleContainer
    //         ?.appendChild(
    //             <SpeechBubble
    //                 id={token.id}
    //                 fontSize={`${settings.speechBubbleFontSize}px`}
    //                 fontFamily={fontFamily}
    //                 top={token.y}
    //                 left={token.x}
    //                 text={token.name}
    //             />,
    //         )
    //         .animate([{ opacity: 0 }, { opacity: 1 }], {
    //             duration: 250,
    //             fill: "forwards",
    //         }).finished;
    // }
    //
    // async function _hideBubble(token: Token): Promise<void> {
    //     const existing = document.querySelector(`.chat-bubble[data-bubble-id="${token.id}"]`) as HTMLElement;
    //
    //     if (!existing) {
    //         return;
    //     }
    //
    //     await existing.animate([{ opacity: 1 }, { opacity: 0 }], {
    //         duration: 100,
    //         fill: "forwards",
    //     }).finished;
    //
    //     existing.remove();
    // }
}
