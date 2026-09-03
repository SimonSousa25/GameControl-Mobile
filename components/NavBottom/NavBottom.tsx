import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/Themed';
import { styles } from './styles';

const navItems = [
  { id: 'home', label: 'Início', icon: require('./utils/home.svg') },
  { id: 'catalog', label: 'Catálogo', icon: require('./utils/catalog.svg') },
  { id: 'feed', label: 'Feed', icon: require('./utils/feed.svg') },
  { id: 'profile', label: 'Perfil', icon: require('./utils/profile.svg') },
];

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
            <Image
              source={item.icon}
              style={[
                styles.icon,
                activeTab === item.id && styles.iconActive,
              ]}
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
