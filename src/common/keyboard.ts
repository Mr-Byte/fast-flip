type AltKeys = (typeof foundry.helpers.interaction.KeyboardManager.MODIFIER_CODES.Alt)[number];
type CtrlKeys = (typeof foundry.helpers.interaction.KeyboardManager.MODIFIER_CODES.Control)[number];
type ShiftKeys = (typeof foundry.helpers.interaction.KeyboardManager.MODIFIER_CODES.Shift)[number];

export function normalizeKeys(keys: Set<string>): Set<string> {
    const normalizedKeys = new Set<string>();

    for (const key of keys) {
        if (foundry.helpers.interaction.KeyboardManager.MODIFIER_CODES.Alt.indexOf(key as AltKeys) >= 0) {
            normalizedKeys.add(foundry.helpers.interaction.KeyboardManager.MODIFIER_KEYS.ALT);
            continue;
        }

        if (foundry.helpers.interaction.KeyboardManager.MODIFIER_CODES.Control.indexOf(key as CtrlKeys) >= 0) {
            normalizedKeys.add(foundry.helpers.interaction.KeyboardManager.MODIFIER_KEYS.CONTROL);
            continue;
        }

        if (foundry.helpers.interaction.KeyboardManager.MODIFIER_CODES.Shift.indexOf(key as ShiftKeys) >= 0) {
            normalizedKeys.add(foundry.helpers.interaction.KeyboardManager.MODIFIER_KEYS.SHIFT);
            continue;
        }

        normalizedKeys.add(key);
    }

    return normalizedKeys;
}
