import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { styles } from './styles';
import { CatalogIcon, FeedIcon, HomeIcon, ProfileIcon } from './icons';

const navItems = [
  { id: 'home', label: 'Início', Icon: HomeIcon },
  { id: 'catalog', label: 'Catálogo', Icon: CatalogIcon },
  { id: 'feed', label: 'Feed', Icon: FeedIcon },
  { id: 'profile', label: 'Perfil', Icon: ProfileIcon },
];

const INACTIVE_COLOR = '#A0A0A0';
const ACTIVE_COLOR = '#F52E8F';

interface NavBottomProps {
  activeTab?: string;
  onTabPress?: (tabId: string) => void;
}

export default function NavBottom({ activeTab = 'home', onTabPress }: NavBottomProps) {
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.navItem,
              activeTab === item.id && styles.navItemActive,
            ]}
            onPress={() => onTabPress?.(item.id)}
            activeOpacity={0.7}
          >
            <item.Icon
              color={activeTab === item.id ? ACTIVE_COLOR : INACTIVE_COLOR}
              size={24}
            />
            <Text
              style={[
                styles.label,
                activeTab === item.id && styles.labelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
