import { apiFetch } from "@/services/api";
import { isPrivateProfileError } from "@/services/apiError";
import playlistService from "@/services/playlistService";
import userPostService from "@/services/userPostService";

jest.mock("@/services/api", () => ({
  apiFetch: jest.fn(),
}));

const mockedApiFetch = apiFetch as jest.Mock;

const forbidden = {
  status: 403,
  ok: false,
  statusText: "Forbidden",
  json: async () => ({}),
};

describe("conteúdo de perfil privado (403)", () => {
  beforeEach(() => {
    mockedApiFetch.mockReset();
  });

  it("posts: 403 vira erro de perfil privado, sem log de erro", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedApiFetch.mockResolvedValueOnce(forbidden);

    const error = await userPostService.listarPostsDoUsuario("x").catch((e) => e);

    expect(isPrivateProfileError(error)).toBe(true);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("playlists: 403 vira erro de perfil privado, sem log de erro", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedApiFetch.mockResolvedValueOnce(forbidden);

    const error = await playlistService.listarPlaylistsDoUsuario("x").catch((e) => e);

    expect(isPrivateProfileError(error)).toBe(true);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("outros erros continuam sendo erros comuns", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedApiFetch.mockResolvedValueOnce({ ...forbidden, status: 500, statusText: "Server Error" });

    const error = await userPostService.listarPostsDoUsuario("x").catch((e) => e);

    expect(isPrivateProfileError(error)).toBe(false);
    expect(error.message).toBe("Erro ao listar posts do usuário: Server Error");
    consoleError.mockRestore();
  });
});
