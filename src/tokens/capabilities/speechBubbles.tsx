import { LOCALIZATION, MODULE_NAME } from "@/common/constants";
import { normalizeKeys } from "@/common/keyboard";
import type { Settings } from "@/common/settings";
import SpeechBubble from "@/tokens/capabilities/_components/speechBubble";
import type { Capability } from "@/tokens/capabilities/capability";
import { type SocketMessage, SocketMessageType } from "@/tokens/messages";

export default function speechBubbles(settings: Settings): Capability {
	let keyClearInterval: NodeJS.Timeout | undefined;
	let chatBubbleContainer: HTMLElement | null = null;
	let shownToken: Token | undefined;
	let shownSceneID: string | undefined;

	const clearKeyInterval = () => {
		if (keyClearInterval !== undefined) {
			clearInterval(keyClearInterval);
			keyClearInterval = undefined;
		}
	};

	game.socket?.on(`module.${MODULE_NAME}`, async (data: SocketMessage) => {
		if (!game.canvas) {
			return;
		}

		if (game.canvas.scene?.id !== data.sceneID) {
			return;
		}

		const token = game.canvas?.tokens?.get(data.tokenID);
		if (!token) {
			return;
		}

		switch (data.type) {
			case SocketMessageType.ShowSpeechBubble: {
				await show(token);
				return;
			}
			case SocketMessageType.HideSpeechBubble: {
				await hide(token);
				return;
			}
		}
	});

	return {
		hudButtonGroups: [],
		keybinds: [
			{
				name: "showSpeechBubble",
				config: {
					name: LOCALIZATION.KEYBINDS_SHOW_SPEECH_BUBBLE_HOTKEY,
					hint: LOCALIZATION.KEYBINDS_SHOW_SPEECH_BUBBLE_HINT,
					editable: [{ key: "KeyB" }],
					onDown: () => void showSpeechBubble(),
					onUp: () => void hideSpeechBubble(),
					precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
					restricted: false,
					reservedModifiers: [],
					repeat: false,
				},
			},
		],
	};

	async function showSpeechBubble() {
		if (!settings.allowSpeechBubbles) {
			return;
		}

		shownToken = game.canvas?.tokens?.controlled?.[0];

		if (!shownToken?.isOwner) {
			return;
		}

		shownSceneID = game.canvas?.scene?.id;
		const tokenID = shownToken?.id;

		if (tokenID && shownSceneID) {
			game.socket?.emit(`module.${MODULE_NAME}`, {
				type: SocketMessageType.ShowSpeechBubble,
				tokenID,
				sceneID: shownSceneID,
			});

			clearKeyInterval();
			keyClearInterval = setInterval(() => {
				const [bindings] =
					game.keybindings?.bindings?.get(`${MODULE_NAME}.showSpeechBubble`) ??
					[];
				const keys = bindings
					? [bindings.key, ...(bindings.modifiers ?? [])]
					: [];
				const keySet = new Set(keys);
				const downKeys = normalizeKeys(game.keyboard?.downKeys);

				if (!keySet.isSubsetOf(downKeys)) {
					clearKeyInterval();
					void hideSpeechBubble();
				}
			}, 250);

			await show(shownToken);
		}
	}

	// NOTE: Allow this no matter what, in the event the setting is changed while speech bubbles are active.
	async function hideSpeechBubble() {
		clearKeyInterval();

		const token = shownToken;
		const sceneID = shownSceneID;
		shownToken = undefined;
		shownSceneID = undefined;

		if (!token?.isOwner) {
			return;
		}

		if (sceneID) {
			game.socket?.emit(`module.${MODULE_NAME}`, {
				type: SocketMessageType.HideSpeechBubble,
				sceneID,
				tokenID: token.id,
			});

			await hide(token);
		}
	}

	async function show(token: Token): Promise<void> {
		chatBubbleContainer ??= document.getElementById("chat-bubbles");

		document
			.querySelector(`.chat-bubble[data-bubble-id="${token.id}"]`)
			?.remove();

		if (!chatBubbleContainer) {
			return;
		}

		const bubble = chatBubbleContainer.appendChild(
			<SpeechBubble
				id={token.id}
				fontSize={`${settings.speechBubbleFontSize}px`}
				left={token.x}
				text={token.name}
			/>,
		) as HTMLElement;

		bubble.style.top = `${token.y - bubble.offsetHeight - 12}px`;

		await bubble.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: 250,
			fill: "forwards",
		}).finished;
	}

	async function hide(token: Token): Promise<void> {
		const existing = document.querySelector(
			`.chat-bubble[data-bubble-id="${token.id}"]`,
		) as HTMLElement;

		if (!existing) {
			return;
		}

		await existing.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: 100,
			fill: "forwards",
		}).finished;

		existing.remove();
	}
}
