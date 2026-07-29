type SpeechBubbleProps = {
	id: string;
	left: number;
	fontSize: string;
	text: string;
};

export default function SpeechBubble({
	id,
	fontSize,
	left,
	text,
}: SpeechBubbleProps) {
	const style = {
		display: "block",
		opacity: 0,
		left: `${left}px`,
		fontSize,
	};

	return (
		<div className="chat-bubble right" style={style} data-bubble-id={id}>
			<div
				className="bubble-content"
				style={{ width: "max-content", whiteSpace: "nowrap" }}
			>
				{text}
			</div>
		</div>
	);
}
