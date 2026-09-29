import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Switch, Text, View } from "react-native";

import ConfirmModal from "@/components/modals/ConfirmModal/ConfirmModal";

import { styles } from "./styles";

interface AccountPrivacySectionProps {
  isPrivate: boolean;
  onValueChange: (value: boolean) => void;
}

export default function AccountPrivacySection({
  isPrivate,
  onValueChange,
}: AccountPrivacySectionProps) {
  // Guarda a escolha até o usuário confirmar no modal.
  const [requestedPrivacy, setRequestedPrivacy] = useState<boolean | null>(
    null,
  );

  const requestingPrivateAccount = requestedPrivacy === true;

  const handleRequestChange = (nextValue: boolean) => {
    setRequestedPrivacy(nextValue);
  };

  const handleCancelChange = () => {
    setRequestedPrivacy(null);
  };

  const handleConfirmChange = () => {
    if (requestedPrivacy === null) return;

    onValueChange(requestedPrivacy);
    setRequestedPrivacy(null);
  };

  return (
    <>
      <View style={styles.card}>
        {/* Título da nova seção de privacidade. */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="lock-closed-outline" size={19} color="#F43B97" />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.title}>Privacidade da conta</Text>
            <Text style={styles.subtitle}>
              Controle quem pode acompanhar seu perfil
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* O switch apenas solicita a mudança; o modal aplica a decisão. */}
        <View style={styles.settingRow}>
          <View style={styles.settingIcon}>
            <Ionicons
              name={isPrivate ? "shield-checkmark-outline" : "globe-outline"}
              size={18}
              color="#00D9F5"
            />
          </View>

          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Conta privada</Text>
            <Text style={styles.settingStatus}>
              {isPrivate ? "Privada" : "Pública"}
            </Text>
          </View>

          <Switch
            accessibilityLabel={
              isPrivate ? "Deixar conta pública" : "Deixar conta privada"
            }
            value={isPrivate}
            onValueChange={handleRequestChange}
            trackColor={{ false: "#152637", true: "#E51580" }}
            thumbColor={isPrivate ? "#FFFFFF" : "#D8F3FF"}
            ios_backgroundColor="#152637"
            style={styles.switch}
          />
        </View>

        <View style={styles.informationBox}>
          <Ionicons
            name="information-circle-outline"
            size={17}
            color="#758096"
          />

          <View style={styles.informationText}>
            <Text style={styles.description}>
              {isPrivate
                ? "Somente jogadores que você aprovar poderão ver suas publicações e acompanhar suas atividades."
                : "Seu perfil e suas publicações poderão ser vistos por todos os jogadores do GameControl."}
            </Text>
            <Text style={styles.note}>
              Sua foto de perfil e seu nome de usuário continuam visíveis para
              todos.
            </Text>
          </View>
        </View>
      </View>

      <ConfirmModal
        visible={requestedPrivacy !== null}
        title={
          requestingPrivateAccount
            ? "Deixar a conta privada?"
            : "Deixar a conta pública?"
        }
        message={
          requestingPrivateAccount
            ? "Somente jogadores que você aprovar poderão acompanhar suas publicações e atividades."
            : "Todos os jogadores poderão ver seu perfil, suas publicações e suas atividades."
        }
        warning={
          requestingPrivateAccount
            ? "Novos seguidores precisarão da sua aprovação."
            : "Conteúdos antes restritos ficarão visíveis para todos."
        }
        confirmLabel={
          requestingPrivateAccount ? "Deixar privada" : "Deixar pública"
        }
        onConfirm={handleConfirmChange}
        onCancel={handleCancelChange}
      />
    </>
  );
}
