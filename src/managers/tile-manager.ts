import { MODULE_NAME } from "../constants";
import { TileMirror } from "../model";

export type TileManager = {
    mirrorSelectedTiles(tileMirrorDirection: TileMirror): Promise<void>;
};

export function setupTileManager(game: foundry.Game): TileManager {
    foundry.helpers.Hooks.on("canvasReady", () => {
        const allTiles = game.canvas?.tiles?.tiles ?? [];

        for (const tile of allTiles) {
            updateTile(tile);
        }
    });

    foundry.helpers.Hooks.on("updateTile", (update) => {
        if (!(update._id && typeof update._id === "string" && update.flags?.[MODULE_NAME])) {
            return;
        }

        const tile = game.canvas?.tiles?.get(update._id);

        if (tile) {
            updateTile(tile);
        }
    });

    return {
        async mirrorSelectedTiles(tileMirrorDirection: TileMirror): Promise<void> {
            const controlledTiles = game.canvas?.tiles?.controlled ?? [];

            for (const tile of controlledTiles) {
                const previousState = tile.document.getFlag(MODULE_NAME, tileMirrorDirection);
                await tile.document.setFlag(MODULE_NAME, tileMirrorDirection, !previousState);
            }
        },
    };
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
