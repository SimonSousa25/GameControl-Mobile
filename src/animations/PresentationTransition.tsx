import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import type { ReactNode } from "react";

import PresentationLogo from "@/components/PresentationLogo";

import { styles } from "./styles";

export interface PresentationTransitionProps {
  children: ReactNode;
}

const ENTRANCE_DELAY_MS = 350;
const ENTRANCE_DURATION_MS = 900;
const BRAND_TRANSLATE_Y = -225.5;
const BRAND_FINAL_SCALE = 0.5;

export default function PresentationTransition({
  children,
}: PresentationTransitionProps) {
  const entranceProgress = useSharedValue(0);

  const [brandReady, setBrandReady] = useState(false);
  const [entranceFinished, setEntranceFinished] = useState(false);

  // A animação começa somente após a marca ter sido medida com a fonte correta.
  useEffect(() => {
    if (!brandReady) {
      return;
    }

    entranceProgress.value = withDelay(
      ENTRANCE_DELAY_MS,
      withTiming(1, {
        duration: ENTRANCE_DURATION_MS,
        easing: Easing.inOut(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      }),
    );

    const finishTimeout = setTimeout(() => {
      setEntranceFinished(true);
    }, ENTRANCE_DELAY_MS + ENTRANCE_DURATION_MS);

    return () => clearTimeout(finishTimeout);
  }, [brandReady, entranceProgress]);

  const animatedBrandStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          entranceProgress.value,
          [0, 1],
          [0, BRAND_TRANSLATE_Y],
        ),
      },
      {
        scale: interpolate(
          entranceProgress.value,
          [0, 1],
          [1, BRAND_FINAL_SCALE],
        ),
      },
    ],
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      entranceProgress.value,
      [0.65, 1],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          entranceProgress.value,
          [0.65, 1],
          [20, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        accessibilityLabel="GameControl"
        collapsable={false}
        onLayout={() => setBrandReady(true)}
        pointerEvents="none"
        renderToHardwareTextureAndroid
        shouldRasterizeIOS
        style={[
          styles.movingBrand,
          !brandReady && styles.brandHidden,
          animatedBrandStyle,
        ]}
      >
        <View style={styles.movingBrandIcon}>
          <PresentationLogo />
        </View>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.movingBrandGame}
        >
          Game
        </Text>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.movingBrandControl}
        >
          Control
        </Text>
      </Animated.View>

      {/* Mantém reservado o espaço ocupado pela marca ao final do movimento. */}
      <View style={styles.brandPlaceholder} />

      <Animated.View
        accessibilityElementsHidden={!entranceFinished}
        importantForAccessibility={
          entranceFinished ? "auto" : "no-hide-descendants"
        }
        pointerEvents={entranceFinished ? "auto" : "none"}
        style={[styles.content, animatedContentStyle]}
      >
        {children}
      </Animated.View>
    </View>
  );
}
