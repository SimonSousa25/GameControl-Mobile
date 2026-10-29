import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Níveis de fonte oferecidos ao usuário. Poucos níveis fixos (em vez de um
 * slider) mantêm o layout previsível e evitam re-renders a cada pixel arrastado.
 */
export const FONT_SCALE_OPTIONS = [
  { id: "normal", label: "Padrão", short: "A", scale: 1 },
  { id: "large", label: "Grande", short: "A", scale: 1.15 },
  { id: "larger", label: "Maior", short: "A", scale: 1.3 },
  { id: "max", label: "Máximo", short: "A", scale: 1.5 },
] as const;

export type FontScaleId = (typeof FONT_SCALE_OPTIONS)[number]["id"];

const STORAGE_KEY = "@gamecontrol/font-scale";
const DEFAULT_ID: FontScaleId = "normal";

function scaleFromId(id: FontScaleId): number {
  return FONT_SCALE_OPTIONS.find((option) => option.id === id)?.scale ?? 1;
}

function isFontScaleId(value: unknown): value is FontScaleId {
  return FONT_SCALE_OPTIONS.some((option) => option.id === value);
}

interface FontScaleContextValue {
  fontScaleId: FontScaleId;
  /** Multiplicador aplicado a fontSize/lineHeight (1 = tamanho original). */
  fontScale: number;
  /** true enquanto a preferência salva ainda está sendo lida do aparelho. */
  loading: boolean;
  setFontScaleId: (id: FontScaleId) => void;
}

const FontScaleContext = createContext<FontScaleContextValue>({
  fontScaleId: DEFAULT_ID,
  fontScale: 1,
  loading: false,
  setFontScaleId: () => {},
});

export function FontScaleProvider({ children }: { children: ReactNode }) {
  const [fontScaleId, setId] = useState<FontScaleId>(DEFAULT_ID);
  const [loading, setLoading] = useState(true);

  // Lê a preferência uma única vez, na abertura do app.
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (!cancelled && isFontScaleId(saved)) setId(saved);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setFontScaleId = useCallback((id: FontScaleId) => {
    // Aplica na hora (preview imediato) e grava em segundo plano.
    setId(id);
    AsyncStorage.setItem(STORAGE_KEY, id).catch(() => {});
  }, []);

  const value = useMemo<FontScaleContextValue>(
    () => ({
      fontScaleId,
      fontScale: scaleFromId(fontScaleId),
      loading,
      setFontScaleId,
    }),
    [fontScaleId, loading, setFontScaleId],
  );

  return (
    <FontScaleContext.Provider value={value}>
      {children}
    </FontScaleContext.Provider>
  );
}

export function useFontScale(): FontScaleContextValue {
  return useContext(FontScaleContext);
}
