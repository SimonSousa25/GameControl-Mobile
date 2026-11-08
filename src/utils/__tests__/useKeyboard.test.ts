import { Dimensions } from "react-native";
import type { KeyboardEvent } from "react-native";

import { KEYBOARD_HIDDEN, keyboardStateFromEvent } from "@/utils/useKeyboard";

function event(height: number, screenY: number): KeyboardEvent {
  return {
    endCoordinates: { height, screenY, screenX: 0, width: 400 },
  } as KeyboardEvent;
}

describe("keyboardStateFromEvent", () => {
  it("usa o screenY informado como topo do teclado", () => {
    expect(keyboardStateFromEvent(event(300, 500))).toEqual({
      visible: true,
      height: 300,
      top: 500,
    });
  });

  it("calcula o topo pela altura da tela quando screenY vem zerado", () => {
    const screenHeight = Dimensions.get("screen").height;
    expect(keyboardStateFromEvent(event(300, 0)).top).toBe(screenHeight - 300);
  });

  it("devolve o estado fechado quando a altura é 0", () => {
    expect(keyboardStateFromEvent(event(0, 800))).toBe(KEYBOARD_HIDDEN);
  });
});
