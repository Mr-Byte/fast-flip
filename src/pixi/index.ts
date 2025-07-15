export interface TokenContainer extends PIXI.Container {
    show(): PromiseLike<void> | void;
    hide(): PromiseLike<void> | void;
}

type NamedDisplayObjectType<C> = C extends {
    new (...args: infer _): PIXI.DisplayObject;
    readonly NAME: string;
}
    ? C
    : never;

type NamedDisplayObject<C> = InstanceType<NamedDisplayObjectType<C>>;

export function findChild<C>(
    parent: PIXI.Container,
    containerType: NamedDisplayObjectType<C>,
): NamedDisplayObject<C> | null {
    return parent.getChildByName(containerType.NAME, true);
}
