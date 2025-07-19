import type { Identity, WithModuleName } from "@/common/types";
import { AFK_STATE_KEY } from "@/tokens/capabilities/afkOverlay";
import { FlipDirection } from "@/tokens/capabilities/tokenFlipping";
import { MODULE_NAME } from "@/common/constants";
import { TileMirror } from "@/tiles";

export {};

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

type SettingsConfigMapping = {
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
    [K in keyof SettingsConfigMapping as WithModuleName<K>]: SettingsConfigMapping[K];
}>;

declare global {
    interface SettingConfig extends SettingsConfigBase {}
}

type RegisterOptions = foundry.helpers.ClientSettings.RegisterData<
    string | number | boolean,
    typeof MODULE_NAME,
    foundry.helpers.ClientSettings.KeyFor<typeof MODULE_NAME>
>;

type SettingEntryMapping = {
    [K in keyof SettingConfig as K extends `${typeof MODULE_NAME}.${infer P}`
        ? P
        : never]: K extends `${typeof MODULE_NAME}.${infer P}` ? [P, RegisterOptions] : never;
};

export type SettingEntries = Identity<SettingEntryMapping[keyof SettingEntryMapping][]>;
