import { MODULE_NAME } from "@/common/types/index";

export type KebabToCamelCase<S extends string> = S extends `${infer Head}-${infer Tail}`
    ? `${Lowercase<Head>}${KebabToCamelCaseRest<Tail>}`
    : Lowercase<S>;

type KebabToCamelCaseRest<S extends string> = S extends `${infer Head}-${infer Tail}`
    ? `${Capitalize<Head>}${KebabToCamelCaseRest<Tail>}`
    : Capitalize<S>;

export type KebabToShoutingSnakeCase<S extends string> = S extends `${infer Head}-${infer Tail}`
    ? `${Uppercase<Head>}_${KebabToShoutingSnakeCase<Tail>}`
    : Uppercase<S>;

export type WithoutModuleName<T extends string> = T extends `${typeof MODULE_NAME}.${infer K}` ? K : never;
export type WithModuleName<T extends string> = `${typeof MODULE_NAME}.${string & T}`;
export type Identity<T> = T extends object ? { [P in keyof T]: T[P] } : T;
export type Flatten<T> = {
    [K in keyof T]: T[K] extends Record<string | number | symbol, unknown>
        ? Flatten<{
              [P in keyof T[K] as `${K & (string | number)}.${P & (string | number)}`]: T[K][P];
          }>
        : { [P in K]: T[K] };
}[keyof T];
