import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import Header from "@/components/Header/Header";
import NavBottom from "@/components/NavBottom/NavBottom";
import { Text, View } from "@/components/Themed";

import { styles } from "./styles";

export interface ProfileProps {
  onPlaylistsPress?: () => void;
  onTabPress?: (tabId: string) => void;
}

export function Profile({ onPlaylistsPress, onTabPress }: ProfileProps) {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Header variant="icon" />
      </View>

      <View style={styles.container}>
        <View style={styles.avatarWrap}>
          <Ionicons name="person-circle-outline" size={96} color="#3E4E66" />
        </View>
        <Text style={styles.placeholderText}>
          Atualizar depois.
        </Text>

        <TouchableOpacity
          style={styles.playlistsButton}
          activeOpacity={0.8}
          onPress={onPlaylistsPress}
        >
          <Ionicons name="albums-outline" size={20} color="#F5F7FF" />
          <Text style={styles.playlistsButtonText}>Minhas Playlists</Text>
        </TouchableOpacity>
      </View>

      <NavBottom activeTab="profile" onTabPress={onTabPress} />
    </View>
  );
}

export default Profile;
