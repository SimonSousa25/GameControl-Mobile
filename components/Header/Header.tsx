import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Image, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { styles } from './styles';

interface HeaderProps {
  variant?: 'icon' | 'search';
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchPress?: () => void;
}

export default function Header({
  variant = 'icon',
  searchValue,
  onSearchChange,
  onSearchPress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <Link href="/" asChild>
        <TouchableOpacity style={styles.logo} activeOpacity={0.7}>
          <Image source={require('./utils/logo.svg')} style={styles.logoIcon} />
          <Text style={styles.logoText}>
            Game<Text style={styles.logoTextAccent}>Control</Text>
          </Text>
        </TouchableOpacity>
      </Link>

      {variant === 'search' ? (
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por um jogo"
            placeholderTextColor="#5C6478"
            value={searchValue}
            onChangeText={onSearchChange}
          />
          <Ionicons name="search" size={18} color="#F5F7FF" />
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
