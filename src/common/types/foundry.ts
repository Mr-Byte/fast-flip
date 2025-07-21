import type { Identity, WithModuleName } from "@/common/types/helpers";
import { MODULE_NAME } from "@/common/types/index";
import { TileMirror } from "@/tiles";
import { AFK_STATE_KEY } from "@/tokens/capabilities/afkOverlay";
import { FlipDirection } from "@/tokens/capabilities/tokenFlipping";

export {};

type SettingNameToTypeMap = {
    "animation-duration": number;
    "allow-afk-toggle": boolean;
    "show-afk-status-in-chat": boolean;
    "show-mirror-buttons-hud": boolean;
    "show-toggle-afk-hud": boolean;
    "afk-overlay-icon-path": string;
    "allow-speech-bubbles": boolean;
    "speech-bubble-font-size": number;
};

type SettingsConfigBase = Identity<{
    [K in keyof SettingNameToTypeMap as WithModuleName<K>]: SettingNameToTypeMap[K];
}>;

declare global {
    interface SettingConfig extends SettingsConfigBase {}
}

declare module "fvtt-types/configuration" {
    interface FlagConfig {
        Token: {
            [MODULE_NAME]: {
                [FlipDirection.HORIZONTAL]: boolean;
                [FlipDirection.VERTICAL]: boolean;
                [AFK_STATE_KEY]: boolean;
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
