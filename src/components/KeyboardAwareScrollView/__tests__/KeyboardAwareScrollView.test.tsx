import { act, fireEvent, render } from "@testing-library/react-native";
import { createRef, useEffect } from "react";
import { Keyboard, ScrollView, Text } from "react-native";
import type { View } from "react-native";

import KeyboardAwareScrollView, {
  KEYBOARD_MARGIN,
  LAYOUT_DELAY_MS,
  useKeyboardScroll,
} from "@/components/KeyboardAwareScrollView/KeyboardAwareScrollView";

type Listener = (event: unknown) => void;

// Captura os listeners que o useKeyboard registra para podermos "abrir o teclado".
const listeners: Record<string, Listener[]> = {};

beforeEach(() => {
  jest.useFakeTimers();
  for (const key of Object.keys(listeners)) delete listeners[key];
  jest.spyOn(Keyboard, "addListener").mockImplementation(((name: string, cb: Listener) => {
    (listeners[name] ??= []).push(cb);
    return { remove: jest.fn() };
  }) as unknown as typeof Keyboard.addListener);
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

function emit(kind: "show" | "hide", height = 0, screenY = 0) {
  const names = Object.keys(listeners).filter((name) =>
    name.toLowerCase().includes(kind),
  );
  act(() => {
    names.forEach((name) =>
      listeners[name].forEach((cb) =>
        cb({ endCoordinates: { height, screenY, screenX: 0, width: 400 } }),
      ),
    );
  });
}

/** Elemento falso que "está" em y (coordenadas da janela) com a altura dada. */
function fakeTarget(y: number, height: number) {
  return {
    measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) =>
      cb(0, y, 300, height),
  } as unknown as View;
}

type Scroll = ReturnType<typeof useKeyboardScroll>;

function setup() {
  const scrollRef = createRef<ScrollView>();
  let scroll: Scroll = null;
  function Probe() {
    const ctx = useKeyboardScroll();
    useEffect(() => {
      scroll = ctx;
    }, [ctx]);
    return <Text>conteúdo</Text>;
  }
  const utils = render(
    <KeyboardAwareScrollView ref={scrollRef} testID="scroll">
      <Probe />
    </KeyboardAwareScrollView>,
  );
  const scrollTo = jest.spyOn(scrollRef.current!, "scrollTo");
  scrollTo.mockClear();
  return { ...utils, scrollTo, getScroll: () => scroll! };
}

describe("KeyboardAwareScrollView", () => {
  it("rola quando o teclado abre e cobriria o elemento em edição", () => {
    const { scrollTo, getScroll } = setup();

    // O elemento termina em y=850; o teclado vai ocupar a partir de y=500.
    act(() => getScroll().scrollToView(fakeTarget(700, 150)));
    emit("show", 300, 500);
    act(() => {
      jest.advanceTimersByTime(LAYOUT_DELAY_MS);
    });

    expect(scrollTo).toHaveBeenCalledWith({
      y: 850 + KEYBOARD_MARGIN - 500,
      animated: true,
    });
  });

  it("soma a posição atual da rolagem ao deslocamento necessário", () => {
    const { scrollTo, getScroll, getByTestId } = setup();

    fireEvent.scroll(getByTestId("scroll"), {
      nativeEvent: { contentOffset: { x: 0, y: 100 } },
    });
    act(() => getScroll().scrollToView(fakeTarget(700, 150)));
    emit("show", 300, 500);
    act(() => {
      jest.advanceTimersByTime(LAYOUT_DELAY_MS);
    });

    expect(scrollTo).toHaveBeenCalledWith({
      y: 100 + (850 + KEYBOARD_MARGIN - 500),
      animated: true,
    });
  });

  it("não rola quando o elemento já está acima do teclado", () => {
    const { scrollTo, getScroll } = setup();

    act(() => getScroll().scrollToView(fakeTarget(100, 150)));
    emit("show", 300, 500);
    act(() => {
      jest.advanceTimersByTime(LAYOUT_DELAY_MS);
    });

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("rola direto quando o teclado já estava aberto (troca de campo)", () => {
    const { scrollTo, getScroll } = setup();

    emit("show", 300, 500);
    act(() => getScroll().scrollToView(fakeTarget(700, 150)));
    act(() => {
      jest.advanceTimersByTime(LAYOUT_DELAY_MS);
    });

    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it("esquece o elemento quando o teclado fecha", () => {
    const { scrollTo, getScroll } = setup();

    act(() => getScroll().scrollToView(fakeTarget(700, 150)));
    emit("show", 300, 500);
    act(() => {
      jest.advanceTimersByTime(LAYOUT_DELAY_MS);
    });
    scrollTo.mockClear();

    emit("hide");
    emit("show", 300, 500);
    act(() => {
      jest.advanceTimersByTime(LAYOUT_DELAY_MS);
    });

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("acrescenta espaço do tamanho do teclado no fim enquanto ele está aberto", () => {
    const { queryByTestId, getByTestId } = setup();
    expect(queryByTestId("keyboard-spacer")).toBeNull();

    emit("show", 300, 500);
    expect(getByTestId("keyboard-spacer").props.style).toEqual({ height: 300 });

    emit("hide");
    expect(queryByTestId("keyboard-spacer")).toBeNull();
  });

  it("mantém toques em botões funcionando com o teclado aberto", () => {
    const { getByTestId } = setup();
    expect(getByTestId("scroll").props.keyboardShouldPersistTaps).toBe("handled");
  });

  it("scrollToView é inofensivo fora de um KeyboardAwareScrollView", () => {
    let ctx: Scroll | undefined;
    function Outside() {
      ctx = useKeyboardScroll();
      return null;
    }
    render(<Outside />);
    expect(ctx).toBeNull();
  });
});
