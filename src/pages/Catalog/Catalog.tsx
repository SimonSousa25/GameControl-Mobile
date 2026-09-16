import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Pressable, TouchableOpacity } from "react-native";

import BackButton from "@/components/BackButton/BackButton";
import Header from "@/components/Header/Header";
import NavBottom from "@/components/NavBottom/NavBottom";
import { Text, View } from "@/components/Themed";
import gameService, { GameDTO } from "@/services/gameService";

import { styles } from "./styles";

const PAGE_SIZE = 12;
const MAX_VISIBLE_DOTS = 6;

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

export interface CatalogProps {
  initialSearch?: string;
  onBackPress?: () => void;
  onGamePress?: (gameId: string) => void;
  onTabPress?: (tabId: string) => void;
}

export function Catalog({
  initialSearch = "",
  onBackPress,
  onGamePress,
  onTabPress,
}: CatalogProps) {
  const [games, setGames] = useState<GameDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadGames();
  }, []);

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

  const filteredGames = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();
    if (!termo) return games;
    return games.filter((game) => game.title?.toLowerCase().includes(termo));
  }, [games, searchTerm]);

  // Sempre que a busca mudar, volta pra primeira página.
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filteredGames.slice(start, start + PAGE_SIZE);
  }, [filteredGames, page]);

  const pageRange = useMemo(() => {
    if (totalPages <= MAX_VISIBLE_DOTS) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    const half = Math.floor(MAX_VISIBLE_DOTS / 2);
    let start = Math.max(0, page - half);
    let end = Math.min(totalPages - 1, page + half);

    if (page < half) end = Math.min(totalPages - 1, MAX_VISIBLE_DOTS - 1);
    if (page > totalPages - 1 - half) {
      start = Math.max(0, totalPages - MAX_VISIBLE_DOTS);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const canGoPrev = page > 0;
  const canGoNext = (page + 1) * PAGE_SIZE < filteredGames.length;

  const goToPrev = () => {
    if (canGoPrev) setPage((p) => p - 1);
  };

  const goToNext = () => {
    if (canGoNext) setPage((p) => p + 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View
          style={styles.spinner}
          lightColor="transparent"
          darkColor="transparent"
        />
        <Text style={styles.loadingText}>CARREGANDO JOGOS</Text>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Header
          variant="search"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </View>

      <View style={styles.container}>
        <View style={styles.titleRow}>
          <View
            style={styles.titleLeft}
            lightColor="transparent"
            darkColor="transparent"
          >
            {onBackPress ? <BackButton onPress={onBackPress} /> : null}
            <View style={styles.titleBar} />
            <View lightColor="transparent" darkColor="transparent">
              <Text style={styles.titleText}>Catálogo</Text>
              <Text style={styles.subtitleText}>
                {filteredGames.length} jogos encontrados
              </Text>
            </View>
          </View>

          <View
            style={styles.pagerCompact}
            lightColor="transparent"
            darkColor="transparent"
          >
            <TouchableOpacity
              accessibilityLabel="Página anterior"
              accessibilityRole="button"
              disabled={!canGoPrev}
              onPress={goToPrev}
              style={[
                styles.pagerButton,
                !canGoPrev && styles.pagerButtonDisabled,
              ]}
            >
              <Ionicons name="chevron-back" size={14} color="#00E5FF" />
            </TouchableOpacity>

            <Text style={styles.pagerLabel}>
              <Text style={[styles.pagerLabel, styles.pagerLabelActive]}>
                {page + 1}
              </Text>
              <Text style={styles.pagerLabelMuted}> / </Text>
              <Text style={[styles.pagerLabel, styles.pagerLabelMuted]}>
                {totalPages}
              </Text>
            </Text>

            <TouchableOpacity
              accessibilityLabel="Próxima página"
              accessibilityRole="button"
              disabled={!canGoNext}
              onPress={goToNext}
              style={[
                styles.pagerButton,
                !canGoNext && styles.pagerButtonDisabled,
              ]}
            >
              <Ionicons name="chevron-forward" size={14} color="#00E5FF" />
            </TouchableOpacity>
          </View>
        </View>

        {filteredGames.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="search" size={26} color="#6B7280" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum jogo encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Tente buscar por outro termo.
            </Text>
          </View>
        ) : (
          <FlatList
            data={paginated}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const coverUrl = getCoverUrl(item);
              return (
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.8}
                  onPress={() => onGamePress?.(item.id)}
                >
                  <View style={styles.cardCover}>
                    {coverUrl ? (
                      <Image
                        source={{ uri: coverUrl }}
                        style={styles.cardImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={styles.cardImagePlaceholder}
                        lightColor="#0A0E15"
                        darkColor="#0A0E15"
                      >
                        <Ionicons
                          name="game-controller-outline"
                          size={22}
                          color="#334056"
                        />
                      </View>
                    )}
                    <View style={styles.cardCaption} lightColor="transparent" darkColor="transparent">
                      <View style={styles.cardAccentLine} />
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListFooterComponent={
              totalPages > 1 ? (
                <View
                  style={styles.footerPagination}
                  lightColor="transparent"
                  darkColor="transparent"
                >
                  <TouchableOpacity
                    disabled={!canGoPrev}
                    onPress={goToPrev}
                    style={[
                      styles.footerNavButton,
                      !canGoPrev && styles.footerNavButtonDisabled,
                    ]}
                  >
                    <Ionicons name="chevron-back" size={14} color="#00E5FF" />
                    <Text style={styles.footerNavButtonText}>Anterior</Text>
                  </TouchableOpacity>

                  <View
                    style={styles.dotsRow}
                    lightColor="transparent"
                    darkColor="transparent"
                  >
                    {pageRange.map((p) => (
                      <Pressable key={p} onPress={() => setPage(p)} hitSlop={6}>
                        <View style={p === page ? styles.dotActive : styles.dot} />
                      </Pressable>
                    ))}
                  </View>

                  <TouchableOpacity
                    disabled={!canGoNext}
                    onPress={goToNext}
                    style={[
                      styles.footerNavButton,
                      !canGoNext && styles.footerNavButtonDisabled,
                    ]}
                  >
                    <Text style={styles.footerNavButtonText}>Próxima</Text>
                    <Ionicons name="chevron-forward" size={14} color="#00E5FF" />
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />
        )}
      </View>

      <NavBottom activeTab="catalog" onTabPress={onTabPress} />
    </View>
  );
}

export default Catalog;
