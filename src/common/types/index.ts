import type localization from "@/../static/lang/en.json";
import type { Identity, KebabToCamelCase, KebabToShoutingSnakeCase, WithoutModuleName } from "@/common/types/helpers";

export const MODULE_NAME = "fast-flip";

export type ModuleSettings = Identity<{
    [K in keyof SettingConfig as KebabToCamelCase<WithoutModuleName<K>>]: SettingConfig[K];
}>;

export type SettingsKeys = Identity<{
    [K in keyof SettingConfig as KebabToShoutingSnakeCase<WithoutModuleName<K>>]: WithoutModuleName<K>;
}>;

export type LocalizationKeys = Identity<{
    [K in keyof typeof localization as KebabToShoutingSnakeCase<WithoutModuleName<K>>]: K;
}>;
