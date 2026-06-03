import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Colors, defaultTheme } from "../constants/app-theme";

type ThemeName = keyof typeof Colors;
type ThemeColors = (typeof Colors)[ThemeName];

type AppThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  currentTheme: ThemeColors;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(defaultTheme as ThemeName);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      currentTheme: Colors[theme],
    }),
    [theme],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside AppThemeProvider.");
  }

  return context;
}
