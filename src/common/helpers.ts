import { MODULE_NAME } from "@/common/constants";

export function getIcon(icon: string) {
	return `modules/${MODULE_NAME}/icons/${icon}.svg` as const;
}

// Since Foundry v14, flag deletions and replacements arrive under the plain
// flag key with a DataFieldOperator value, so one path covers set, unset,
// and replace. Legacy `-=`/`==` key spellings are not supported.
export function hasModuleFlagChange(change: object, key: string): boolean {
	return foundry.utils.hasProperty(change, `flags.${MODULE_NAME}.${key}`);
}

// The operator is cast to the field's own type so it can be used in
// strongly typed update data.
export function forcedDeletion<T>(): T {
	return foundry.data.operators.ForcedDeletion.create() as T;
}
