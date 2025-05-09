export interface TokenContainer extends PIXI.Container {
    show(): PromiseLike<void> | void;
    hide(): PromiseLike<void> | void;
}

interface ObjectType {
    new (...args: any[]): PIXI.DisplayObject;
    readonly NAME: string;
}

type ReturnType<C> = C extends new (...args: any[]) => infer R
    ? R extends PIXI.DisplayObject
        ? R
        : never
    : never;

/// Convenience function for finding children of a container with a specific type.
export function findChild<C extends ObjectType>(
    parent: PIXI.Container,
    containerType: C,
): ReturnType<C> | undefined {
    return parent.getChildByName(containerType.NAME, true) as
        | ReturnType<C>
        | undefined;
}
