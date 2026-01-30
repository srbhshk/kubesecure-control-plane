export const themeConfig = {
  defaultTheme: 'system',
  storageKey: 'kubesecure-theme',
  themes: ['light', 'dark'],
  // Future enhancements: custom colors, typography, etc.
  colors: {
    // KubeSecure brand palette aligned with CSS variables
    primary: 'sky-500', // maps to #D6EFFF brand family in Tailwind
    secondary: 'slate-700', // works on top of #D6EFFF and #1C1C1C
    danger: 'red-600',
    warning: 'amber-500',
    success: 'emerald-600',
    info: 'sky-500',
  },
} as const;

export type ThemeConfig = typeof themeConfig;
