import { Settings } from "configuration";
import { z } from "zod/v4";

export const ResourceSchema = z.object({
    name: z.string(),
    id: z.string(), // TODO: Refine this xdd
    icon: z.string().optional(),
    range: z
        .object({
            min: z.number().optional(),
            max: z.number().optional(),
        })
        .optional(),
    trigger: z
        .object({
            type: z.unknown(),
            resetValue: z.number(),
        })
        .optional(),
});

export type Resource = z.infer<typeof ResourceSchema>;

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
