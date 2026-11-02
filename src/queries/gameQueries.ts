import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";

import gameService, { type GameDTO } from "@/services/gameService";

const MINUTO = 60_000;

/** Jogo da Semana: o mais bem avaliado (com a nota) ou, sem ele, o destaque. */
export interface GameOfWeekData {
  game: GameDTO;
  /** Presentes quando o jogo vem do ranking por reviews. */
  averageRating?: number;
  reviewCount?: number;
}

export const gameKeys = {
  all: ["games"] as const,
  featured: (limit: number) => [...gameKeys.all, "featured", limit] as const,
  hero: (slugs: readonly string[]) => [...gameKeys.all, "hero", ...slugs] as const,
  gameOfWeek: () => [...gameKeys.all, "game-of-week"] as const,
  catalog: (title: string, page: number, size: number) =>
    [...gameKeys.all, "catalog", title.trim(), page, size] as const,
  detail: (id: string) => [...gameKeys.all, "detail", id] as const,
  genres: () => ["genres"] as const,
};

export const featuredGamesQuery = (limit: number) =>
  queryOptions({
    queryKey: gameKeys.featured(limit),
    queryFn: () => gameService.listarJogosEmDestaque(limit),
    staleTime: 5 * MINUTO,
  });

/**
 * Jogos do banner da Home. Busca só os jogos necessários, um por slug (respostas
 * pequenas), em vez de baixar a lista inteira de jogos. Se algum slug não existir
 * no banco, cai no comportamento antigo: lista tudo e a tela casa por slug/título.
 */
export const heroGamesQuery = (slugs: readonly string[]) =>
  queryOptions({
    queryKey: gameKeys.hero(slugs),
    queryFn: async (): Promise<GameDTO[]> => {
      const encontrados = await Promise.all(
        slugs.map((slug) => gameService.buscarJogoPorSlug(slug).catch(() => null)),
      );
      const jogos = encontrados.filter((jogo): jogo is GameDTO => jogo !== null);
      if (jogos.length === slugs.length) return jogos;
      return gameService.listarTodosJogos();
    },
    staleTime: 30 * MINUTO,
  });

export const gameOfWeekQuery = () =>
  queryOptions({
    queryKey: gameKeys.gameOfWeek(),
    queryFn: async (): Promise<GameOfWeekData | null> => {
      // Prioridade: o jogo mais bem avaliado pelas reviews dos jogadores.
      const topRated = await gameService.buscarMelhorAvaliado().catch(() => null);
      if (topRated?.game) {
        return {
          game: topRated.game,
          averageRating: topRated.averageRating,
          reviewCount: topRated.reviewCount,
        };
      }

      // Ainda não há jogo com avaliações suficientes: usa o destaque da semana.
      const featured = await gameService.buscarJogoDaSemana();
      return featured ? { game: featured } : null;
    },
    staleTime: 5 * MINUTO,
  });

export const catalogPageQuery = (title: string, page: number, size: number) =>
  queryOptions({
    queryKey: gameKeys.catalog(title, page, size),
    queryFn: () => gameService.listarCatalogo(title, page, size),
    staleTime: 2 * MINUTO,
  });

export const gameDetailQuery = (id: string) =>
  queryOptions({
    queryKey: gameKeys.detail(id),
    queryFn: () => gameService.buscarJogoPorId(id),
    staleTime: 5 * MINUTO,
  });

/** Gêneros quase nunca mudam. */
export const genresQuery = () =>
  queryOptions({
    queryKey: gameKeys.genres(),
    queryFn: () => gameService.listarGeneros(),
    staleTime: 60 * MINUTO,
  });

export function useFeaturedGames(limit: number, enabled = true) {
  return useQuery({ ...featuredGamesQuery(limit), enabled });
}

export function useHeroGames(slugs: readonly string[], enabled = true) {
  return useQuery({ ...heroGamesQuery(slugs), enabled });
}

export function useGameOfWeek() {
  return useQuery(gameOfWeekQuery());
}

/**
 * Página do catálogo. `keepPreviousData` mantém a página atual na tela enquanto a
 * próxima carrega (sem piscar ao paginar ou digitar na busca).
 */
export function useCatalogPage(title: string, page: number, size: number) {
  return useQuery({
    ...catalogPageQuery(title, page, size),
    placeholderData: keepPreviousData,
  });
}
