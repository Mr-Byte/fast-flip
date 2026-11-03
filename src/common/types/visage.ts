// Visage ships no type definitions, so these cover only the parts of its API
// used here, as of Visage v5.12.

export type VisageMode = "identity" | "overlay";

export type VisageChanges = {
	texture?: { src?: string | null } | null;
	[key: string]: unknown;
};

export type VisageEntry = {
	id: string;
	label: string;
	// Visage fills this in on save, but older data may lack it.
	mode?: VisageMode;
	tags?: string[];
	changes?: VisageChanges;
	type: "local" | "global";
	// Set while the visage sits in Visage's bin.
	deleted?: boolean;
};

type TokenRef = foundry.canvas.placeables.Token | string;

export type VisageApi = {
	apply(
		token: TokenRef,
		visageId: string,
		options?: { switchIdentity?: boolean; clearStack?: boolean },
	): Promise<boolean>;
	remove(token: TokenRef, visageId: string): Promise<boolean>;
	// Unlike apply and remove, this resolves nothing on success.
	revert(token: TokenRef): Promise<boolean | undefined>;
	isActive(token: TokenRef, visageId: string): boolean;
	// Already hides private and hidden visages from players.
	getAvailable(token: TokenRef): VisageEntry[];
	// Attached in Visage's own init hook, so it may not exist yet.
	Data?: {
		getRepresentativeImage?(changes: VisageChanges | undefined): string;
	};
};
