import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { ScrollView, View } from "react-native";
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
} from "react-native";

import { useKeyboard } from "@/utils/useKeyboard";

/** Folga entre a base do elemento em edição e o topo do teclado. */
export const KEYBOARD_MARGIN = 24;

/**
 * Tempo para o espaço extra (abaixo) ser medido pelo layout antes de rolar;
 * sem isso o Android limita a rolagem ao tamanho antigo do conteúdo.
 */
export const LAYOUT_DELAY_MS = 80;

interface KeyboardScrollContextValue {
  /**
   * Garante que `target` fique visível acima do teclado: rola agora se o
   * teclado já estiver aberto, ou assim que ele abrir.
   */
  scrollToView: (target: View | null) => void;
}

const KeyboardScrollContext = createContext<KeyboardScrollContextValue | null>(null);

/**
 * Acesso ao "rolar até o elemento" do KeyboardAwareScrollView mais próximo.
 * Fora de um (ex.: cards em carrosséis) devolve null e nada precisa acontecer.
 */
export function useKeyboardScroll() {
  return useContext(KeyboardScrollContext);
}

/**
 * ScrollView que não deixa o teclado cobrir o que a pessoa está editando.
 *
 * - Com o teclado aberto, acrescenta no fim um espaço do tamanho dele, para
 *   que até o último item da lista possa subir acima do teclado.
 * - Quando um filho chama `useKeyboardScroll().scrollToView(ref)`, mede onde o
 *   elemento está na janela e rola só o necessário para ele ficar acima do
 *   teclado. Por ser baseado em medida, funciona igual se o sistema já tiver
 *   redimensionado a janela (nesse caso não há nada a rolar).
 * - Toques em botões fechando só o teclado (o clássico "toca duas vezes")
 *   são evitados com keyboardShouldPersistTaps="handled".
 */
export const KeyboardAwareScrollView = forwardRef<ScrollView, ScrollViewProps>(
  function KeyboardAwareScrollView(
    {
      children,
      onScroll,
      scrollEventThrottle = 16,
      keyboardShouldPersistTaps = "handled",
      ...rest
    },
    forwardedRef,
  ) {
    const innerRef = useRef<ScrollView | null>(null);
    const scrollY = useRef(0);
    const keyboard = useKeyboard();
    const keyboardRef = useRef(keyboard);
    keyboardRef.current = keyboard;
    // Elemento que a pessoa está editando; mantido enquanto o teclado estiver
    // aberto para reposicioná-lo se a altura do teclado mudar.
    const targetRef = useRef<View | null>(null);

    const setRefs = useCallback(
      (node: ScrollView | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const revealTarget = useCallback(() => {
      const target = targetRef.current;
      if (!target) return;
      target.measureInWindow((_x, y, _width, height) => {
        const { visible, top } = keyboardRef.current;
        if (!visible) return;
        const overlap = y + height + KEYBOARD_MARGIN - top;
        if (overlap > 0) {
          innerRef.current?.scrollTo({ y: scrollY.current + overlap, animated: true });
        }
      });
    }, []);

    const scrollToView = useCallback(
      (target: View | null) => {
        targetRef.current = target;
        // Teclado já aberto (ex.: pulou de um campo para outro): não haverá
        // novo evento de teclado, então rola direto.
        if (target && keyboardRef.current.visible) {
          setTimeout(revealTarget, LAYOUT_DELAY_MS);
        }
      },
      [revealTarget],
    );

    // Teclado abriu ou mudou de tamanho: reposiciona o alvo pendente.
    useEffect(() => {
      if (!keyboard.visible) {
        targetRef.current = null;
        return;
      }
      if (!targetRef.current) return;
      const timer = setTimeout(revealTarget, LAYOUT_DELAY_MS);
      return () => clearTimeout(timer);
    }, [keyboard.visible, keyboard.top, revealTarget]);

    const handleScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollY.current = event.nativeEvent.contentOffset.y;
        onScroll?.(event);
      },
      [onScroll],
    );

    const contextValue = useMemo(() => ({ scrollToView }), [scrollToView]);

    return (
      <KeyboardScrollContext.Provider value={contextValue}>
        <ScrollView
          ref={setRefs}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          scrollEventThrottle={scrollEventThrottle}
          onScroll={handleScroll}
          {...rest}
        >
          {children}
          {keyboard.visible ? (
            <View testID="keyboard-spacer" style={{ height: keyboard.height }} />
          ) : null}
        </ScrollView>
      </KeyboardScrollContext.Provider>
    );
  },
);

export default KeyboardAwareScrollView;
