import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import BackButton from "@/components/BackButton/BackButton";
import Header from "@/components/Header/Header";
import NavBottom from "@/components/NavBottom/NavBottom";
import { Text, View } from "@/components/Themed";

import { styles } from "./styles";

export interface SettingsProps {
  onBackPress?: () => void;
  onLogoutPress?: () => void;
  onTabPress?: (tabId: string) => void;
}

/**
 * TODO: implementar as opções de edição e configuração da conta
 * (foto, nome, descrição, localização, senha...). Por enquanto é só o
 * destino do botão de configurações do perfil (RF10.02).
 */
export function Settings({ onBackPress, onLogoutPress, onTabPress }: SettingsProps) {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Header variant="icon" />
      </View>

      <View style={styles.backRow} lightColor="transparent" darkColor="transparent">
        <BackButton onPress={onBackPress} />
      </View>

      <View style={styles.container} lightColor="transparent" darkColor="transparent">
        <Ionicons name="settings-outline" size={40} color="#6B7280" />
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>
          As opções de edição do perfil e da conta chegarão em breve.
        </Text>

        <TouchableOpacity
          accessibilityRole="button"
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={onLogoutPress}
        >
          <Ionicons name="log-out-outline" size={18} color="#FF4D5E" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>

      <NavBottom activeTab="profile" onTabPress={onTabPress} />
    </View>
  );
}

export default Settings;
