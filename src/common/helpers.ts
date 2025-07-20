import { MODULE_NAME } from "@/common/constants";

export function getIcon(icon: string) {
    return `modules/${MODULE_NAME}/icons/${icon}.svg` as const;
}
