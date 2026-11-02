import gameService, { type GameDTO } from "@/services/gameService";
import { heroGamesQuery, gameOfWeekQuery } from "@/src/queries/gameQueries";

jest.mock("@/services/gameService", () => ({
  __esModule: true,
  default: {
    buscarJogoPorSlug: jest.fn(),
    listarTodosJogos: jest.fn(),
    buscarMelhorAvaliado: jest.fn(),
    buscarJogoDaSemana: jest.fn(),
  },
}));

const service = gameService as unknown as Record<string, jest.Mock>;
const jogo = (slug: string) => ({ id: slug, slug, title: slug }) as GameDTO;

// Executa o queryFn direto, sem montar um QueryClient.
const rodar = (opcoes: { queryFn?: unknown }) =>
  (opcoes.queryFn as () => Promise<unknown>)();

describe("heroGamesQuery", () => {
  beforeEach(() => jest.clearAllMocks());

  it("busca só os jogos pedidos, por slug, sem listar o catálogo todo", async () => {
    service.buscarJogoPorSlug.mockImplementation((slug: string) =>
      Promise.resolve(jogo(slug)),
    );

    const jogos = await rodar(heroGamesQuery(["a", "b", "c"]));

    expect(jogos).toEqual([jogo("a"), jogo("b"), jogo("c")]);
    expect(service.buscarJogoPorSlug).toHaveBeenCalledTimes(3);
    expect(service.listarTodosJogos).not.toHaveBeenCalled();
  });

  it("se algum slug não existe, cai na lista completa (comportamento antigo)", async () => {
    service.buscarJogoPorSlug.mockImplementation((slug: string) =>
      Promise.resolve(slug === "b" ? null : jogo(slug)),
    );
    service.listarTodosJogos.mockResolvedValue([jogo("a"), jogo("x")]);

    const jogos = await rodar(heroGamesQuery(["a", "b"]));

    expect(jogos).toEqual([jogo("a"), jogo("x")]);
    expect(service.listarTodosJogos).toHaveBeenCalledTimes(1);
  });

  it("se a busca por slug falha, também cai na lista completa", async () => {
    service.buscarJogoPorSlug.mockRejectedValue(new Error("rede"));
    service.listarTodosJogos.mockResolvedValue([jogo("a")]);

    expect(await rodar(heroGamesQuery(["a"]))).toEqual([jogo("a")]);
  });
});

describe("gameOfWeekQuery", () => {
  beforeEach(() => jest.clearAllMocks());

  it("prioriza o mais bem avaliado, com a nota", async () => {
    service.buscarMelhorAvaliado.mockResolvedValue({
      game: jogo("top"),
      averageRating: 4.6,
      reviewCount: 9,
    });

    expect(await rodar(gameOfWeekQuery())).toEqual({
      game: jogo("top"),
      averageRating: 4.6,
      reviewCount: 9,
    });
    expect(service.buscarJogoDaSemana).not.toHaveBeenCalled();
  });

  it("sem ranking, usa o destaque da semana", async () => {
    service.buscarMelhorAvaliado.mockResolvedValue(null);
    service.buscarJogoDaSemana.mockResolvedValue(jogo("semana"));

    expect(await rodar(gameOfWeekQuery())).toEqual({ game: jogo("semana") });
  });

  it("sem nenhum dos dois, retorna null", async () => {
    service.buscarMelhorAvaliado.mockRejectedValue(new Error("x"));
    service.buscarJogoDaSemana.mockResolvedValue(null);

    expect(await rodar(gameOfWeekQuery())).toBeNull();
  });
});
