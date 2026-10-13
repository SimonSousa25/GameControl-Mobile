import { auth } from "@/services/firebase";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";



export interface SessaoFirebase {
  uid: string;
  token: string;
  refreshToken: string;
  /** Segundos até o ID token expirar (o SDK renova sozinho). */
  expiresIn: number;
}

async function lerSessao(): Promise<SessaoFirebase> {
  const usuario = auth.currentUser;
  if (!usuario) {
    throw new Error("Nenhum usuário autenticado no Firebase.");
  }
  const resultado = await usuario.getIdTokenResult();
  const expiracao = new Date(resultado.expirationTime).getTime();
  return {
    uid: usuario.uid,
    token: resultado.token,
    refreshToken: usuario.refreshToken,
    expiresIn: Math.max(0, Math.round((expiracao - Date.now()) / 1000)),
  };
}

/**
 * Autenticação feita direto no Firebase Authentication. O backend não participa
 * do login: ele só valida o ID token enviado no cabeçalho Authorization.
 */
const authService = {
  async entrar(email: string, senha: string): Promise<SessaoFirebase> {
    await signInWithEmailAndPassword(auth, email, senha);
    return lerSessao();
  },

  /** Cria a conta no Firebase (já deixa o usuário autenticado). */
  async criarConta(email: string, senha: string): Promise<SessaoFirebase> {
    await createUserWithEmailAndPassword(auth, email, senha);
    return lerSessao();
  },

  /** Desfaz uma conta recém-criada cujo perfil não pôde ser salvo no backend. */
  async removerContaAtual(): Promise<void> {
    if (auth.currentUser) {
      await deleteUser(auth.currentUser);
    }
  },

  /** Envia o e-mail com o link para redefinir a senha. */
  async recuperarSenha(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  async sair(): Promise<void> {
    await firebaseSignOut(auth);
  },
};

export default authService;

function codigoDoErro(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const codigo = (error as { code: unknown }).code;
    return typeof codigo === "string" ? codigo : undefined;
  }
  return undefined;
}

/** true quando o Firebase informa que o e-mail não tem conta. */
export function ehUsuarioInexistente(error: unknown): boolean {
  return codigoDoErro(error) === "auth/user-not-found";
}

/** Traduz erros do Firebase Authentication para mensagens em português. */
export function mensagemDeErroAuth(error: unknown, padrao: string): string {
  switch (codigoDoErro(error)) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "E-mail ou senha incorretos.";
    case "auth/email-already-in-use":
      return "Este e-mail já está cadastrado.";
    case "auth/weak-password":
      return "A senha precisa ter pelo menos 6 caracteres.";
    case "auth/too-many-requests":
      return "Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.";
    case "auth/network-request-failed":
      return "Sem conexão com a internet. Verifique sua rede e tente novamente.";
    case "auth/user-disabled":
      return "Esta conta foi desativada.";
    default:
      return padrao;
  }
}