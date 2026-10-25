import { apiFetch } from "@/services/api";
import gameService from "@/services/gameService";

jest.mock("@/services/api", () => ({
  apiFetch: jest.fn(),
}));

const mockedApiFetch = apiFetch as jest.Mock;

describe("gameService.buscarMelhorAvaliado", () => {
  beforeEach(() => {
    mockedApiFetch.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => jest.restoreAllMocks());

  it("retorna o jogo com a média e a quantidade de avaliações", async () => {
    const dto = {
      game: { id: "g1", title: "Jogo", slug: "jogo" },
      averageRating: 4.6,
      reviewCount: 12,
    };
    mockedApiFetch.mockResolvedValueOnce({ ok: true, status: 200, json: async () => dto });

    await expect(gameService.buscarMelhorAvaliado()).resolves.toEqual(dto);
    expect(mockedApiFetch).toHaveBeenCalledWith("/games/melhor-avaliado");
  });

  it("retorna null quando nenhum jogo atende às regras (204)", async () => {
    mockedApiFetch.mockResolvedValueOnce({ ok: true, status: 204 });

    await expect(gameService.buscarMelhorAvaliado()).resolves.toBeNull();
  });

  it("lança erro em falhas do servidor", async () => {
    mockedApiFetch.mockResolvedValueOnce({ ok: false, status: 500, statusText: "Server Error" });

    await expect(gameService.buscarMelhorAvaliado()).rejects.toThrow(
      "Erro ao buscar jogo mais bem avaliado: Server Error",
    );
  });
});
