/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const COLORS = {
  primary: '#3d482a',       // Earthy Stone Gray
  secondary: '#8a7d53',     // Warm Olive Green
  tertiary: '#c51f1f',      // Pomegranate
  accent: '#ff0000',        // Rustic Terracotta
  highlight: '#f80101',     // Adriatic Blue
  background: '#F5E7DA',    // Soft Linen Beige
  darkGreen: '#2F4F2F',     // Deep Forest Green
};

export const colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
