import { fireEvent, render } from "@testing-library/react-native";

import ViewAllButton from "@/components/ViewAllButton/ViewAllButton";
import { VIEW_ALL_HIT_SLOP } from "@/components/ViewAllButton/styles";

// Ícones carregam fontes de forma assíncrona e geram avisos de act() nos testes.
jest.mock("@expo/vector-icons", () => ({ Ionicons: "Ionicons" }));

// O módulo nativo do AsyncStorage não existe no Jest; o Text do app depende dele.
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

describe("ViewAllButton", () => {
  it("mostra o texto padrão 'Ver tudo'", () => {
    const { getByText } = render(<ViewAllButton />);
    expect(getByText("Ver tudo")).toBeTruthy();
  });

  it("chama onPress ao tocar", () => {
    const onPress = jest.fn();
    const { getByRole } = render(<ViewAllButton onPress={onPress} />);

    fireEvent.press(getByRole("button"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("usa accessibilityLabel próprio quando informado", () => {
    const { getByLabelText } = render(
      <ViewAllButton accessibilityLabel="Ver todos os jogadores" />,
    );
    expect(getByLabelText("Ver todos os jogadores")).toBeTruthy();
  });

  it("amplia a área de toque além do tamanho visual", () => {
    const { getByRole } = render(<ViewAllButton />);
    expect(getByRole("button").props.hitSlop).toEqual(VIEW_ALL_HIT_SLOP);
    // 8px de cada lado somados à altura visual (~32px) passam dos 44px recomendados.
    expect(VIEW_ALL_HIT_SLOP.top + VIEW_ALL_HIT_SLOP.bottom).toBeGreaterThanOrEqual(16);
  });
});
