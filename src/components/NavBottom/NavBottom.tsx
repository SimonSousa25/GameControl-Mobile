import { Image, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import { getAvatarUrl } from '@/utils/avatar';
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
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const avatarUrl = getAvatarUrl(user?.profilePictureUrl);

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom + 12 },
      ]}
    >
      <View style={styles.navBar}>
        {navItems.map((item) => {
          const active = activeTab === item.id;
          const isProfileWithAvatar = item.id === 'profile' && avatarUrl;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={() => onTabPress?.(item.id)}
              activeOpacity={0.7}
            >
              {isProfileWithAvatar ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={[
                    styles.avatar,
                    active && styles.avatarActive,
                  ]}
                />
              ) : (
                <item.Icon
                  color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
                  size={24}
                />
              )}
              <Text style={[styles.label, active && styles.labelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
