import { LOCALIZATION, MODULE_NAME, SETTING } from "@/common/constants";

const PREVIEW_ID = `${MODULE_NAME}-number-anchor-preview`;

const WATCHED_SETTINGS = [
	SETTING.RAISE_HAND_NUMBER_ANCHOR_X,
	SETTING.RAISE_HAND_NUMBER_ANCHOR_Y,
	SETTING.RAISE_HAND_OVERLAY_ICON_PATH,
];

function findInput(root: HTMLElement, setting: string): HTMLElement | null {
	return root.querySelector(`[name="${MODULE_NAME}.${setting}"]`);
}

function readValue(root: HTMLElement, setting: string): string {
	const input = findInput(root, setting) as { value?: unknown } | null;
	return typeof input?.value === "string" || typeof input?.value === "number"
		? String(input.value)
		: "";
}

// Injects a live preview of the queue number's position below the anchor
// sliders in the module's settings form. The preview tracks unsaved slider
// and icon path values, so it always shows what will be saved.
export function injectNumberAnchorPreview(root: HTMLElement): void {
	const anchorYInput = findInput(root, SETTING.RAISE_HAND_NUMBER_ANCHOR_Y);
	const formGroup = anchorYInput?.closest(".form-group");

	if (!formGroup || root.querySelector(`#${PREVIEW_ID}`)) {
		return;
	}

	const image = (
		<img
			alt=""
			style={{
				position: "absolute",
				inset: "0",
				width: "100%",
				height: "100%",
				objectFit: "contain",
				border: "none",
			}}
		/>
	) as HTMLImageElement;

	const number = (
		<span
			style={{
				position: "absolute",
				transform: "translate(-50%, -50%)",
				fontFamily: "Signika, sans-serif",
				fontSize: "28px",
				fontWeight: "bold",
				color: "#fff",
				textShadow: "0 0 2px #000, 0 0 2px #000, 0 0 4px #000",
			}}
		>
			1
		</span>
	) as HTMLSpanElement;

	const preview = (
		<div id={PREVIEW_ID} className="form-group">
			{/* biome-ignore lint/a11y/noLabelWithoutControl: Foundry's settings styling targets label elements, and the preview has no input */}
			<label>
				{game.i18n?.localize(LOCALIZATION.SETTINGS_RAISE_HAND_NUMBER_PREVIEW)}
			</label>
			<div className="form-fields">
				<div
					style={{
						position: "relative",
						width: "128px",
						height: "128px",
						background: "#555",
						borderRadius: "4px",
						flex: "0 0 auto",
					}}
				>
					{image}
					{number}
				</div>
			</div>
		</div>
	) as HTMLElement;

	formGroup.insertAdjacentElement("afterend", preview);

	const update = () => {
		const x = Number.parseFloat(
			readValue(root, SETTING.RAISE_HAND_NUMBER_ANCHOR_X),
		);
		const y = Number.parseFloat(
			readValue(root, SETTING.RAISE_HAND_NUMBER_ANCHOR_Y),
		);
		number.style.left = `${(Number.isFinite(x) ? x : 0.5) * 100}%`;
		number.style.top = `${(Number.isFinite(y) ? y : 0.5) * 100}%`;

		const iconPath = readValue(root, SETTING.RAISE_HAND_OVERLAY_ICON_PATH);
		if (iconPath && image.getAttribute("src") !== iconPath) {
			image.src = iconPath;
		}
	};

	update();

	for (const setting of WATCHED_SETTINGS) {
		const input = findInput(root, setting);
		input?.addEventListener("input", update);
		input?.addEventListener("change", update);
	}
}
