import { MODULE_NAME } from "../constants";
import { TileMirror } from "../model";

export class TileManager {
    readonly #game: foundry.Game;

    constructor(game: foundry.Game) {
        this.#game = game;

        foundry.helpers.Hooks.on("updateTile", this.#onUpdateTile.bind(this));
        foundry.helpers.Hooks.on("canvasReady", this.#onCanvasReady.bind(this));
    }

    async mirrorSelectedTiles(tileMirrorDirection: TileMirror): Promise<void> {
        for (const tile of this.#controlledTiles) {
            const previousState = tile.document.getFlag(MODULE_NAME, tileMirrorDirection);
            await tile.document.setFlag(MODULE_NAME, tileMirrorDirection, !previousState);
        }
    }

    #onCanvasReady(): void {
        for (const tile of this.#allTiles) {
            this.#updateTileOrientation(tile);
        }
    }

    #onUpdateTile(_: unknown, update: foundry.abstract.Document.UpdateDataForName<"Tile">): void {
        if (update._id && typeof update._id === "string" && update.flags?.[MODULE_NAME]) {
            const tile = this.#findTile(update._id);

            if (tile) {
                this.#updateTileOrientation(tile);
            }
        }
    }

    #updateTileOrientation(tile: foundry.canvas.placeables.Tile): void {
        if (tile.texture) {
            const flipHorizontal = tile.document.getFlag(MODULE_NAME, TileMirror.HORIZONTAL);
            const flipVertical = tile.document.getFlag(MODULE_NAME, TileMirror.VERTICAL);
            const mirrorHorizontal = flipHorizontal ? PIXI.groupD8.MIRROR_HORIZONTAL : 0;
            const mirrorVertical = flipVertical ? PIXI.groupD8.MIRROR_VERTICAL : 0;
            tile.texture.rotate = PIXI.groupD8.add(mirrorHorizontal, mirrorVertical);
            tile.refresh();
        }
    }

    get #allTiles(): foundry.canvas.placeables.Tile[] {
        return this.#game.canvas?.tiles?.tiles ?? [];
    }

    get #controlledTiles(): foundry.canvas.placeables.Tile[] {
        return this.#game.canvas?.tiles?.controlled ?? [];
    }

    #findTile(id: string): foundry.canvas.placeables.Tile | undefined {
        return this.#game.canvas?.tiles?.get(id);
    }
}
