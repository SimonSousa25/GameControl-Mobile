import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    backgroundColor: 'inherit'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'inherit',
    marginBottom: 16,
    paddingLeft: 20,
    gap: 12,
  },
  titleGradientBar: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F5F7FF',
    fontFamily: 'Orbitron',
  },
  cardGradient: {
    padding: 1,
    borderRadius: 12,
    marginLeft: 20,
  },
  card: {
    backgroundColor: '#0A0E15',
    borderRadius: 11,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 140,
    borderRadius: 8,
  },
  gameImage: {
    width: 100,
    height: 140,
    borderRadius: 8,
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    pointerEvents: 'none',
    zIndex: 1,
  },
  gameInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gameLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F52E8F',
    fontFamily: 'Orbitron',
    marginBottom: 4,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F5F7FF',
    fontFamily: 'Orbitron',
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 8,
    color: '#A0A0A0',
    lineHeight: 16,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  rating: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFD700',
    fontFamily: 'Orbitron',
  },
  nextButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334056',
    borderStyle: 'solid',
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
