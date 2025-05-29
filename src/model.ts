// import { z } from "zod/v4-mini";

// export const ResourceTrigger = z.object({
//     triggerId: z.coerce.string(),
//     update: z.discriminatedUnion("type", [
//         z.object({ type: z.literal("reset"), resetValue: z.coerce.number() }),
//         z.object({ type: z.literal("delta"), deltaValue: z.coerce.number() }),
//     ]),
// });

// export const ResourceRange = z.object({
//     min: z.optional(z.coerce.number()),
//     max: z.optional(z.coerce.number()),
// });

// export const Resource = z.object({
//     name: z.coerce.string(),
//     id: z.coerce.string(),
//     icon: z.optional(z.coerce.string()),
//     currentValue: z.coerce.number(),
//     range: z.optional(ResourceRange),
//     trigger: z.optional(ResourceTrigger),
// });

// export type Resource = z.infer<typeof Resource>;
// export type ResourceTrigger = z.infer<typeof ResourceTrigger>;
// export type ResourceRange = z.infer<typeof ResourceRange>;

export const enum TileMirror {
    HORIZONTAL = "tileMirrorHorizontal",
    VERTICAL = "tileMirrorVertical",
}

export const enum TokenMirror {
    HORIZONTAL = "scaleX",
    VERTICAL = "scaleY",
}

export const AFK_STATE_KEY = "afk-state";
