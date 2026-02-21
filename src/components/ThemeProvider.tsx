import { useLayoutEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import '../styles/variables.css';

type ThemeMode = 'light' | 'dark';
const THEME_STORAGE_KEY = 'app_config';

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

function readStoredThemeMode(): ThemeMode | null {
  try {
    const persistedData = localStorage.getItem(THEME_STORAGE_KEY);
    if (!persistedData) return null;

    const parsed = JSON.parse(persistedData) as {
      state?: {
        config?: {
          settings?: {
            theme?: {
              mode?: unknown;
            };
          };
        };
      };
    };

    const storedMode = parsed.state?.config?.settings?.theme?.mode;
    return isThemeMode(storedMode) ? storedMode : null;
  } catch {
    return null;
  }
}

function resolveThemeMode(configMode: unknown): ThemeMode {
  if (isThemeMode(configMode)) return configMode;

  const storedMode = readStoredThemeMode();
  if (storedMode) return storedMode;

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Компонент-провайдер темы.
 * Применяет CSS-переменные и атрибут data-theme на основе настроек из стора.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const config = useAppStore(s => s.config);

  useLayoutEffect(() => {
    const theme = config?.settings?.theme;
    const mode = resolveThemeMode(theme?.mode);

    document.documentElement.setAttribute('data-theme', mode);

    if (!theme) return;

    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
  }, [config?.settings?.theme]);

  return <>{children}</>;
}
