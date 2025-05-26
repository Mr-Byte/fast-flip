export {};

Object.assign(globalThis, {
    fastFlip: {
        resourceTracker: {},
    },
});

export type OnAddTriggerFn = (triggerId: string, actorId: string, resourceId: string) => void;
export type OnRemoveTriggerFn = (triggerId: string, actorId: string, resourceId: string) => void;
export type TriggerCallbackFn = (triggerId: string, actorId: string, resourceId: string) => void;
export type AddTriggerResult = {
    triggerId: string;
    callback: TriggerCallbackFn;
};

declare global {
    // eslint-disable-next-line no-var
    var fastFlip: {
        resourceTracker: {
            /**
             * Register a new resource trigger with Fast Flip. This trigger can be added to an actor's resources
             * as a way for system specific integrations to trigger the resoure update.
             *
             * @param name The localized display name of the trigger being added
             * @param add Handler to be called whenever the trigger is added to an actor's resource
             * @param remove Handle to be called whenever the trigger is removed from an actor's resource
             * @returns Returns a
             */
            addTrigger(name: string, add: OnAddTriggerFn, remove: OnRemoveTriggerFn): AddTriggerResult;
        };
    };
}
