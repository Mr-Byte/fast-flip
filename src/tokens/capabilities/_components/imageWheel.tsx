import VideoHelper = foundry.helpers.media.VideoHelper;

const BASE_THUMBNAIL_SIZE = 64;
const BASE_TOKEN_RADIUS = 70;
const TOKEN_CLEARANCE = 8;
const CAPTION_GAP = 8;
export const MAX_WHEEL_ENTRIES = 24;

// A slice shows its image when set, otherwise its Font Awesome icon.
export type WheelEntry = {
	image?: string;
	icon?: string;
	label?: string;
	active: boolean;
	className?: string;
};

type ImageWheelProps<T extends WheelEntry> = {
	entries: T[];
	cx: number;
	cy: number;
	tokenRadius: number;
	onHover: (entry: T | undefined) => void;
};

export const isSameImage = (first: string, second: string): boolean =>
	decodeURIComponent(first) === decodeURIComponent(second);

const polarPoint = (radius: number, angle: number): string =>
	`${(radius * Math.cos(angle)).toFixed(2)},${(radius * Math.sin(angle)).toFixed(2)}`;

// A full ring, for a wheel with one entry. An arc whose ends meet draws
// nothing, so each circle is two half arcs. The inner circle runs the other
// way, which leaves a hole under the default nonzero fill rule.
function ringPath(innerRadius: number, outerRadius: number): string {
	return `
		M ${outerRadius},0 A ${outerRadius} ${outerRadius} 0 1 1 ${-outerRadius},0
		A ${outerRadius} ${outerRadius} 0 1 1 ${outerRadius},0 Z
		M ${innerRadius},0 A ${innerRadius} ${innerRadius} 0 1 0 ${-innerRadius},0
		A ${innerRadius} ${innerRadius} 0 1 0 ${innerRadius},0 Z
	`;
}

function slicePath(
	innerRadius: number,
	outerRadius: number,
	startAngle: number,
	endAngle: number,
): string {
	if (endAngle - startAngle >= 2 * Math.PI) {
		return ringPath(innerRadius, outerRadius);
	}

	return `
		M ${polarPoint(innerRadius, startAngle)} A ${innerRadius} ${innerRadius} 0 0 1 ${polarPoint(innerRadius, endAngle)}
		L ${polarPoint(outerRadius, endAngle)}
		A ${outerRadius} ${outerRadius} 0 0 0 ${polarPoint(outerRadius, startAngle)}
		Z
	`;
}

function thumbnail(entry: WheelEntry): HTMLElement {
	const { image, icon } = entry;

	if (!image) {
		return (
			<div className="fast-flip-image-wheel__thumb fast-flip-image-wheel__thumb--icon">
				<i className={icon ?? "fa-solid fa-question"} />
			</div>
		) as HTMLElement;
	}

	if (VideoHelper.hasVideoExtension(image)) {
		return (
			<video
				className="fast-flip-image-wheel__thumb"
				src={image}
				autoPlay
				muted
				loop
				playsInline
			/>
		) as HTMLElement;
	}

	return (
		<div
			className="fast-flip-image-wheel__thumb"
			style={{ backgroundImage: `url("${image}")` }}
		/>
	) as HTMLElement;
}

export function createImageWheel(): HTMLElement {
	return (
		<div className="fast-flip-image-wheel" role="listbox" />
	) as HTMLElement;
}

export function populateImageWheel<T extends WheelEntry>(
	wheel: HTMLElement,
	{ entries, cx, cy, tokenRadius, onHover }: ImageWheelProps<T>,
): void {
	const shown = entries.slice(0, MAX_WHEEL_ENTRIES);

	if (entries.length > MAX_WHEEL_ENTRIES) {
		console.warn(
			`Fast Flip! Token Tools | The wheel has ${entries.length} entries; only the first ${MAX_WHEEL_ENTRIES} are shown.`,
		);
	}

	const step = (2 * Math.PI) / shown.length;
	const thumbnailSize =
		BASE_THUMBNAIL_SIZE * Math.max(1, tokenRadius / BASE_TOKEN_RADIUS);
	const thumbnailGap = thumbnailSize * 0.2;
	const ringThickness = thumbnailSize * 1.6;
	// With one entry there are no neighbors to keep apart, and sin(π) is
	// about zero, which would push the ring off screen.
	const spacingRadius =
		shown.length > 1
			? (thumbnailSize + thumbnailGap) / (2 * Math.sin(Math.PI / shown.length))
			: 0;
	const midRadius = Math.max(
		tokenRadius + TOKEN_CLEARANCE + ringThickness / 2,
		spacingRadius,
	);
	const innerRadius = midRadius - ringThickness / 2;
	const outerRadius = midRadius + ringThickness / 2;

	// Entries with names get a caption under the ring that follows the hover.
	const caption = shown.some((entry) => entry.label)
		? ((
				<div
					className="fast-flip-image-wheel__caption"
					style={{ left: cx, top: cy + outerRadius + CAPTION_GAP }}
				/>
			) as HTMLElement)
		: undefined;

	const hover = (entry: T | undefined) => {
		if (caption) {
			caption.textContent = entry?.label ?? "";
		}

		onHover(entry);
	};

	const slices = shown.map((entry, index) => {
		const centerAngle = -Math.PI / 2 + index * step;
		const thumbX = midRadius * Math.cos(centerAngle);
		const thumbY = midRadius * Math.sin(centerAngle);

		return (
			<g
				className={[
					"fast-flip-image-wheel__slice",
					{ "fast-flip-image-wheel__slice--current": entry.active },
					entry.className,
				]}
				role="option"
				aria-selected={entry.active}
				aria-label={entry.label}
				onMouseEnter={() => hover(entry)}
				onMouseLeave={() => hover(undefined)}
			>
				<path
					className="fast-flip-image-wheel__slice-bg"
					d={slicePath(
						innerRadius,
						outerRadius,
						centerAngle - step / 2,
						centerAngle + step / 2,
					)}
				/>
				<foreignObject
					x={thumbX - thumbnailSize / 2}
					y={thumbY - thumbnailSize / 2}
					width={thumbnailSize}
					height={thumbnailSize}
				>
					{thumbnail(entry)}
				</foreignObject>
			</g>
		);
	});

	wheel.appendChild(
		// biome-ignore lint/a11y/noSvgWithoutTitle: not needed
		<svg
			className="fast-flip-image-wheel__ring"
			width={outerRadius * 2}
			height={outerRadius * 2}
			viewBox={`${-outerRadius} ${-outerRadius} ${outerRadius * 2} ${outerRadius * 2}`}
			style={{ left: cx - outerRadius, top: cy - outerRadius }}
		>
			{slices}
		</svg>,
	);

	if (caption) {
		wheel.appendChild(caption);
	}
}
