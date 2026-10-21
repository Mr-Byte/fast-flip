const THUMBNAIL_SIZE = 64;
const THUMBNAIL_GAP = 12;
const TOKEN_CLEARANCE = 16;
export const MAX_WHEEL_IMAGES = 24;

type ImageWheelProps = {
	images: string[];
	currentSrc: string;
	cx: number;
	cy: number;
	tokenRadius: number;
	onHover: (image: string | undefined) => void;
};

function isSameImage(a: string, b: string): boolean {
	return decodeURIComponent(a) === decodeURIComponent(b);
}

export function createImageWheel(): HTMLElement {
	return (<div className="fast-flip-image-wheel" />) as HTMLElement;
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

	// Keep thumbnails clear of the token and of each other.
	const radius = Math.max(
		tokenRadius + THUMBNAIL_SIZE / 2 + TOKEN_CLEARANCE,
		(THUMBNAIL_SIZE + THUMBNAIL_GAP) / (2 * Math.sin(Math.PI / shown.length)),
	);

	for (const [index, image] of shown.entries()) {
		const angle = -Math.PI / 2 + (index * 2 * Math.PI) / shown.length;
		const left = cx + radius * Math.cos(angle) - THUMBNAIL_SIZE / 2;
		const top = cy + radius * Math.sin(angle) - THUMBNAIL_SIZE / 2;
		const isCurrent = isSameImage(image, currentSrc);

		const thumbnail = (
			<img
				className={`fast-flip-image-wheel__item${isCurrent ? " fast-flip-image-wheel__item--current" : ""}`}
				src={image}
				alt=""
				style={{
					left: `${left}px`,
					top: `${top}px`,
					width: `${THUMBNAIL_SIZE}px`,
					height: `${THUMBNAIL_SIZE}px`,
				}}
			/>
		) as HTMLImageElement;

		thumbnail.addEventListener("mouseenter", () => {
			thumbnail.classList.add("fast-flip-image-wheel__item--hovered");
			onHover(image);
		});
		thumbnail.addEventListener("mouseleave", () => {
			thumbnail.classList.remove("fast-flip-image-wheel__item--hovered");
			onHover(undefined);
		});

		wheel.appendChild(thumbnail);
	}
}
