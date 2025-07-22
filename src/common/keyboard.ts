import KeyboardManager = foundry.helpers.interaction.KeyboardManager;

export function normalizeKeys(keys: Set<string>): Set<string> {
    const normalizedKeys = new Set<string>();

    for (const key of keys) {
        if (KeyboardManager.MODIFIER_CODES.Alt.indexOf(key) >= 0) {
            normalizedKeys.add(KeyboardManager.MODIFIER_KEYS.ALT);
            continue;
        }

        if (KeyboardManager.MODIFIER_CODES.Control.indexOf(key) >= 0) {
            normalizedKeys.add(KeyboardManager.MODIFIER_KEYS.CONTROL);
            continue;
        }

        if (KeyboardManager.MODIFIER_CODES.Shift.indexOf(key) >= 0) {
            normalizedKeys.add(KeyboardManager.MODIFIER_KEYS.SHIFT);
            continue;
        }

        normalizedKeys.add(key);
    }

    return normalizedKeys;
}
