import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 402,
    margin: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#0A0E15',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(245, 247, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    maxHeight:56,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 4,
  },
  navItemActive: {
    borderRadius: 12,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#A0A0A0',
  },
  iconActive: {
    tintColor: '#F52E8F',
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
