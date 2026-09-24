import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import type { PlaylistDTO } from "@/services/playlistService";

import { styles } from "./styles";

export interface PlaylistsSectionProps {
  playlists: PlaylistDTO[];
  onCreatePress?: () => void;
  onPlaylistPress?: (playlistId: string) => void;
  onDeletePress?: (playlist: PlaylistDTO) => void;
}

function formatGamesCount(count: number) {
  return `${count} ${count === 1 ? "jogo" : "jogos"}`;
}

function NewButton({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity
      accessibilityLabel="Criar nova playlist"
      accessibilityRole="button"
      style={styles.newButton}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons name="add" size={14} color="#F52E8F" />
      <Text style={styles.newButtonText}>Nova</Text>
    </TouchableOpacity>
  );
}

export function PlaylistsSection({
  playlists,
  onCreatePress,
  onPlaylistPress,
  onDeletePress,
}: PlaylistsSectionProps) {
  const isEmpty = playlists.length === 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow} lightColor="transparent" darkColor="transparent">
        <View style={styles.headerLeft} lightColor="transparent" darkColor="transparent">
          <View style={styles.iconCircle}>
            <Ionicons name="list-outline" size={18} color="#F52E8F" />
          </View>
          <View lightColor="transparent" darkColor="transparent">
            <Text style={styles.title}>Playlists</Text>
            <Text style={styles.subtitle}>
              {playlists.length}{" "}
              {playlists.length === 1 ? "playlist criada" : "playlists criadas"}
            </Text>
          </View>
        </View>

        {!isEmpty ? <NewButton onPress={onCreatePress} /> : null}
      </View>

      {isEmpty ? (
        <View style={styles.emptyBox}>
          <Ionicons name="albums-outline" size={28} color="#334056" />
          <Text style={styles.emptyText}>
            Nenhuma playlist cadastrada ainda.
          </Text>
          <NewButton onPress={onCreatePress} />
        </View>
      ) : (
        <View style={styles.list} lightColor="transparent" darkColor="transparent">
          {playlists.map((playlist) => {
            const details = [
              playlist.descricao,
              formatGamesCount(playlist.jogosIds.length),
            ]
              .filter(Boolean)
              .join(" • ");

            return (
              <View key={playlist.id} style={styles.item}>
                <TouchableOpacity
                  accessibilityLabel={`Abrir playlist ${playlist.nome}`}
                  accessibilityRole="button"
                  style={styles.itemMain}
                  activeOpacity={0.8}
                  onPress={() => onPlaylistPress?.(playlist.id)}
                >
                  <View style={styles.itemIcon}>
                    <Ionicons name="game-controller-outline" size={20} color="#00E5FF" />
                  </View>

                  <View style={styles.itemInfo} lightColor="transparent" darkColor="transparent">
                    <Text style={styles.itemName} numberOfLines={1}>
                      {playlist.nome}
                    </Text>
                    <Text style={styles.itemDetails} numberOfLines={1}>
                      {details}
                    </Text>
                  </View>

                  <View style={styles.openButton}>
                    <Ionicons name="chevron-forward" size={16} color="#00E5FF" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  accessibilityLabel={`Excluir playlist ${playlist.nome}`}
                  accessibilityRole="button"
                  style={styles.deleteButton}
                  activeOpacity={0.8}
                  onPress={() => onDeletePress?.(playlist)}
                >
                  <Ionicons name="trash-outline" size={16} color="#FF4D5E" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default PlaylistsSection;
