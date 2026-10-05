import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";

import BackButton from "@/components/BackButton/BackButton";
import Header from "@/components/Header/Header";
import NavBottom from "@/components/NavBottom/NavBottom";
import PlayerCard from "@/components/PlayerCard/PlayerCard";
import { Text, View } from "@/components/Themed";
import userService, { UserDTO } from "@/services/userService";

import { styles } from "./styles";

const PAGE_SIZE = 40;
const NUM_COLUMNS = 5;
const MAX_VISIBLE_DOTS = 6;

export interface PlayersProps {
  onBackPress?: () => void;
  onUserPress?: (userId: string) => void;
  onSearchPress?: () => void;
  onTabPress?: (tabId: string) => void;
}

export default function Players({
  onBackPress,
  onUserPress,
  onSearchPress,
  onTabPress,
}: PlayersProps) {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const listRef = useRef<FlatList<UserDTO>>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(false);
      // A API devolve todos os usuários; a paginação é feita aqui.
      setUsers(await userService.listarUsuarios());
    } catch (err) {
      console.error("Erro ao carregar jogadores:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const pageUsers = useMemo(
    () => users.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [users, page],
  );

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
  const canGoNext = page + 1 < totalPages;

  const goToPage = (next: number) => {
    setPage(next);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#F52E8F" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>
            Não foi possível carregar os jogadores.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadUsers}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (users.length === 0) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Nenhum jogador encontrado.</Text>
        </View>
      );
    }

    return (
      <FlatList
        ref={listRef}
        data={pageUsers}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <PlayerCard
            user={item}
            colorIndex={page * PAGE_SIZE + index}
            onPress={onUserPress}
          />
        )}
        ListFooterComponent={
          totalPages > 1 ? (
            <View style={styles.footerPagination}>
              <TouchableOpacity
                disabled={!canGoPrev}
                onPress={() => goToPage(page - 1)}
                style={[
                  styles.footerNavButton,
                  !canGoPrev && styles.footerNavButtonDisabled,
                ]}
              >
                <Ionicons name="chevron-back" size={14} color="#00E5FF" />
                <Text style={styles.footerNavButtonText}>Anterior</Text>
              </TouchableOpacity>

              <View style={styles.dotsRow}>
                {pageRange.map((p) => (
                  <Pressable key={p} onPress={() => goToPage(p)} hitSlop={6}>
                    <View style={p === page ? styles.dotActive : styles.dot} />
                  </Pressable>
                ))}
              </View>

              <TouchableOpacity
                disabled={!canGoNext}
                onPress={() => goToPage(page + 1)}
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
    );
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Header onSearchPress={onSearchPress} />
      </View>

      <View style={styles.container}>
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            {onBackPress ? <BackButton onPress={onBackPress} /> : null}
            <View style={styles.titleBar} />
            <View style={styles.transparent}>
              <Text style={styles.titleText}>Jogadores</Text>
              <Text style={styles.subtitleText}>
                {users.length} jogadores encontrados
              </Text>
            </View>
          </View>

          {totalPages > 1 ? (
            <View style={styles.pagerCompact}>
              <TouchableOpacity
                accessibilityLabel="Página anterior"
                accessibilityRole="button"
                disabled={!canGoPrev}
                onPress={() => goToPage(page - 1)}
                style={[styles.pagerButton, !canGoPrev && styles.pagerButtonDisabled]}
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
                onPress={() => goToPage(page + 1)}
                style={[styles.pagerButton, !canGoNext && styles.pagerButtonDisabled]}
              >
                <Ionicons name="chevron-forward" size={14} color="#00E5FF" />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {renderBody()}
      </View>

      <NavBottom activeTab="home" onTabPress={onTabPress} />
    </View>
  );
}
