import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AvatarGradient from "@/components/PlayersHighlight/AvatarGradient";
import BackButton from "@/components/BackButton/BackButton";
import Header from "@/components/Header/Header";
import NavBottom from "@/components/NavBottom/NavBottom";
import { Text } from "@/components/Themed";
import reviewService, {
  GameReviewsPageDTO,
} from "@/services/reviewService";

import { styles } from "./styles";

interface ReviewsProps {
  gameId: string;
  userId: string;
  onBackPress?: () => void;
  onTabPress?: (tabId: string) => void;
}

function formatDate(value?: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("pt-BR");
}

export default function Reviews({
  gameId,
  userId,
  onBackPress,
  onTabPress,
}: ReviewsProps) {
  const [data, setData] = useState<GameReviewsPageDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [gameId, userId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(false);
      const page = await reviewService.buscarPaginaDeAvaliacoes(
        gameId,
        userId,
      );
      setData(page);
      setMyRating(page.userReview?.rating ?? 0);
      setMyComment(page.userReview?.description ?? "");
    } catch (err) {
      console.error("Erro ao carregar avaliações:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (myRating === 0 || submitting) return;
    try {
      setSubmitting(true);
      await reviewService.enviarAvaliacao(userId, {
        userId,
        gameId,
        rating: myRating,
        description: myComment,
      });
      await loadReviews();
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const communityReviews = data?.reviews ?? [];
  const totalReviewsCount = communityReviews.length + (data?.userReview ? 1 : 0);
  const filledGameStars = Math.round(data?.average ?? 0);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Header variant="icon" />
      </View>

      <View style={styles.gameBar}>
        <View style={styles.gameBarCard}>
          <BackButton onPress={onBackPress} />
          <View style={styles.gameBarTitleWrap}>
            <Text style={styles.gameBarTitle} numberOfLines={1}>
              {data?.game?.title ?? ""}
            </Text>
          </View>
          <View style={styles.gameBarRating}>
            <Text style={styles.gameBarRatingValue}>
              {data?.displayAverage ?? "0"}
            </Text>
            <View style={styles.gameBarStars}>
              {[1, 2, 3, 4, 5].map((position) => (
                <Ionicons
                  key={position}
                  name={position <= filledGameStars ? "star" : "star-outline"}
                  size={12}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.gameBarRatingCount}>
              {totalReviewsCount} avaliações
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F52E8F" />
        </View>
      ) : error || !data ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            Não foi possível carregar as avaliações.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <View style={styles.ratingCard}>
              <View style={styles.sectionTitleRow}>
                <LinearGradient
                  colors={["#0559AB", "#F22E8F"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.sectionGradientBar}
                />
                <Text style={styles.sectionTitle}>Sua avaliação</Text>
              </View>

              <View style={styles.myStarsRow}>
                {[1, 2, 3, 4, 5].map((position) => (
                  <TouchableOpacity
                    key={position}
                    accessibilityLabel={`Avaliar com ${position} estrela${position > 1 ? "s" : ""}`}
                    accessibilityRole="button"
                    onPress={() => setMyRating(position)}
                    hitSlop={6}
                  >
                    <Ionicons
                      name={position <= myRating ? "star" : "star-outline"}
                      size={32}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.commentInput}
                placeholder="O que você achou desse jogo? (Opcional)"
                placeholderTextColor="#5C6478"
                value={myComment}
                onChangeText={setMyComment}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (myRating === 0 || submitting) && styles.submitButtonDisabled,
                ]}
                activeOpacity={0.8}
                disabled={myRating === 0 || submitting}
                onPress={handleSubmit}
              >
                <Ionicons name="send" size={16} color="#F5F7FF" />
                <Text style={styles.submitButtonText}>
                  {submitting ? "Enviando..." : "Enviar avaliação"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <LinearGradient
                  colors={["#0559AB", "#F22E8F"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.sectionGradientBar}
                />
                <Text style={styles.sectionTitle}>
                  Avaliações da comunidade
                </Text>
              </View>
              <Text style={styles.sectionCount}>
                ({communityReviews.length})
              </Text>
            </View>

            {communityReviews.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubble-outline" size={28} color="#6B7280" />
                <Text style={styles.emptyText}>
                  Nenhuma avaliação da comunidade ainda.
                </Text>
              </View>
            ) : (
              communityReviews.map((review, index) => {
                const reviewStars = Math.round(review.rating ?? 0);
                return (
                  <View key={review.id ?? index} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <AvatarGradient
                        initial={(review.userName || "?").charAt(0).toUpperCase()}
                        colorIndex={index}
                      />
                      <View style={styles.reviewHeaderInfo}>
                        <Text style={styles.reviewUsername}>
                          {review.userName}
                        </Text>
                        <View style={styles.reviewStars}>
                          {[1, 2, 3, 4, 5].map((position) => (
                            <Ionicons
                              key={position}
                              name={
                                position <= reviewStars ? "star" : "star-outline"
                              }
                              size={12}
                              color="#FFD700"
                            />
                          ))}
                        </View>
                      </View>
                      <Text style={styles.reviewDate}>
                        {formatDate(review.createdAt)}
                      </Text>
                    </View>
                    {review.description ? (
                      <Text style={styles.reviewText}>
                        {review.description}
                      </Text>
                    ) : null}
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      )}

      <NavBottom onTabPress={onTabPress} />
    </View>
  );
}
