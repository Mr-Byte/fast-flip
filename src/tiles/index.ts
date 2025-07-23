import { LOCALIZATION, MODULE_NAME } from "@/common/constants";
import { getIcon } from "@/common/helpers";
import { setupPlaceableHUD } from "@/common/placeableHud";

import Hooks = foundry.helpers.Hooks;

export const enum TileMirror {
    HORIZONTAL = "tileMirrorHorizontal",
    VERTICAL = "tileMirrorVertical",
}

export function initialize(): void {
    Hooks.on("canvasReady", () => {
        const allTiles = game.canvas?.tiles?.tiles ?? [];

        for (const tile of allTiles) {
            updateTile(tile);
        }
    });

    Hooks.on("updateTile", (update) => {
        if (!(update._id && update.flags?.[MODULE_NAME])) {
            return;
        }

        const tile = game.canvas?.tiles?.get(update._id);

        if (tile) {
            updateTile(tile);
        }
    });

    setupPlaceableHUD("TileHUD", [
        {
            side: "left",
            buttons: [
                {
                    title: LOCALIZATION.TEXT_FLIP_TILE_HORIZONTAL_BUTTON,
                    icon: getIcon("mirror-horizontal"),
                    onClick: () => void mirrorSelectedTiles(TileMirror.HORIZONTAL),
                },
                {
                    title: LOCALIZATION.TEXT_FLIP_TILE_VERTICAL_BUTTON,
                    icon: getIcon("mirror-vertical"),
                    onClick: () => void mirrorSelectedTiles(TileMirror.VERTICAL),
                },
            ],
        },
    ]);

    game?.keybindings?.register(MODULE_NAME, "flipTile", {
        name: LOCALIZATION.KEYBINDS_FLIP_TILE_HOTKEY,
        hint: LOCALIZATION.KEYBINDS_FLIP_TILE_HINT,
        editable: [{ key: "KeyG" }],
        onDown: (event) => void mirrorSelectedTiles(event.isShift ? TileMirror.VERTICAL : TileMirror.HORIZONTAL),
        precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        restricted: true,
        reservedModifiers: ["SHIFT"],
        repeat: false,
    });

    async function mirrorSelectedTiles(tileMirrorDirection: TileMirror): Promise<void> {
        const controlledTiles = game.canvas?.tiles?.controlled ?? [];

        for (const tile of controlledTiles) {
            const previousState = tile.document.getFlag(MODULE_NAME, tileMirrorDirection);
            await tile.document.setFlag(MODULE_NAME, tileMirrorDirection, !previousState);
        }
    }

    function updateTile(tile: foundry.canvas.placeables.Tile) {
        if (!tile.texture) {
            return;
        }

        const flipHorizontal = tile.document.getFlag(MODULE_NAME, TileMirror.HORIZONTAL);
        const flipVertical = tile.document.getFlag(MODULE_NAME, TileMirror.VERTICAL);
        const mirrorHorizontal = flipHorizontal ? PIXI.groupD8.MIRROR_HORIZONTAL : 0;
        const mirrorVertical = flipVertical ? PIXI.groupD8.MIRROR_VERTICAL : 0;
        tile.texture.rotate = PIXI.groupD8.add(mirrorHorizontal, mirrorVertical);
        tile.refresh();
    }
}
