export {};

Object.assign(globalThis, {
    fastFlip: {
        resourceTracker: {},
    },
});

declare global {
    // eslint-disable-next-line no-var
    var fastFlip: {
        resourceTracker: {
            addTrigger(name: string, registration: unknown): void;
        };
    };
}
