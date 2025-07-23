type HudButtonProps = { onClick: () => void; title: string; icon: string };

export default function HudButton({ onClick, title, icon }: HudButtonProps) {
    return (
        <button className="control-icon" type="button" onClick={onClick} data-tooltip={title}>
            <img src={icon} width={36} height={36} />
        </button>
    );
}
