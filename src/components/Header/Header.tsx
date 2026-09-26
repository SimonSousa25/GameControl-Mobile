import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, View } from '@/components/Themed';
import { styles } from './styles';
import LogoIcon from './utils/LogoIcon';

interface HeaderProps {
  variant?: 'icon' | 'search';
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchPress?: () => void;
  onSearchSubmit?: () => void;
  onClose?: () => void;
  autoFocusSearch?: boolean;
}

export default function Header({
  variant = 'icon',
  searchValue,
  onSearchChange,
  onSearchPress,
  onSearchSubmit,
  onClose,
  autoFocusSearch,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <Link href="/home" asChild>
        <TouchableOpacity style={styles.logo} activeOpacity={0.7}>
          <LogoIcon width={38} height={32} />
          <Text style={styles.logoText}>
            Game<Text style={styles.logoTextAccent}>Control</Text>
          </Text>
        </TouchableOpacity>
      </Link>

      {variant === 'search' ? (
        <View style={styles.searchBar}>
          {onClose ? (
            <TouchableOpacity
              accessibilityLabel="Fechar busca"
              accessibilityRole="button"
              onPress={onClose}
              hitSlop={8}
            >
              <Ionicons name="close" size={18} color="#5C6478" />
            </TouchableOpacity>
          ) : null}
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por um jogo"
            placeholderTextColor="#5C6478"
            value={searchValue}
            onChangeText={onSearchChange}
            onSubmitEditing={onSearchSubmit}
            returnKeyType="search"
            autoFocus={autoFocusSearch}
          />
          <TouchableOpacity
            accessibilityLabel="Buscar"
            accessibilityRole="button"
            onPress={onSearchSubmit}
            disabled={!onSearchSubmit}
            hitSlop={8}
          >
            <Ionicons name="search" size={18} color="#F5F7FF" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.searchButton}
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={18} color="#F52E8F" />
        </TouchableOpacity>
      )}
    </View>
  );
}
