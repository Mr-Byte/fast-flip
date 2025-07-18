type HudButtonProps = { onClick: () => void; title: string; icon: string };

export default function HudButton({ onClick, title, icon }: HudButtonProps) {
    const localizedTitle = game.i18n?.localize(title) ?? "";

    return (
        <button className="control-icon" onClick={onClick} title={localizedTitle}>
            <img src={icon} title={title} alt={title} width={36} height={36} />
        </button>
    );
}
