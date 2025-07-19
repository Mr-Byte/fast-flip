import { MODULE_NAME } from "@/common/constants";

export type KebabToShoutingSnake<S extends string> = S extends `${infer Head}-${infer Tail}`
    ? `${Uppercase<Head>}_${KebabToShoutingSnake<Tail>}`
    : Uppercase<S>;

export type WithoutModuleName<T extends string> = T extends `${typeof MODULE_NAME}.${infer K}` ? K : never;
export type WithModuleName<T extends string> = `${typeof MODULE_NAME}.${string & T}`;
export type Identity<T> = T extends object ? { [P in keyof T]: T[P] } : T;
