import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";

/**
 * Pager horizontal (swipe) sincronizado com abas de texto.
 *
 * Ao tocar numa aba, o scroll animado passa por posições intermediárias; se
 * cada evento de scroll atualizasse a aba ativa, ela voltaria por um instante
 * para a página anterior (o "piscar"). Por isso, durante uma animação
 * disparada por toque os eventos de scroll são ignorados até chegar ao destino.
 */
export function useSectionPager() {
  const pagerRef = useRef<ScrollView>(null);
  const [pagerSize, setPagerSize] = useState({ width: 0, height: 0 });
  const [activePage, setActivePage] = useState(0);

  const targetPage = useRef<number | null>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTarget = useCallback(() => {
    targetPage.current = null;
    if (fallbackTimer.current) {
      clearTimeout(fallbackTimer.current);
      fallbackTimer.current = null;
    }
  }, []);

  useEffect(() => clearTarget, [clearTarget]);

  const onPagerLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPagerSize((current) =>
      current.width === width && current.height === height
        ? current
        : { width, height },
    );
  }, []);

  // Se a largura mudar (rotação/redimensionar), mantém a página atual.
  useEffect(() => {
    if (pagerSize.width > 0) {
      pagerRef.current?.scrollTo({
        x: activePage * pagerSize.width,
        animated: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagerSize.width]);

  const onPagerScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { width } = pagerSize;
      if (width === 0) return;
      const x = event.nativeEvent.contentOffset.x;

      if (targetPage.current !== null) {
        if (Math.abs(x - targetPage.current * width) <= 1) clearTarget();
        return;
      }

      const page = Math.round(x / width);
      setActivePage((current) => (current === page ? current : page));
    },
    [pagerSize, clearTarget],
  );

  const goToPage = useCallback(
    (page: number) => {
      if (pagerSize.width === 0) return;
      setActivePage(page);
      targetPage.current = page;
      // Garantia caso o destino nunca seja atingido (ex.: usuário interrompe).
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
      fallbackTimer.current = setTimeout(clearTarget, 700);
      pagerRef.current?.scrollTo({ x: page * pagerSize.width, animated: true });
    },
    [pagerSize.width, clearTarget],
  );

  return { pagerRef, pagerSize, activePage, onPagerLayout, onPagerScroll, goToPage };
}
