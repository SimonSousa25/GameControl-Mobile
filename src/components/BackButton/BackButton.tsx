import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

import { styles } from "./styles";

export interface BackButtonProps {
  onPress?: () => void;
  color?: string;
  size?: number;
}

export function BackButton({
  onPress,
  color = "#F43B97",
  size = 20,
}: BackButtonProps) {
  return (
    <TouchableOpacity
      accessibilityLabel="Voltar"
      accessibilityRole="button"
      onPress={onPress}
      style={styles.button}
      hitSlop={8}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          fill={color}
          d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23 1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2z"
        />
      </Svg>
    </TouchableOpacity>
  );
}

export default BackButton;
