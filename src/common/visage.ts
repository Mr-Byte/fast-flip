import type { VisageApi } from "@/common/types/visage";

export const VISAGE_MODULE_ID = "visage";

const REQUIRED_METHODS = [
	"apply",
	"remove",
	"revert",
	"isActive",
	"getAvailable",
] as const;

// Returns nothing if a future Visage version drops any of these methods, so
// callers never call into an API that has changed shape.
export function getVisageApi(): VisageApi | undefined {
	const module = game.modules?.get(VISAGE_MODULE_ID);

	if (!module?.active) {
		return undefined;
	}

	const api = module.api;

	if (
		!api ||
		REQUIRED_METHODS.some((method) => typeof api[method] !== "function")
	) {
		return undefined;
	}

	return api as VisageApi;
}

export function isVisageActive(): boolean {
	return game.modules?.get(VISAGE_MODULE_ID)?.active ?? false;
}
