import { registerSettings } from "@/common/settings";
import * as tiles from "@/tiles";
import * as tokens from "@/tokens";

import Hooks = foundry.helpers.Hooks;

Hooks.once("init", async () => {
	if (!(game instanceof foundry.Game)) {
		console.error(
			"Game was not initialized, Fast Flip! Token Tools will not be functional.",
		);
		return;
	}

	const settings = registerSettings(game);

	tiles.initialize();
	tokens.initialize(settings);
});
