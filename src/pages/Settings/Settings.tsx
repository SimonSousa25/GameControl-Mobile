import { Ionicons } from "@expo/vector-icons";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";

import { Text, View } from "@/components/Themed";
import type { UserDTO } from "@/services/userService";
import { getAvatarUrl } from "@/utils/avatar";

import AccountPrivacySection from "@/components/AccountPrivacySection/AccountPrivacySection";
import BackButton from "@/components/BackButton/BackButton";
import Header from "@/components/Header/Header";
import NavBottom from "@/components/NavBottom/NavBottom";
import NotificationOption from "@/components/NotificationOption/NotificationOption";

import { styles } from "./styles";

export interface SettingsFormValues {
  username: string;
  bio: string;
  country: string;
}

interface SettingsProps {
  user: UserDTO;
  onBackPress?: () => void;
  onLogoutPress?: () => void;
  onTabPress?: (tabId: string) => void;
  onSearchSubmit?: (searchTerm: string) => void;
  onProfilePictureChange?: (base64Image: string) => Promise<void>;
  onSave?: (values: SettingsFormValues) => Promise<void>;
}
/**
 * TODO: implementar as opções de edição e configuração da conta
 * (foto, nome, descrição, localização, senha...). Por enquanto é só o
 * destino do botão de configurações do perfil (RF10.02).
 */
export default function Settings({
  user,
  onBackPress,
  onLogoutPress,
  onTabPress,
  onSearchSubmit,
  onProfilePictureChange,
  onSave,
}: SettingsProps) {
  // Estados dos campos editáveis do perfil.
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio ?? "");
  const [country, setCountry] = useState(user.country ?? "");

  // Essas preferências ainda são somente locais.
  const [likesEnabled, setLikesEnabled] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(false);
  const [followersEnabled, setFollowersEnabled] = useState(false);

  // Estado visual da privacidade. A persistência dependerá de suporte na API.
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const avatarUrl = getAvatarUrl(user.profilePictureUrl);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  const handleSearchSubmit = () => {
    onSearchSubmit?.(searchTerm);
  };

  const handleSelectAvatar = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permissão necessária",
          "Permita o acesso às suas fotos para escolher uma imagem de perfil.",
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (pickerResult.canceled || !pickerResult.assets[0]) return;

      setUploadingAvatar(true);

      // Reduz a foto antes do envio para não guardar uma imagem enorme no perfil.
      const manipulationContext = ImageManipulator.manipulate(
        pickerResult.assets[0].uri,
      );
      manipulationContext.resize({ width: 512, height: 512 });

      const renderedImage = await manipulationContext.renderAsync();
      const processedImage = await renderedImage.saveAsync({
        base64: true,
        compress: 0.72,
        format: SaveFormat.JPEG,
      });

      if (!processedImage.base64) {
        throw new Error("Não foi possível converter a imagem selecionada.");
      }

      await onProfilePictureChange?.(
        `data:image/jpeg;base64,${processedImage.base64}`,
      );

      Alert.alert("Foto atualizada", "Sua nova foto de perfil foi salva.");
    } catch (error) {
      console.error("Erro ao atualizar foto de perfil:", error);
      Alert.alert(
        "Não foi possível atualizar a foto",
        "Escolha outra imagem ou tente novamente em instantes.",
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert(
        "Nome obrigatório",
        "Informe um nome de usuário para continuar.",
      );
      return;
    }

    try {
      setSaving(true);

      await onSave?.({
        username: username.trim(),
        bio: bio.trim(),
        country: country.trim(),
      });

      Alert.alert("Tudo certo", "As alterações foram salvas.");
    } catch {
      Alert.alert(
        "Não foi possível salvar",
        "Verifique sua conexão e tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <Header
          variant={isSearchOpen ? "search" : "icon"}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchPress={() => setIsSearchOpen(true)}
          onSearchSubmit={handleSearchSubmit}
          onClose={closeSearch}
          autoFocusSearch={isSearchOpen}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <BackButton onPress={onBackPress} />

          <View>
            <Text style={styles.title}>Configurações do Perfil</Text>
            <Text style={styles.subtitle}>
              Gerencie suas informações no GameControl
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Foto de perfil</Text>

          <Pressable
            accessibilityLabel="Escolher uma nova foto de perfil"
            accessibilityRole="button"
            disabled={uploadingAvatar}
            onPress={handleSelectAvatar}
            style={[
              styles.avatarButton,
              uploadingAvatar && styles.avatarButtonDisabled,
            ]}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-outline" size={38} color="#7285A3" />
            )}

            <View style={styles.cameraBadge}>
              {uploadingAvatar ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Ionicons name="camera-outline" size={15} color="#FFFFFF" />
              )}
            </View>
          </Pressable>

          <Text style={styles.photoHint}>
            Toque na imagem para alterar
          </Text>

          {/* Campo de nome de usuário */}
          <Text style={styles.label}>Nome de usuário</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor="#6A7282"
          />

          {/* Campo de biografia */}
          <Text style={styles.label}>Biografia</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={[styles.input, styles.bioInput]}
            placeholder="Conte um pouco sobre você"
            placeholderTextColor="#6A7282"
            multiline
            maxLength={200}
            textAlignVertical="top"
          />

          {/* Campo de localização */}
          <Text style={styles.label}>Localização</Text>
          <TextInput
            value={country}
            onChangeText={setCountry}
            style={styles.input}
            placeholder="País ou cidade"
            placeholderTextColor="#6A7282"
          />
        </View>

        <View style={styles.notificationsCard}>
          {/* Cabeçalho da seção de notificações, separado das opções. */}
          <View style={styles.notificationsHeader}>
            <View style={styles.notificationsHeaderIcon}>
              <Ionicons name="notifications-outline" size={19} color="#F43B97" />
            </View>

            <View style={styles.notificationsHeaderText}>
              <Text style={styles.notificationTitle}>Notificações</Text>
              <Text style={styles.notificationSubtitle}>
                Escolha quais alertas deseja receber
              </Text>
            </View>
          </View>

          <View style={styles.notificationsDivider} />

          <View style={styles.notificationsList}>
            <NotificationOption
              icon="heart-outline"
              title="Curtidas"
              description="Quando curtirem suas publicações"
              value={likesEnabled}
              onValueChange={setLikesEnabled}
              showDivider
            />

            <NotificationOption
              icon="chatbubble-outline"
              title="Comentários"
              description="Comentários nas suas publicações"
              value={commentsEnabled}
              onValueChange={setCommentsEnabled}
              showDivider
            />

            <NotificationOption
              icon="person-add-outline"
              title="Novos seguidores"
              description="Quando outro jogador seguir você"
              value={followersEnabled}
              onValueChange={setFollowersEnabled}
            />
          </View>
        </View>

        <AccountPrivacySection
          isPrivate={isPrivateAccount}
          onValueChange={setIsPrivateAccount}
        />

        <Pressable
          disabled={saving}
          onPress={handleSave}
          style={[styles.saveButton, saving && styles.disabledButton]}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Salvar alterações</Text>
            </>
          )}
        </Pressable>

        <Pressable onPress={onLogoutPress} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </Pressable>
      </ScrollView>

      <NavBottom activeTab="profile" onTabPress={onTabPress} />
    </View>
  );
}
