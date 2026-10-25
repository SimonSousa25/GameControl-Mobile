import { Children, type ReactNode } from "react";
import { ScrollView, View } from "react-native";

import type { SectionPagerState } from "@/utils/useSectionPager";

export interface SectionPagerProps {
  /** Estado devolvido por useSectionPager (o mesmo usado nas abas). */
  pager: SectionPagerState;
  /** Uma página por filho, na mesma ordem das abas. */
  children: ReactNode;
}

/**
 * Pager horizontal (swipe) que só desliza o conteúdo das abas. O cartão do
 * perfil e as abas ficam fora dele, na rolagem vertical da tela, então não
 * "reaparecem" a cada troca de página. A altura acompanha a página ativa.
 */
export function SectionPager({ pager, children }: SectionPagerProps) {
  const { pagerRef, pagerSize, activePage, pageHeights, onPagerLayout, onPageLayout, onPagerScroll } =
    pager;
  const pages = Children.toArray(children);
  const activeHeight = pageHeights[activePage];

  return (
    <View onLayout={onPagerLayout}>
      {pagerSize.width > 0 ? (
        <ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={onPagerScroll}
          style={activeHeight ? { height: activeHeight } : undefined}
          // Cada página mantém a altura do próprio conteúdo (sem esticar).
          contentContainerStyle={{ alignItems: "flex-start" }}
        >
          {pages.map((page, index) => (
            <View
              key={index}
              style={{ width: pagerSize.width }}
              onLayout={onPageLayout(index)}
            >
              {page}
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

export default SectionPager;
