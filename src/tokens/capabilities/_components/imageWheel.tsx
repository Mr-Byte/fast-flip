import VideoHelper = foundry.helpers.media.VideoHelper;

const BASE_THUMBNAIL_SIZE = 64;
const BASE_TOKEN_RADIUS = 70;
const TOKEN_CLEARANCE = 8;
export const MAX_WHEEL_IMAGES = 24;

type ImageWheelProps = {
	images: string[];
	currentSrc: string;
	cx: number;
	cy: number;
	tokenRadius: number;
	onHover: (image: string | undefined) => void;
};

const isSameImage = (first: string, second: string): boolean =>
	decodeURIComponent(first) === decodeURIComponent(second);

const polarPoint = (radius: number, angle: number): string =>
	`${(radius * Math.cos(angle)).toFixed(2)},${(radius * Math.sin(angle)).toFixed(2)}`;

function slicePath(
	innerRadius: number,
	outerRadius: number,
	startAngle: number,
	endAngle: number,
): string {
	return `
		M ${polarPoint(innerRadius, startAngle)} A ${innerRadius} ${innerRadius} 0 0 1 ${polarPoint(innerRadius, endAngle)}
		L ${polarPoint(outerRadius, endAngle)}
		A ${outerRadius} ${outerRadius} 0 0 0 ${polarPoint(outerRadius, startAngle)}
		Z
	`;
}

function thumbnail(image: string): HTMLElement {
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

export function populateImageWheel(
	wheel: HTMLElement,
	{ images, currentSrc, cx, cy, tokenRadius, onHover }: ImageWheelProps,
): void {
	const shown = images.slice(0, MAX_WHEEL_IMAGES);

	if (images.length > MAX_WHEEL_IMAGES) {
		console.warn(
			`Fast Flip! Token Tools | Token has ${images.length} wildcard images; only the first ${MAX_WHEEL_IMAGES} are shown.`,
		);
	}

	const step = (2 * Math.PI) / shown.length;
	const thumbnailSize =
		BASE_THUMBNAIL_SIZE * Math.max(1, tokenRadius / BASE_TOKEN_RADIUS);
	const thumbnailGap = thumbnailSize * 0.2;
	const ringThickness = thumbnailSize * 1.6;
	const midRadius = Math.max(
		tokenRadius + TOKEN_CLEARANCE + ringThickness / 2,
		(thumbnailSize + thumbnailGap) / (2 * Math.sin(Math.PI / shown.length)),
	);
	const innerRadius = midRadius - ringThickness / 2;
	const outerRadius = midRadius + ringThickness / 2;

	const slices = shown.map((image, index) => {
		const centerAngle = -Math.PI / 2 + index * step;
		const isCurrent = isSameImage(image, currentSrc);
		const thumbX = midRadius * Math.cos(centerAngle);
		const thumbY = midRadius * Math.sin(centerAngle);

		return (
			<g
				className={[
					"fast-flip-image-wheel__slice",
					{ "fast-flip-image-wheel__slice--current": isCurrent },
				]}
				role="option"
				aria-selected={isCurrent}
				onMouseEnter={() => onHover(image)}
				onMouseLeave={() => onHover(undefined)}
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
					{thumbnail(image)}
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
}
