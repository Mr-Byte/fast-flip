import { Settings } from "configuration";
import { z } from "zod/v4-mini";

export const Resource = z.object({
    name: z.coerce.string(),
    id: z.coerce.string(),
    icon: z.optional(z.coerce.string()),
    currentValue: z.coerce.number(),
    range: z.optional(
        z.object({
            min: z.optional(z.coerce.number()),
            max: z.optional(z.coerce.number()),
        }),
    ),
    trigger: z.optional(
        z.object({
            triggerId: z.coerce.string(),
            update: z.discriminatedUnion("type", [
                z.object({ type: z.literal("reset"), resetValue: z.coerce.number() }),
                z.object({ type: z.literal("delta"), deltaValue: z.coerce.number() }),
            ]),
        }),
    ),
});

export type Resource = z.infer<typeof Resource>;

// export type Resource = Record<string, unknown>;

export const enum TileMirror {
    HORIZONTAL = "tileMirrorHorizontal",
    VERTICAL = "tileMirrorVertical",
}

export const enum TokenMirror {
    HORIZONTAL = "scaleX",
    VERTICAL = "scaleY",
}

export const AFK_STATE_KEY = "afk-state";

export const SETTING: Settings = {
    ANIMATION_DURATION: "animation-duration",
    ALLOW_AFK_TOGGLE: "allow-afk-toggle",
    SHOW_AFK_STATUS_IN_CHAT: "show-afk-status-in-chat",
    SHOW_MIRROR_BUTTONS_HUD: "show-mirror-buttons-hud",
    SHOW_TOGGLE_AFK_HUD: "show-toggle-afk-hud",
    AFK_OVERLAY_ICON_PATH: "afk-overlay-icon-path",
    ALLOW_SPEECH_BUBBLES: "allow-speech-bubbles",
    SPEECH_BUBBLE_FONT_SIZE: "speech-bubble-font-size",
} as const;
