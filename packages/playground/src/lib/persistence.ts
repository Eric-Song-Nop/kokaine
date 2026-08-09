import { THEME_KEY } from '../defaults';
import type { Theme } from '../types';

export function loadTheme(): Theme {
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function persistTheme(theme: Theme): void {
  window.localStorage.setItem(THEME_KEY, theme);
}
