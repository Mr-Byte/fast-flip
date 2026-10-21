import type { Simplify } from "type-fest";
import { REFRESH_RAISE_HAND_OVERLAYS_HOOK } from "@/common/constants";
import type { WithModuleName } from "@/common/types/helpers";
import { MODULE_NAME } from "@/common/types/index";
import { TileMirror } from "@/tiles";
import { AFK_STATE_KEY } from "@/tokens/capabilities/afkOverlay";
import {
	RAISED_HAND_AT_KEY,
	RAISED_HAND_BY_KEY,
} from "@/tokens/capabilities/raiseHand";
import { FLIP_FLAG, FlipDirection } from "@/tokens/capabilities/tokenFlipping";
import type { SocketMessage } from "@/tokens/messages";

type ModuleSocketEventName = `module.${typeof MODULE_NAME}`;

interface ModuleSocket extends io.Socket {
	emit<Ev extends string>(
		event: Ev,
		...args: Ev extends ModuleSocketEventName
			? [message: SocketMessage]
			: unknown[]
	): this;
}

declare global {
	interface InitGame {
		readonly socket: ModuleSocket;
	}
	interface I18nInitGame {
		readonly socket: ModuleSocket;
	}
	interface SetupGame {
		readonly socket: ModuleSocket;
	}
	interface ReadyGame {
		readonly socket: ModuleSocket;
	}
}

type SettingNameToTypeMap = {
	"animation-duration": number;
	"allow-afk-toggle": boolean;
	"show-afk-status-in-chat": boolean;
	"show-mirror-buttons-hud": boolean;
	"show-toggle-afk-hud": boolean;
	"afk-overlay-icon-path": string;
	"allow-speech-bubbles": boolean;
	"speech-bubble-font-size": number;
	"allow-raise-hand": boolean;
	"show-raise-hand-status-in-chat": boolean;
	"show-toggle-raise-hand-hud": boolean;
	"raise-hand-overlay-icon-path": string;
	"raise-hand-number-anchor-x": number;
	"raise-hand-number-anchor-y": number;
	"allow-token-image-wheel": boolean;
	"token-image-wheel-transition": string;
};

type SettingsConfigBase = Simplify<{
	[K in keyof SettingNameToTypeMap as WithModuleName<K>]: SettingNameToTypeMap[K];
}>;

declare global {
	interface SettingConfig extends SettingsConfigBase {}
}

declare module "fvtt-types/configuration" {
	namespace Hooks {
		interface HookConfig {
			[REFRESH_RAISE_HAND_OVERLAYS_HOOK]: () => void;
		}
	}

	interface FlagConfig {
		Token: {
			[MODULE_NAME]: {
				[FlipDirection.HORIZONTAL]: number;
				[FlipDirection.VERTICAL]: number;
				[AFK_STATE_KEY]: boolean;
				[RAISED_HAND_AT_KEY]: number;
				[RAISED_HAND_BY_KEY]: string;
				[FLIP_FLAG]: boolean;
			};
		};
		Tile: {
			[MODULE_NAME]: {
				[TileMirror.HORIZONTAL]: boolean;
				[TileMirror.VERTICAL]: boolean;
			};
		};
	}
}
