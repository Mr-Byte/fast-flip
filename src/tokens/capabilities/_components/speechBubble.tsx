type SpeechBubbleProps = {
    id: string;
    top: number;
    left: number;
    fontSize: string;
    fontFamily: string;
    text: string;
};

export default function SpeechBubble({ id, fontSize, fontFamily, left, top, text }: SpeechBubbleProps) {
    const context = document.createElement("canvas").getContext("2d")!;
    context.font = `${fontSize} ${fontFamily}`;

    const fontMetrics = context.measureText(text);
    const yOffset = fontMetrics.actualBoundingBoxAscent + fontMetrics.actualBoundingBoxDescent + 36;
    const width = fontMetrics.width + 40;
    const style = {
        display: "block",
        opacity: 0,
        top: `${top + yOffset}px`,
        left: `${left}px`,
        fontSize,
    };

    return (
        <div className="chat-bubble right" style={style} data-bubble-id={id}>
            <div className="bubble-content" style={{ width: `${width}px` }}>
                {text}
            </div>
        </div>
    );
}
