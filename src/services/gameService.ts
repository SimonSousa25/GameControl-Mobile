const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";

export interface GameDTO {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  capa?: string;
  genero?: string;
  genreIds?: string[];
  plataforma?: string;
  dataDeLancamento?: string;
  releaseDate?: string;
  developer?: string;
  publisher?: string;
  rating?: number;
  ratingCount?: number;
  preco?: number;
  [key: string]: any;
}

export interface GenreDTO {
  id: string;
  name: string;
  slug: string;
}

class GameService {
  async listarTodosJogos(): Promise<GameDTO[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/games`);
      if (!response.ok) {
        throw new Error(`Erro ao listar jogos: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao listar todos os jogos:", error);
      throw error;
    }
  }

  async listarJogosRecentes(): Promise<GameDTO[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/recentes`);
      if (!response.ok) {
        throw new Error(
          `Erro ao listar jogos recentes: ${response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao listar jogos recentes:", error);
      throw error;
    }
  }

  async buscarJogoPorId(id: string): Promise<GameDTO | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erro ao buscar jogo: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar jogo por ID:", error);
      throw error;
    }
  }

  async buscarJogoPorSlug(slug: string): Promise<GameDTO | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/slug/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erro ao buscar jogo: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar jogo por slug:", error);
      throw error;
    }
  }

  async listarGeneros(): Promise<GenreDTO[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/genres`);
      if (!response.ok) {
        throw new Error(`Erro ao listar gêneros: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao listar gêneros:", error);
      throw error;
    }
  }

  async criarJogo(dados: any): Promise<GameDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });
      if (!response.ok) {
        throw new Error(`Erro ao criar jogo: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao criar jogo:", error);
      throw error;
    }
  }

  async atualizarJogo(id: string, dados: Partial<GameDTO>): Promise<GameDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });
      if (!response.ok) {
        throw new Error(`Erro ao atualizar jogo: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar jogo:", error);
      throw error;
    }
  }

  async deletarJogo(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Erro ao deletar jogo: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao deletar jogo:", error);
      throw error;
    }
  }
}

export default new GameService();
