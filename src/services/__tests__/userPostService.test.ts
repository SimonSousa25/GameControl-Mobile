import userPostService from "@/services/userPostService";
import { apiFetch } from "@/services/api";

jest.mock("@/services/api", () => ({
  apiFetch: jest.fn(),
}));

const mockedApiFetch = apiFetch as jest.Mock;

function mockResponse(ok: boolean, body: unknown, statusText = "Error") {
  return {
    ok,
    statusText,
    json: async () => body,
  };
}

describe("userPostService", () => {
  beforeEach(() => {
    mockedApiFetch.mockReset();
  });

  it("lista todos os posts chamando GET /posts", async () => {
    const posts = [{ id: "1", text: "oi" }];
    mockedApiFetch.mockResolvedValueOnce(mockResponse(true, posts));

    const result = await userPostService.listarTodosPosts();

    expect(mockedApiFetch).toHaveBeenCalledWith("/posts");
    expect(result).toEqual(posts);
  });

  it("lança erro quando a resposta não é ok", async () => {
    mockedApiFetch.mockResolvedValueOnce(mockResponse(false, null, "Server Error"));

    await expect(userPostService.listarTodosPosts()).rejects.toThrow(
      "Erro ao listar posts: Server Error",
    );
  });

  it("cria um post enviando userId e texto no corpo", async () => {
    const created = { id: "2", userId: "u1", text: "novo post" };
    mockedApiFetch.mockResolvedValueOnce(mockResponse(true, created));

    const result = await userPostService.criarPost({
      userId: "u1",
      text: "novo post",
    });

    expect(mockedApiFetch).toHaveBeenCalledWith("/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "u1", text: "novo post" }),
    });
    expect(result).toEqual(created);
  });

  it("alterna curtida chamando POST /posts/:id/like (sem userId na URL)", async () => {
    mockedApiFetch.mockResolvedValueOnce(mockResponse(true, null));

    await userPostService.alternarCurtida("post1");

    expect(mockedApiFetch).toHaveBeenCalledWith("/posts/post1/like", {
      method: "POST",
    });
  });

  it("exclui post chamando DELETE /posts/:id", async () => {
    mockedApiFetch.mockResolvedValueOnce(mockResponse(true, null));

    await userPostService.deletarPost("post1");

    expect(mockedApiFetch).toHaveBeenCalledWith("/posts/post1", {
      method: "DELETE",
    });
  });
});
