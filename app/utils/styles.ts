import { StyleSheet } from 'react-native';

export const COLORS = {
  TEXT_PRIMARY: '#4A4A4A',
  BUTTON_PRIMARY: 'rgba(180, 131, 131, 0.26)',
  BUTTON_SECONDARY: 'rgba(99, 7, 7, 0.26)',
  BACK_ICON_BACKGROUND: 'rgba(122, 8, 8, 0.4)',
  ACCENT: '#A52A2A',
  SUCCESS: '#228B22',
  BACKGROUND: '#F5F5F5',
  CARD: 'rgba(180, 131, 131, 0.15)', // Slightly more opaque than BUTTON_PRIMARY for visibility
  INPUT: '#E8ECEF',
  BORDER: '#D3D3D3',
  TEXT_SECONDARY: '#6B7280',
  ERROR: '#D32F2F',
  GRADIENT_START: '#A52A2A',
  GRADIENT_END: '#FFD700',
};

export const globalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  card: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 30, // Slightly larger for emphasis
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 18, // Larger to match BadmintonScreen
    textAlign: 'center',
    opacity: 0.9,
  },
  button: {
    backgroundColor: COLORS.BUTTON_PRIMARY,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: COLORS.INPUT,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    marginVertical: 8,
  },
});