import { scaleTextStyle } from "../ScaledText";

describe("scaleTextStyle", () => {
  it("devolve exatamente o mesmo estilo quando a escala é 1 (custo zero)", () => {
    const style = { fontSize: 12, lineHeight: 18 };
    expect(scaleTextStyle(style, 1)).toBe(style);
  });

  it("multiplica fontSize e lineHeight", () => {
    expect(scaleTextStyle({ fontSize: 10, lineHeight: 16 }, 1.5)).toEqual({
      fontSize: 15,
      lineHeight: 24,
    });
  });

  it("usa 14 (padrão do RN) quando o estilo não define fontSize", () => {
    expect(scaleTextStyle({ color: "#fff" }, 1.3)).toEqual({
      color: "#fff",
      fontSize: 18.2,
    });
  });

  it("não cria lineHeight quando o estilo não tinha", () => {
    expect(scaleTextStyle({ fontSize: 10 }, 1.15)).not.toHaveProperty("lineHeight");
  });

  it("achata arrays de estilo e preserva as demais propriedades", () => {
    const result = scaleTextStyle(
      [{ fontSize: 8, color: "#fff" }, false, { fontFamily: "OrbitronBold" }],
      1.3,
    );
    expect(result).toEqual({ fontSize: 10.4, color: "#fff", fontFamily: "OrbitronBold" });
  });
});
