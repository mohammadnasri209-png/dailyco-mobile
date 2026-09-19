// src/theme/theme.js — single source of visual truth for the whole app.
// Inspired by the calm-but-playful palettes of Duolingo / Elsa Speak, tuned
// for RTL Persian text.
export const colors = {
  primary: '#2E5CFF',
  primaryDark: '#1B3FCC',
  primarySoft: '#E8EDFF',
  accent: '#FFB020',
  success: '#22C55E',
  danger: '#EF4444',
  bg: '#F6F7FB',
  card: '#FFFFFF',
  text: '#1A1D29',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  streak: '#FF7A1A',
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const spacing = (n) => n * 4;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
};

export const fonts = {
  regular: undefined, // system default renders Persian well on both platforms
  bold: undefined,
};
