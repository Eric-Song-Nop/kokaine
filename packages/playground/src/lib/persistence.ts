import LZString from 'lz-string';
import { DEFAULT_SOURCE, STORAGE_KEY, THEME_KEY } from '../defaults';
import type { Theme } from '../types';

const SHARE_PREFIX = '#code=';

export function loadInitialSource(): { source: string; shared: boolean } {
  if (window.location.hash.startsWith(SHARE_PREFIX)) {
    const compressed = window.location.hash.slice(SHARE_PREFIX.length);
    const source = LZString.decompressFromEncodedURIComponent(compressed);
    if (source) return { source, shared: true };
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  return { source: saved || DEFAULT_SOURCE, shared: false };
}

export function persistSource(source: string): void {
  window.localStorage.setItem(STORAGE_KEY, source);
}

export function resetSource(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
}

export function makeShareUrl(source: string): string {
  const compressed = LZString.compressToEncodedURIComponent(source);
  const url = new URL(window.location.href);
  url.hash = `code=${compressed}`;
  return url.toString();
}

export function loadTheme(): Theme {
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function persistTheme(theme: Theme): void {
  window.localStorage.setItem(THEME_KEY, theme);
}
