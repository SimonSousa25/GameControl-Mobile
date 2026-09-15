import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Image, Modal, ScrollView, TextInput, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import gameService, { GameDTO } from "@/services/gameService";

import { styles } from "./styles";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";
const UPLOADS_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

function getCoverUrl(game: GameDTO): string | undefined {
  const cover = game.coverImageUrl || game.capa;
  if (!cover) return undefined;
  if (cover.startsWith("http://") || cover.startsWith("https://")) {
    return cover;
  }
  return `${UPLOADS_BASE_URL}/uploads/${cover}`;
}

export interface GamePickerModalProps {
  visible: boolean;
  excludeIds?: string[];
  onClose: () => void;
  onSelect: (game: GameDTO) => void;
}

export function GamePickerModal({
  visible,
  excludeIds = [],
  onClose,
  onSelect,
}: GamePickerModalProps) {
  const [games, setGames] = useState<GameDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!visible) return;
    setSearchTerm("");
    loadGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await gameService.listarTodosJogos();
      setGames(data);
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const results = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();
    return games
      .filter((game) => !excludeIds.includes(game.id))
      .filter((game) => !termo || game.title?.toLowerCase().includes(termo));
  }, [games, searchTerm, excludeIds]);

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
              <Text style={styles.title}>Adicionar jogo</Text>
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

          <View
            style={styles.searchBar}
            lightColor="transparent"
            darkColor="transparent"
          >
            <Ionicons name="search" size={16} color="#5C6478" />
            <TextInput
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Buscar por um jogo"
              placeholderTextColor="#5C6478"
            />
          </View>

          {loading ? (
            <View
              style={styles.stateContainer}
              lightColor="transparent"
              darkColor="transparent"
            >
              <Text style={styles.stateText}>Carregando jogos...</Text>
            </View>
          ) : results.length === 0 ? (
            <View
              style={styles.stateContainer}
              lightColor="transparent"
              darkColor="transparent"
            >
              <Text style={styles.stateText}>Nenhum jogo encontrado.</Text>
            </View>
          ) : (
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {results.map((game) => {
                const coverUrl = getCoverUrl(game);
                return (
                  <TouchableOpacity
                    key={game.id}
                    style={styles.row}
                    activeOpacity={0.8}
                    onPress={() => onSelect(game)}
                  >
                    <View style={styles.rowCover}>
                      {coverUrl ? (
                        <Image
                          source={{ uri: coverUrl }}
                          style={styles.rowImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={styles.rowImagePlaceholder}
                          lightColor="#0A0E15"
                          darkColor="#0A0E15"
                        >
                          <Ionicons
                            name="game-controller-outline"
                            size={16}
                            color="#334056"
                          />
                        </View>
                      )}
                    </View>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {game.title}
                    </Text>
                    <Ionicons name="add-circle-outline" size={20} color="#F52E8F" />
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

export default GamePickerModal;
