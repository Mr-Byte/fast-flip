import type localization from "@/../static/lang/en.json";
import type { Flattened, WithoutModuleName } from "@/common/types/helpers";
import type { CamelCasedProperties, Replace, ScreamingSnakeCase, Simplify } from "type-fest";

export const MODULE_NAME = "fast-flip";

export type ModuleSettings = CamelCasedProperties<{
    [K in keyof SettingConfig as WithoutModuleName<K>]: SettingConfig[K];
}>;

export type SettingsKeys = Simplify<{
    [K in keyof SettingConfig as ScreamingSnakeCase<WithoutModuleName<K>>]: WithoutModuleName<K>;
}>;

export type LocalizationKeys = Simplify<{
    [K in keyof Flattened<typeof localization> as Replace<
        ScreamingSnakeCase<WithoutModuleName<K>>,
        ".",
        "_",
        { all: true }
    >]: K;
}>;
