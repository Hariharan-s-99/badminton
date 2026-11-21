import { Platform } from 'react-native';

export const Colors = {
  BACKGROUND: '#07070A',
  TITLE_COLOR: '#E8E8E8',
  TEXT_SECONDARY: '#B89090',
  THEME_CONTRAST: '#8B0000',
  PRIMARY: '#8B0000',
  ACCENT: '#FF6B6B',
  CARD_BG: 'rgba(139, 0, 0, 0.15)',
  INPUT_BG: 'rgba(0, 0, 0, 0.3)',
  BORDER: 'rgba(139, 0, 0, 0.5)',
  LIGHT_BG: 'rgba(255, 255, 255, 0.08)',
  ERROR: '#FF4D4D',
  SUCCESS: '#4CAF50',
  BRAND_RED: '#D30E17',
  BUTTON_GRADIENT_START: '#250304',
  BUTTON_GRADIENT_END: '#AC0B12',
  FIELD_BORDER: '#6D6D6D',
  DIVIDER: '#393737',
  TEXT_MUTED: '#8E8E8E',
  BRAND_TEAL: '#19B7C7',
  SELECTED_FILL: '#2A0507',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TEXT_LIGHT: '#B5B5B5',
  SURFACE_DARK: '#0A0A0A',
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
