"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const STORAGE_KEY = "pixel-ai-rank-theme";
const THEME_EVENT = "pixel-ai-rank-theme-change";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function subscribe(onStoreChange: () => void) {
  const frame = window.requestAnimationFrame(onStoreChange);
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener(THEME_EVENT, onStoreChange);
  };
}

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerThemeSnapshot);

  const toggleTheme = useCallback(() => {
    const next = getThemeSnapshot() === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme 必须在 ThemeProvider 内使用");
  return context;
}
