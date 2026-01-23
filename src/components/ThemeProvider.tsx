import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * Компонент-провайдер темы.
 * Инжектит CSS переменные в :root на основе настроек из стора.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const config = useAppStore((s) => s.config);

  useEffect(() => {
    if (!config?.settings?.theme) return;

    const { primaryColor, secondaryColor } = config.settings.theme;

    // Устанавливаем CSS переменные в :root
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
  }, [config?.settings?.theme]);

  return <>{children}</>;
}
