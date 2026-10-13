import type { Persistence } from "firebase/auth";

/**
 * O SDK do Firebase exporta `getReactNativePersistence` no build de React
 * Native, mas os tipos de "firebase/auth" não o declaram. Esta declaração só
 * informa o tipo ao TypeScript; não altera nada em tempo de execução.
 */
declare module "firebase/auth" {
  export function getReactNativePersistence(storage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }): Persistence;
}