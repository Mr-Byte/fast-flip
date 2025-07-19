import type { ButtonGroupProps } from "@/common/placeableHud";

export interface Capability {
    hudButtonGroups: ButtonGroupProps<foundry.canvas.placeables.Token>[];
    keybinds?: { name: string; config: foundry.helpers.interaction.ClientKeybindings.KeybindingActionConfig }[];
}
