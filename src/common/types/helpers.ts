import { MODULE_NAME } from "@/common/types/index";
import type { ConditionalPick, Get, Paths, Primitive, Split } from "type-fest";
import type { FixPathSquareBrackets } from "type-fest/source/get";

export type WithoutModuleName<T extends string> = T extends `${typeof MODULE_NAME}.${infer K}` ? K : never;
export type WithModuleName<T extends string> = `${typeof MODULE_NAME}.${string & T}`;

export type Flattened<T> = ConditionalPick<FlattenedInner<T>, Primitive>;

type FlattenedInner<T> = {
    [K in Paths<T>]: Get<T, Split<FixPathSquareBrackets<`${K & string}`>, ".", { strictLiteralChecks: true }>>;
};
