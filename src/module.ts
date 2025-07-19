import * as tiles from "@/tiles";
import * as tokens from "@/tokens";
import { registerSettings } from "@/common/settings";

Hooks.once("init", async () => {
    if (!(game instanceof foundry.Game)) {
        console.error("Game was not initialized, Fast Flip! Token Tools will not be functional.");
        return;
    }

    const settings = registerSettings(game);

    tiles.initialize();
    tokens.initialize(settings);
});

//
// function registerKeybindings(
//     game: foundry.Game,
//     tokenManager: TokenManager,
//     tileManager: TileManager,
//     speechManager: SpeechManager,
// ) {

//

//     const onStartSpeaking: () => void = async () => {
//         await speechManager.showSpeechBubble();
//     };
//     const onStopSpeaking = () => {
//         speechManager.hideSpeechBubble();
//     };
//     game.keybindings?.register(MODULE_NAME, LOCALIZATION.SHOW_SPEECH_BUBBLE_HOTKEY, {
//         name: LOCALIZATION.SHOW_SPEECH_BUBBLE_HOTKEY,
//         hint: game.i18n?.localize(LOCALIZATION.SHOW_SPEECH_BUBBLE_HINT),
//         editable: [{ key: "KeyS", modifiers: ["ALT"] }],
//         onDown: onStartSpeaking,
//         onUp: onStopSpeaking,
//         precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
//         restricted: false,
//         reservedModifiers: [],
//         repeat: false,
//     });
// }
