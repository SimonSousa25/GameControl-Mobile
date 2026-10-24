import { getAvatarUrl } from "@/utils/avatar";

describe("getAvatarUrl", () => {
  it("retorna undefined quando não há foto", () => {
    expect(getAvatarUrl(undefined)).toBeUndefined();
    expect(getAvatarUrl(null)).toBeUndefined();
    expect(getAvatarUrl("")).toBeUndefined();
  });

  it("retorna a própria URL quando já é http(s)", () => {
    expect(getAvatarUrl("https://cdn.exemplo.com/foto.png")).toBe(
      "https://cdn.exemplo.com/foto.png",
    );
    expect(getAvatarUrl("http://cdn.exemplo.com/foto.png")).toBe(
      "http://cdn.exemplo.com/foto.png",
    );
  });

  it("retorna a própria URL quando é um data URI", () => {
    const dataUri = "data:image/png;base64,abc123";
    expect(getAvatarUrl(dataUri)).toBe(dataUri);
  });

  it("monta a URL de uploads quando recebe apenas o nome do arquivo", () => {
    expect(getAvatarUrl("foto123.png")).toBe(
      "http://localhost:8080/uploads/foto123.png",
    );
  });
});
