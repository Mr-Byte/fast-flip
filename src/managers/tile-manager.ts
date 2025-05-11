import { MODULE_NAME } from "../constants";
import { TileMirror } from "../configuration";
export { TileMirror } from "../configuration";

export class TileManager {
    readonly #game: Game;

    constructor(game: Game) {
        this.#game = game;

        Hooks.on("updateTile", this.#onUpdateTile.bind(this));
        Hooks.on("canvasReady", this.#onCanvasReady.bind(this));
    }

    async mirrorSelectedTiles(tileMirrorDirection: TileMirror): Promise<void> {
        for (const tile of this.#controlledTiles) {
            const previousState = tile.document.getFlag(
                MODULE_NAME,
                tileMirrorDirection,
            );
            await tile.document.setFlag(
                MODULE_NAME,
                tileMirrorDirection,
                !previousState,
            );
        }
    }

    #onCanvasReady(): void {
        for (const tile of this.#allTiles) {
            this.#updateTileOrientation(tile);
        }
    }

    #onUpdateTile(_: unknown, update: foundry.documents.BaseTile): void {
        if (update._id && update.flags?.[MODULE_NAME]) {
            const tile = this.#findTile(update._id);

            if (tile) {
                this.#updateTileOrientation(tile);
            }
        }
    }

    #updateTileOrientation(tile: Tile): void {
        if (tile.texture) {
            const flipHorizontal = tile.document.getFlag(
                MODULE_NAME,
                TileMirror.HORIZONTAL,
            );
            const flipVerical = tile.document.getFlag(
                MODULE_NAME,
                TileMirror.VERTICAL,
            );
            const mirrorHorizontal = flipHorizontal
                ? PIXI.groupD8.MIRROR_HORIZONTAL
                : 0;
            const mirrorVertical = flipVerical
                ? PIXI.groupD8.MIRROR_VERTICAL
                : 0;
            const rotate = PIXI.groupD8.add(mirrorHorizontal, mirrorVertical);

            tile.texture.rotate = rotate;
            tile.refresh();
        }
    }

    get #allTiles(): Tile[] {
        return this.#game.canvas?.tiles?.tiles ?? [];
    }

    get #controlledTiles(): Tile[] {
        return this.#game.canvas?.tiles?.controlled ?? [];
    }

    #findTile(id: string): Tile | undefined {
        return this.#game.canvas?.tiles?.get(id);
    }
}
