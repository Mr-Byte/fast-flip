import type { Settings } from "@/common/settings";

import Container = PIXI.Container;
import PreciseText = foundry.canvas.containers.PreciseText;
import GlowOverlayFilter = foundry.canvas.rendering.filters.GlowOverlayFilter;

const FIRST_IN_LINE_TINT = 0xffd700;
const DEFAULT_TINT = 0xffffff;

// Desaturates and slightly darkens a tint, so hands that are not first in
// line read as a grayed-out version of the player's color.
function mutedTint(tint: number): number {
	const [red, green, blue] = foundry.utils.Color.from(tint).rgb;
	const gray = 0.299 * red + 0.587 * green + 0.114 * blue;
	const mute = (channel: number) => (channel + (gray - channel) * 0.65) * 0.85;

	return foundry.utils.Color.fromRGB([
		mute(red),
		mute(green),
		mute(blue),
	]).valueOf();
}

// The core filter pulses between 0.5x and 2x every 2 seconds, which is too
// fast and too intense for a persistent marker. This slows the pulse down
// and narrows its range to a subtle breathing effect.
class RaiseHandGlowFilter extends GlowOverlayFilter {
	static readonly #PULSE_PERIOD_MS = 4000;

	override apply(
		filterManager: PIXI.FilterSystem,
		input: PIXI.RenderTexture,
		output: PIXI.RenderTexture,
		clear: PIXI.CLEAR_MODES,
	): void {
		const canvas = game.canvas;
		let strength = canvas?.stage?.worldTransform.d ?? 1;

		if (this.animated && !canvas?.photosensitiveMode) {
			const time = canvas?.app?.ticker.lastTime ?? 0;
			const phase = (2 * Math.PI * time) / RaiseHandGlowFilter.#PULSE_PERIOD_MS;
			strength *= 0.825 + 0.175 * Math.sin(phase);
		}

		// biome-ignore lint/complexity/useLiteralKeys: uniforms is an index signature, so TS4111 requires bracket access
		this.uniforms["outerStrength"] = this.outerStrength * strength;
		// biome-ignore lint/complexity/useLiteralKeys: uniforms is an index signature, so TS4111 requires bracket access
		this.uniforms["innerStrength"] = this.innerStrength * strength;
		filterManager.applyFilter(this, input, output, clear);
	}
}

export class RaiseHandOverlay extends Container {
	readonly #settings: Settings;
	readonly #token: Token;
	static readonly NAME = "raise-hand-overlay";

	#sprite: PIXI.Sprite | null = null;
	#badge: PreciseText | null = null;

	constructor(settings: Settings, token: Token) {
		super();

		this.name = RaiseHandOverlay.NAME;
		this.#settings = settings;
		this.#token = token;
		this.#token.addChild(this);
	}

	async show(
		position: number,
		isFirst: boolean,
		color: foundry.utils.Color | null,
	): Promise<void> {
		const token = this.#token;
		const texture = await foundry.canvas.loadTexture(
			this.#settings.raiseHandOverlayIconPath,
		);

		if (!(texture instanceof PIXI.Texture)) {
			console.error(
				`Failed to load texture: ${this.#settings.raiseHandOverlayIconPath}`,
			);
			return;
		}

		this.#clear();

		// The first hand in line renders at full size in the player's color
		// with a glow; the rest are smaller with a grayed-out tint so the
		// front of the queue stands out.
		const scale = isFirst ? 0.8 : 0.55;
		this.alpha = 1;

		const { width, height } = token.bounds;
		const centerX = width / 2;
		const centerY = height / 2;
		const spriteWidth = width * scale;
		const spriteHeight = height * scale;

		this.#sprite = new PIXI.Sprite(texture);
		this.#sprite.anchor.set(0.5);
		this.#sprite.width = spriteWidth;
		this.#sprite.height = spriteHeight;
		this.#sprite.position.set(centerX, centerY);
		const baseTint =
			color?.valueOf() ?? (isFirst ? FIRST_IN_LINE_TINT : DEFAULT_TINT);
		this.#sprite.tint = isFirst ? baseTint : mutedTint(baseTint);

		if (isFirst) {
			const [red, green, blue] = color?.rgb ?? [1, 0.84, 0];
			const glow = RaiseHandGlowFilter.create({
				glowColor: [red, green, blue, 1],
				knockout: false,
			}) as RaiseHandGlowFilter;
			// The inner glow washes out the icon's black outline, so only the
			// outer halo is used.
			glow.innerStrength = 0;
			glow.outerStrength = 3.5;
			glow.padding = 32;
			this.#sprite.filters = [glow];
		}

		this.addChild(this.#sprite);

		const style = PreciseText.getTextStyle({
			fontSize: Math.max(20, spriteHeight * 0.3),
		});
		this.#badge = new PreciseText(String(position), style);
		this.#badge.anchor.set(0.5);
		this.#badge.position.set(
			centerX + (this.#settings.raiseHandNumberAnchorX - 0.5) * spriteWidth,
			centerY + (this.#settings.raiseHandNumberAnchorY - 0.5) * spriteHeight,
		);
		this.addChild(this.#badge);

		this.renderable = true;
	}

	hide(): void {
		this.renderable = false;
		this.#clear();
	}

	#clear(): void {
		if (this.#sprite) {
			this.#sprite.destroy({ children: true });
			this.#sprite = null;
		}

		if (this.#badge) {
			this.#badge.destroy({ children: true });
			this.#badge = null;
		}
	}
}
