import HudButton from "@common/_components/hudButton";

export interface ButtonProps<T extends PlaceableObject> {
    title: string;
    icon: string;
    onClick: (object: T) => void | Promise<void>;
    shouldShow?: (object: T) => boolean;
}

type HudButtonGroupProps<T extends PlaceableObject> = {
    buttons: ButtonProps<T>[];
    object: T;
};

export default function HudButtonGroup<T extends PlaceableObject>(props: HudButtonGroupProps<T>) {
    const buttons = props.buttons.map((button) => (
        <HudButton onClick={() => button.onClick(props.object)} title={button.title} icon={button.icon} />
    ));

    return <div style="display: flex; flexDirection: horizontal; gap: 8px">{buttons}</div>;
}
