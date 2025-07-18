// import { AFK_STATE_KEY, TokenMirror } from "../model";
// import { LOCALIZATION, MODULE_NAME } from "../constants";
// import { AFKOverlay } from "../pixi/afk-overlay";
// import { Settings } from "../settings";
// import { findChild } from "../pixi/pixi";
//
// export type TokenManager = {
//     mirrorSelected: (tokenMirrorDirection: TokenMirror) => void;
//     toggleAFK: () => Promise<void>;
// };
//
// type ManagerParams = {
//     game: foundry.Game;
//     settings: Settings;
// };
//
// export function setupTokenManager({ game, settings }: ManagerParams): TokenManager {
//     Hooks.on("updateToken", async (_, document) => {
//         if (!document._id || typeof document._id !== "string") {
//             return;
//         }
//
//         const token = game.canvas?.tokens?.get(document._id);
//
//         if (!token) {
//             return;
//         }
//
//         await updateTokenAFKOverlay({ token, settings });
//     });
//
//     Hooks.on("drawToken", async (token) => {
//         if (!token) {
//             return;
//         }
//
//         if (!token.actor?.hasPlayerOwner) {
//             return;
//         }
//
//         await updateTokenAFKOverlay({ token, settings });
//     });
//
//     return {
//         mirrorSelected(tokenMirrorDirection: TokenMirror) {
//             const controlledTokens = game.canvas?.tokens?.controlled ?? [];
//
//             for (const token of controlledTokens) {
//                 if (!token.isOwner) {
//                     continue;
//                 }
//
//                 (async () => {
//                     const key = `Token.${token.id}.animate`;
//                     const animationContext = token.animationContexts.get(key);
//
//                     if (animationContext?.promise) {
//                         await animationContext.promise;
//                     }
//
//                     const flipMirror = -(token.document?.texture[tokenMirrorDirection] ?? 0);
//                     const animationDuration = settings.animationDuration;
//
//                     await token.document.update(
//                         {
//                             [`texture.${tokenMirrorDirection}`]: flipMirror,
//                         },
//                         {
//                             animate: animationDuration !== 0,
//                             animation: {
//                                 duration: animationDuration,
//                             },
//                         },
//                     );
//                 })();
//             }
//         },
//
//         async toggleAFK() {
//             if (!settings.allowAFKToggle) {
//                 return;
//             }
//
//             const controlledTokens = game.canvas?.tokens?.controlled ?? [];
//             for (const token of controlledTokens) {
//                 if (!token.isOwner || !token.actor?.hasPlayerOwner) {
//                     continue;
//                 }
//
//                 const isAFK = token.document.getFlag(MODULE_NAME, AFK_STATE_KEY);
//
//                 if (isAFK) {
//                     await unsetAFK({ token, game, settings });
//                 } else {
//                     await setAFK({ token, game, settings });
//                 }
//             }
//         },
//     };
// }
//
// type UpdateTokenAFKOverlayParams = {
//     token: foundry.canvas.placeables.Token;
//     settings: Settings;
// };
//
// async function updateTokenAFKOverlay({ token, settings }: UpdateTokenAFKOverlayParams): Promise<void> {
//     const overlay = findChild(token, AFKOverlay) ?? new AFKOverlay(settings, token);
//
//     const isAFK = token.document.getFlag(MODULE_NAME, AFK_STATE_KEY);
//
//     if (!isAFK) {
//         overlay.hide();
//         return;
//     }
//
//     await overlay.show();
// }
//
// type AfkToggleParams = {
//     token: foundry.canvas.placeables.Token;
//     settings: Settings;
//     game: foundry.Game;
// };
//
// async function setAFK({ token, settings, game }: AfkToggleParams): Promise<void> {
//     await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, true);
//
//     if (!settings.showAFKStatusInChat) {
//         return;
//     }
//
//     await ChatMessage.create({
//         style: CONST.CHAT_MESSAGE_STYLES.OOC,
//         speaker: { token: token.id },
//         content: game.i18n?.format(LOCALIZATION.CHAT_AFK_MESSAGE, {
//             name: token.name,
//         }),
//     });
// }
//
// async function unsetAFK({ token, settings, game }: AfkToggleParams): Promise<void> {
//     await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, false);
//
//     if (settings.showAFKStatusInChat) {
//         return;
//     }
//
//     await ChatMessage.create({
//         style: CONST.CHAT_MESSAGE_STYLES.OOC,
//         speaker: { token: token.id },
//         content: game.i18n?.format(LOCALIZATION.CHAT_RETURNED_MESSAGE, {
//             name: token.name,
//         }),
//     });
// }
