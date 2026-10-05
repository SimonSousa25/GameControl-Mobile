import { Ionicons } from "@expo/vector-icons";
import { Modal, ScrollView, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import type { PlaylistDTO } from "@/services/playlistService";

import { styles } from "./styles";

export interface PlaylistPickerModalProps {
  visible: boolean;
  gameId: string;
  playlists: PlaylistDTO[];
  loading?: boolean;
  error?: boolean;
  addingPlaylistId?: string | null;
  onClose: () => void;
  onSelect: (playlist: PlaylistDTO) => void;
  onCreatePress: () => void;
}

export function PlaylistPickerModal({
  visible,
  gameId,
  playlists,
  loading = false,
  error = false,
  addingPlaylistId = null,
  onClose,
  onSelect,
  onCreatePress,
}: PlaylistPickerModalProps) {
  const busy = addingPlaylistId !== null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={styles.overlay}
        lightColor="rgba(3, 7, 13, 0.85)"
        darkColor="rgba(3, 7, 13, 0.85)"
      >
        <View style={styles.card}>
          <View
            style={styles.headerRow}
            lightColor="transparent"
            darkColor="transparent"
          >
            <View
              style={styles.headerLeft}
              lightColor="transparent"
              darkColor="transparent"
            >
              <View style={styles.titleBar} />
              <Text style={styles.title}>Adicionar à playlist</Text>
            </View>
            <TouchableOpacity
              accessibilityLabel="Fechar"
              accessibilityRole="button"
              onPress={onClose}
              hitSlop={8}
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            activeOpacity={0.8}
            onPress={onCreatePress}
            disabled={busy}
          >
            <Ionicons name="add" size={18} color="#F52E8F" />
            <Text style={styles.createButtonText}>Criar nova playlist</Text>
          </TouchableOpacity>

          {loading ? (
            <View
              style={styles.stateContainer}
              lightColor="transparent"
              darkColor="transparent"
            >
              <Text style={styles.stateText}>Carregando playlists...</Text>
            </View>
          ) : error ? (
            <View
              style={styles.stateContainer}
              lightColor="transparent"
              darkColor="transparent"
            >
              <Text style={styles.stateText}>
                Não foi possível carregar suas playlists.
              </Text>
            </View>
          ) : playlists.length === 0 ? (
            <View
              style={styles.stateContainer}
              lightColor="transparent"
              darkColor="transparent"
            >
              <Text style={styles.stateText}>
                Você ainda não tem playlists.
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {playlists.map((playlist) => {
                const alreadyAdded = playlist.jogosIds.includes(gameId);
                const adding = addingPlaylistId === playlist.id;
                const gamesCount = playlist.jogosIds.length;
                return (
                  <TouchableOpacity
                    key={playlist.id}
                    style={[styles.row, alreadyAdded && styles.rowDisabled]}
                    activeOpacity={0.8}
                    onPress={() => onSelect(playlist)}
                    disabled={alreadyAdded || busy}
                  >
                    <View style={styles.rowIcon}>
                      <Ionicons name="list" size={16} color="#00E5FF" />
                    </View>
                    <View
                      style={styles.rowText}
                      lightColor="transparent"
                      darkColor="transparent"
                    >
                      <Text style={styles.rowTitle} numberOfLines={1}>
                        {playlist.nome}
                      </Text>
                      <Text style={styles.rowSubtitle}>
                        {alreadyAdded
                          ? "Jogo já está nesta playlist"
                          : `${gamesCount} ${gamesCount === 1 ? "jogo" : "jogos"}`}
                      </Text>
                    </View>
                    <Ionicons
                      name={
                        alreadyAdded
                          ? "checkmark-circle"
                          : adding
                            ? "hourglass-outline"
                            : "add-circle-outline"
                      }
                      size={20}
                      color={alreadyAdded ? "#00E5FF" : "#F52E8F"}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default PlaylistPickerModal;
