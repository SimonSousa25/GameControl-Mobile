import { TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";

import { styles } from "./styles";

export interface SectionTabsProps {
  tabs: string[];
  activeIndex: number;
  onTabPress: (index: number) => void;
}

/** Abas de texto usadas junto de um pager horizontal (swipe). */
export function SectionTabs({ tabs, activeIndex, onTabPress }: SectionTabsProps) {
  return (
    <View style={styles.row} lightColor="transparent" darkColor="transparent">
      {tabs.map((label, index) => {
        const active = index === activeIndex;
        return (
          <TouchableOpacity
            key={label}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.tab, active && styles.tabActive]}
            activeOpacity={0.7}
            onPress={() => onTabPress(index)}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default SectionTabs;
