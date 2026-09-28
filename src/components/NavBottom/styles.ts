import { StyleSheet } from 'react-native';

const INACTIVE_COLOR_BORDER = 'rgba(160, 160, 160, 0.6)';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    maxWidth: 402,
    paddingVertical: 14,
    backgroundColor: '#0A0E15',
    borderRadius: 44,
    borderWidth: 1,
    borderColor: 'rgba(245, 247, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 4,
  },
  navItemActive: {
    borderRadius: 12,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: INACTIVE_COLOR_BORDER,
  },
  avatarActive: {
    borderColor: '#F52E8F',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A0A0A0',
    fontFamily: 'Orbitron',
  },
  labelActive: {
    color: '#F52E8F',
  },
});
