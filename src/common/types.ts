import { TileMirror } from "@/tiles";
import { AFK_STATE_KEY } from "@/tokens/capabilities/afkOverlay";
import { FlipDirection } from "@/tokens/capabilities/tokenFlipping";
import type localization from "../../static/lang/en.json";

export {};

export const MODULE_NAME = "fast-flip";

export type KebabToShoutingSnakeCase<S extends string> = S extends `${infer Head}-${infer Tail}`
    ? `${Uppercase<Head>}_${KebabToShoutingSnakeCase<Tail>}`
    : Uppercase<S>;

export type KebabToCamelCase<S extends string> = S extends `${infer Head}-${infer Tail}`
    ? `${Lowercase<Head>}${KebabToCamelCaseRest<Tail>}`
    : Lowercase<S>;

type KebabToCamelCaseRest<S extends string> = S extends `${infer Head}-${infer Tail}`
    ? `${Capitalize<Head>}${KebabToCamelCaseRest<Tail>}`
    : Capitalize<S>;

export type WithoutModuleName<T extends string> = T extends `${typeof MODULE_NAME}.${infer K}` ? K : never;
export type WithModuleName<T extends string> = `${typeof MODULE_NAME}.${string & T}`;
export type Identity<T> = T extends object ? { [P in keyof T]: T[P] } : T;

export type Settings = Identity<{
    [K in keyof SettingConfig as KebabToShoutingSnakeCase<WithoutModuleName<K>>]: WithoutModuleName<K>;
}>;

export type LocalizationKeys = Identity<{
    [K in keyof typeof localization as KebabToShoutingSnakeCase<WithoutModuleName<K>>]: K;
}>;

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

type SettingEntryMapping = Identity<{
    [K in keyof SettingConfig as K extends WithModuleName<infer _> ? K : never]: [
        WithoutModuleName<K>,
        RegisterOptions,
    ];
}>;

export type SettingEntries = Identity<SettingEntryMapping[keyof SettingEntryMapping][]>;
