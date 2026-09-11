import { Text } from "@/components/Themed";
import { View } from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { styles } from "./styles";

interface AvatarGradientProps {
  initial: string;
  colorIndex: number;
}

const INNER_COLORS = ["#1473BD", "#8C2E94", "#1A8061", "#AD2957", "#4D33A8"];

const OUTER_COLOR = "#050814";

export default function AvatarGradient({
  initial,
  colorIndex,
}: AvatarGradientProps) {
  const innerColor = INNER_COLORS[colorIndex % INNER_COLORS.length];
  const gradientId = `avatarGradient-${colorIndex}`;

  // TODO: achei que esse componente ficou mt pequeno, aumentar dps?
  return (
    <View style={styles.avatarGradientContainer}>
      <Svg width="36" height="36" viewBox="0 0 36 36">
        <Defs>
          <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={innerColor} />
            <Stop offset="100%" stopColor={OUTER_COLOR} />
          </RadialGradient>
        </Defs>
        <Circle cx="18" cy="18" r="18" fill={`url(#${gradientId})`} />
      </Svg>
      <Text style={styles.userInitialOnGradient}>{initial}</Text>
    </View>
  );
}
