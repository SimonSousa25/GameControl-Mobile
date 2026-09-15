import { StatusBar } from "expo-status-bar";
import { Text, useWindowDimensions, View } from "react-native";

import type { StyleProp, ViewStyle } from "react-native";

import PresentationLogo from "@/components/PresentationLogo";
import { styles } from "./styles";

export interface PresentationProps {
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const FIGMA_FRAME_HEIGHT = 874;
const FIGMA_FRAME_WIDTH = 402;

export default function Presentation({
  style,
  testID = "presentation-screen",
}: PresentationProps) {
  const { height, width } = useWindowDimensions();
  const scale = Math.min(width / FIGMA_FRAME_WIDTH, height / FIGMA_FRAME_HEIGHT);

  return (
    <View testID={testID} style={[styles.root, style]}>
      <StatusBar style="light" />
      <View style={[styles.canvas, { transform: [{ scale }] }]}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <PresentationLogo />
          </View>
          <Text style={styles.game}>Game</Text>
          <Text style={styles.control}>Control</Text>
        </View>
      </View>
    </View>
  );
}
