import { Ionicons } from "@expo/vector-icons";
import { Switch, View, Text } from "react-native";
import { styles } from "./styles";

interface NotificationOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showDivider?: boolean;
}

export default function NotificationOption({
  icon,
  title,
  description,
  value,
  onValueChange,
  showDivider = false,
}: NotificationOptionProps) {
  return (
    <View style={[styles.container, showDivider && styles.divider]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={18} color="#00D9F5" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#152637", true: "#E51580" }}
        thumbColor={value ? "#FFFFFF" : "#D8F3FF"}
        ios_backgroundColor="#152637"
        style={styles.switch}
      />
    </View>
  );
}
