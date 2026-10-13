import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from "firebase/auth";

/**
 * Configuração do app Web do Firebase (Console → Configurações do projeto →
 * Seus apps → app Web). Esses valores identificam o projeto e não são segredos.
 * O Expo só embute variáveis EXPO_PUBLIC_* referenciadas de forma literal.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.projectId ||
  !firebaseConfig.appId
) {
  throw new Error(
    "Firebase não configurado. Defina EXPO_PUBLIC_FIREBASE_API_KEY, " +
      "EXPO_PUBLIC_FIREBASE_PROJECT_ID e EXPO_PUBLIC_FIREBASE_APP_ID no " +
      ".env.local (veja .env.example) e reinicie com `npx expo start -c`.",
  );
}

function criarAuth(): Auth {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  try {
    // Persistência em AsyncStorage: o usuário continua logado ao fechar o app.
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Fast Refresh reexecuta este módulo e a autenticação já foi inicializada.
    return getAuth(app);
  }
}

export const auth = criarAuth();

// E-mails do Firebase (recuperação de senha etc.) em português.
auth.languageCode = "pt-BR";

/**
 * ID token atual do Firebase. O SDK o renova sozinho quando está perto de
 * expirar; `forcarRenovacao` pede um novo mesmo assim (ex.: após um 401).
 * Retorna null quando não há usuário autenticado.
 */
export async function obterIdToken(
  forcarRenovacao = false,
): Promise<string | null> {
  // Na abertura do app, aguarda o Firebase restaurar o usuário salvo.
  await auth.authStateReady();
  const usuario = auth.currentUser;
  return usuario ? usuario.getIdToken(forcarRenovacao) : null;
}