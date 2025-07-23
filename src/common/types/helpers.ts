import { MODULE_NAME } from "@/common/types/index";
import type { ConditionalExcept, Get, Paths, Split } from "type-fest";
import type { FixPathSquareBrackets } from "type-fest/source/get";

export type WithoutModuleName<T extends string> = T extends `${typeof MODULE_NAME}.${infer K}` ? K : never;
export type WithModuleName<T extends string> = `${typeof MODULE_NAME}.${string & T}`;

type ToPath<S extends string> = Split<FixPathSquareBrackets<S>, ".", { strictLiteralChecks: false }>;

export type Flattened<T extends Record<string, unknown>> = ConditionalExcept<
    {
        [K in Paths<T>]: Get<T, ToPath<`${K & string}`>>;
    },
    object
>;
