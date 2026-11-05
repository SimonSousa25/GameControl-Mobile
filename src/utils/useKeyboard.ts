import { useEffect, useState } from "react";
import { Dimensions, Keyboard, Platform } from "react-native";
import type { KeyboardEvent } from "react-native";

export interface KeyboardState {
  visible: boolean;
  /** Altura do teclado (0 com o teclado fechado). */
  height: number;
  /** Posição Y, em coordenadas de tela, do topo do teclado. */
  top: number;
}

export const KEYBOARD_HIDDEN: KeyboardState = { visible: false, height: 0, top: 0 };

/** Converte o evento nativo do teclado no estado usado pelos componentes. */
export function keyboardStateFromEvent(event: KeyboardEvent): KeyboardState {
  const { height, screenY } = event.endCoordinates;
  if (!height) return KEYBOARD_HIDDEN;
  return {
    visible: true,
    height,
    // Em alguns aparelhos Android o screenY vem zerado; nesse caso o topo do
    // teclado é a altura da tela menos a altura do teclado.
    top: screenY > 0 ? screenY : Dimensions.get("screen").height - height,
  };
}

/**
 * Acompanha o teclado virtual. No iOS usa os eventos "will" (o estado muda
 * junto com a animação); no Android só existem os eventos "did".
 */
export function useKeyboard(): KeyboardState {
  const [state, setState] = useState<KeyboardState>(KEYBOARD_HIDDEN);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) =>
      setState(keyboardStateFromEvent(event)),
    );
    const hideSub = Keyboard.addListener(hideEvent, () => setState(KEYBOARD_HIDDEN));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return state;
}
