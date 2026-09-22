import { GameDTO } from "./gameService";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";

export interface ReviewDTO {
  id?: string;
  userId?: string;
  userName?: string;
  profilePictureUrl?: string;
  gameId?: string;
  rating?: number;
  description?: string;
  createdAt?: string;
}

export interface CreateReviewRequest {
  userId: string;
  gameId: string;
  rating: number;
  description: string;
}

export interface GameReviewsPageDTO {
  game: GameDTO;
  reviews: ReviewDTO[];
  userReview: ReviewDTO | null;
  average: number;
  displayAverage: string;
}

class ReviewService {
  async buscarPaginaDeAvaliacoes(
    gameId: string,
    userId?: string,
  ): Promise<GameReviewsPageDTO> {
    try {
      const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
      const response = await fetch(
        `${API_BASE_URL}/reviews/${gameId}/reviews-page${query}`,
      );
      if (!response.ok) {
        throw new Error(`Erro ao buscar avaliações: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar página de avaliações:", error);
      throw error;
    }
  }

  async enviarAvaliacao(
    userId: string,
    dados: CreateReviewRequest,
  ): Promise<ReviewDTO> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reviews?userId=${encodeURIComponent(userId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        },
      );
      if (!response.ok) {
        throw new Error(`Erro ao enviar avaliação: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      throw error;
    }
  }

  async deletarAvaliacao(id: string, userId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reviews/${id}?userId=${encodeURIComponent(userId)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw new Error(`Erro ao excluir avaliação: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
      throw error;
    }
  }
}

export default new ReviewService();
