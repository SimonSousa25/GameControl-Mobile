import { TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import gameService, { GameDTO } from '@/services/gameService';
import { AntDesign } from '@expo/vector-icons';
import { styles } from './styles';

interface GameOfWeekProps {
  onGamePress?: (gameId: string) => void;
}

export default function GameOfWeek({ onGamePress }: GameOfWeekProps) {
  const [game, setGame] = useState<GameDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    try {
      setLoading(true);
      const data = await gameService.listarJogosRecentes();
      if (data.length > 0) {
        setGame(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar jogo da semana:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Jogo da Semana</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={['#0559AB', '#F22E8F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.titleGradientBar}
        />
        <Text style={styles.title}>Jogo da Semana</Text>
      </View>

      <LinearGradient
        colors={['#33121F', '#060814']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.card} >
          <LinearGradient
            colors={['transparent', 'rgba(10, 14, 21, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardContent}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: game.coverImageUrl }}
                style={styles.gameImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(10, 14, 21, 0.9)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.imageGradient}
              />
            </View>

            <View style={styles.gameInfo} lightColor="transparent" darkColor="transparent">
              <Text style={styles.gameLabel}>JOGO DA SEMANA</Text>
              <Text style={styles.gameName}>{game.title}</Text>
              <Text style={styles.gameDescription} numberOfLines={3}>
                {game.description || 'Confira este jogo incrível da semana'}
              </Text>

            {/* TODO: A quantidade de estrelas e ratings ta mockado, pegar depois da api backend; */}
              <View style={styles.ratingContainer} lightColor="transparent" darkColor="transparent">
                <AntDesign name="star" size={16} color="#FFD700" />
                <AntDesign name="star" size={16} color="#FFD700" />
                <AntDesign name="star" size={16} color="#FFD700" />
                <AntDesign name="star" size={16} color="#FFD700" />
                <AntDesign name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>5/5</Text>
              </View>
            </View>
          </LinearGradient>

          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => onGamePress?.(game.id)}
          >
            <AntDesign name="right" size={20} color="#334056" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
