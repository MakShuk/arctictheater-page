import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import '../styles/variables.css';

/**
 * Компонент-провайдер темы.
 * Применяет CSS переменные и атрибут data-theme на основе настроек из стора.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const config = useAppStore((s) => s.config);

  useEffect(() => {
    if (!config?.settings?.theme) return;

    const { primaryColor, secondaryColor, mode } = config.settings.theme;

    // Устанавливаем CSS переменные в :root
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);

    // Устанавливаем атрибут темы для переключения светлая/тёмная
    document.documentElement.setAttribute('data-theme', mode || 'light');
  }, [config?.settings?.theme]);

  return <>{children}</>;
}
