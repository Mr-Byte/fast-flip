export interface TokenContainer extends PIXI.Container {
    show(): PromiseLike<void> | void;
    hide(): PromiseLike<void> | void;
}

interface ObjectType {
    // TypeScript requires the usage of `any[]` here to work.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]): PIXI.DisplayObject;
    readonly NAME: string;
}

/// Convenience function for finding children of a container with a specific type.
export function findChild<C extends ObjectType>(parent: PIXI.Container, containerType: C): InstanceType<C> | null {
    return parent.getChildByName(containerType.NAME, true);
}
