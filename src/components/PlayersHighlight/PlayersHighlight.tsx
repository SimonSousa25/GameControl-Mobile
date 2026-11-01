import { Text, View } from "@/components/Themed";
import userService, { UserDTO } from "@/services/userService";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  PanResponder,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import PlayerCard from "@/components/PlayerCard/PlayerCard";
import { styles } from "./styles";

interface PlayersHighlightProps {
  onUserPress?: (userId: string) => void;
  onViewAllPress?: () => void;
}

export default function PlayersHighlight({
  onUserPress,
  onViewAllPress,
}: PlayersHighlightProps) {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<ScrollView>(null);
  const scrollOffset = useRef(0);
  const dragStartOffset = useRef(0);
  const dragStartX = useRef(0);

  // Permite clicar e arrastar o carrossel com o mouse na versão web.
  const webDragResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        Math.abs(gesture.dx) > 5 &&
        Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderGrant: (_, gesture) => {
        dragStartOffset.current = scrollOffset.current;
        dragStartX.current = gesture.dx;
      },
      onPanResponderMove: (_, gesture) => {
        const movement = gesture.dx - dragStartX.current;
        carouselRef.current?.scrollTo({
          x: Math.max(0, dragStartOffset.current - movement),
          animated: false,
        });
      },
    }),
  ).current;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.listarUsuarios();
      setUsers(data.slice(0, 8)); // Quatro jogadores visíveis e mais quatro no swipe
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container} lightColor="transparent" darkColor="transparent">
        <View style={styles.header} lightColor="transparent" darkColor="transparent">
          <Text style={styles.title}>Jogadores em Destaque</Text>
        </View>
        <View style={styles.loadingContainer} lightColor="transparent" darkColor="transparent">
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} lightColor="transparent" darkColor="transparent">
      <View style={styles.header} lightColor="transparent" darkColor="transparent">
        <LinearGradient
          colors={["#0559AB", "#F22E8F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.titleGradientBar}
        />
        <Text style={styles.title}>Jogadores em Destaque</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={styles.viewAll}>Ver tudo →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={carouselRef}
        horizontal
        nestedScrollEnabled
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          scrollOffset.current = event.nativeEvent.contentOffset.x;
        }}
        style={styles.carouselContainer}
        {...(Platform.OS === "web" ? webDragResponder.panHandlers : {})}
      >
        {users.slice(0, 8).map((user, index) => (
          <PlayerCard
            key={user.id}
            user={user}
            colorIndex={index}
            onPress={onUserPress}
            size="large"
            style={styles.cardSpacing}
          />
        ))}
      </ScrollView>
    </View>
  );
}
