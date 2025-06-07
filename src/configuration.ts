import { AFK_STATE_KEY, type Resource, TileMirror, TokenMirror } from "./model";

import { MODULE_NAME } from "./constants";

export {};

declare module "fvtt-types/configuration" {
    interface FlagConfig {
        Token: {
            [MODULE_NAME]: {
                [TokenMirror.HORIZONTAL]: boolean;
                [TokenMirror.VERTICAL]: boolean;
                [AFK_STATE_KEY]: boolean;
            };
        };
        Actor: {
            [MODULE_NAME]: {
                resources?: Map<string, Resource>;
            };
        };
        Tile: {
            [MODULE_NAME]: {
                [TileMirror.HORIZONTAL]: boolean;
                [TileMirror.VERTICAL]: boolean;
            };
        };
    }
}

declare global {
    interface SettingConfig {
        "fast-flip.animation-duration": number;
        "fast-flip.allow-afk-toggle": boolean;
        "fast-flip.show-afk-status-in-chat": boolean;
        "fast-flip.show-mirror-buttons-hud": boolean;
        "fast-flip.show-toggle-afk-hud": boolean;
        "fast-flip.afk-overlay-icon-path": string;
        "fast-flip.allow-speech-bubbles": boolean;
        "fast-flip.speech-bubble-font-size": number;
    }
}

type RegisterOptions = ClientSettings.RegisterOptions<string | number | boolean>;

type SettingEntryMapping = {
    [K in keyof SettingConfig as K extends `fast-flip.${infer P}` ? P : never]: K extends `fast-flip.${infer P}`
        ? [P, RegisterOptions]
        : never;
};

export type SettingEntries = SettingEntryMapping[keyof SettingEntryMapping][];

type KebabToShoutingSnake<S extends string> = S extends `${infer Head}-${infer Tail}`
    ? `${Uppercase<Head>}_${KebabToShoutingSnake<Tail>}`
    : Uppercase<S>;

export type Settings = {
    [K in keyof SettingConfig as K extends `fast-flip.${infer P}`
        ? KebabToShoutingSnake<P>
        : never]: K extends `fast-flip.${infer P}` ? P : never;
};

export const SETTING: Settings = {
    ANIMATION_DURATION: "animation-duration",
    ALLOW_AFK_TOGGLE: "allow-afk-toggle",
    SHOW_AFK_STATUS_IN_CHAT: "show-afk-status-in-chat",
    SHOW_MIRROR_BUTTONS_HUD: "show-mirror-buttons-hud",
    SHOW_TOGGLE_AFK_HUD: "show-toggle-afk-hud",
    AFK_OVERLAY_ICON_PATH: "afk-overlay-icon-path",
    ALLOW_SPEECH_BUBBLES: "allow-speech-bubbles",
    SPEECH_BUBBLE_FONT_SIZE: "speech-bubble-font-size",
};
