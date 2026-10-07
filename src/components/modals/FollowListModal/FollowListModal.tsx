import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Image, Modal, ScrollView, TextInput, TouchableOpacity } from "react-native";

import AvatarGradient from "@/components/PlayersHighlight/AvatarGradient";
import { Text, View } from "@/components/Themed";
import userService, { UserDTO } from "@/services/userService";
import { getAvatarUrl } from "@/utils/avatar";

import { styles } from "./styles";

export interface FollowListModalProps {
  visible: boolean;
  mode: "followers" | "following";
  userIds: string[];
  onClose: () => void;
  onUserPress: (userId: string) => void;
}

export function FollowListModal({
  visible,
  mode,
  userIds,
  onClose,
  onUserPress,
}: FollowListModalProps) {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!visible) return;
    setSearchTerm("");
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const all = await userService.listarUsuarios();
        if (!cancelled) setUsers(all);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visible]);

  const results = useMemo(() => {
    const filtered = users.filter((user) => userIds.includes(user.id));
    const term = searchTerm.trim().toLowerCase();
    if (!term) return filtered;
    return filtered.filter((user) => user.username.toLowerCase().includes(term));
  }, [users, userIds, searchTerm]);

  const title = mode === "followers" ? "Seguidores" : "Seguindo";
  const emptyText =
    userIds.length === 0
      ? mode === "followers"
        ? "Nenhum seguidor ainda."
        : "Não segue ninguém ainda."
      : "Nenhum usuário encontrado.";

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
              <Text style={styles.title}>{title}</Text>
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
              placeholder="Buscar por um usuário"
              placeholderTextColor="#5C6478"
              autoCapitalize="none"
            />
          </View>

          {loading ? (
            <View
              style={styles.stateContainer}
              lightColor="transparent"
              darkColor="transparent"
            >
              <Text style={styles.stateText}>Carregando usuários...</Text>
            </View>
          ) : results.length === 0 ? (
            <View
              style={styles.stateContainer}
              lightColor="transparent"
              darkColor="transparent"
            >
              <Text style={styles.stateText}>{emptyText}</Text>
            </View>
          ) : (
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {results.map((user, index) => {
                const avatarUrl = getAvatarUrl(user.profilePictureUrl);
                return (
                  <TouchableOpacity
                    key={user.id}
                    style={styles.row}
                    activeOpacity={0.8}
                    onPress={() => {
                      onClose();
                      onUserPress(user.id);
                    }}
                  >
                    <View style={styles.rowAvatar}>
                      {avatarUrl ? (
                        <Image
                          source={{ uri: avatarUrl }}
                          style={styles.rowAvatarImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <AvatarGradient
                          initial={user.username.charAt(0).toUpperCase()}
                          colorIndex={index}
                        />
                      )}
                    </View>
                    <View
                      style={styles.rowTextWrap}
                      lightColor="transparent"
                      darkColor="transparent"
                    >
                      <Text style={styles.rowTitle} numberOfLines={1}>
                        {user.username}
                      </Text>
                      <Text style={styles.rowSubtitle} numberOfLines={1}>
                        @{user.username.toLowerCase()}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#5C6478" />
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

export default FollowListModal;
