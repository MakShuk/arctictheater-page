import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { AppConfig } from '../types';

// Минимальная задержка для показа спиннера (UX)
const SIMULATED_DELAY = 500;

/**
 * Хук инициализации приложения.
 * Загружает конфиг из localStorage (через Zustand persist)
 * или из init.json при первом запуске.
 */
export function useInitializeApp() {
  const config = useAppStore((s) => s.config);
  const isLoading = useAppStore((s) => s.isLoading);
  const setConfig = useAppStore((s) => s.setConfig);
  const setLoading = useAppStore((s) => s.setLoading);

  // Предотвращаем повторный запуск в StrictMode
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initialize = async () => {
      // Zustand persist автоматически гидрирует config из localStorage.
      // Даём небольшую задержку для гидрации
      await new Promise((r) => setTimeout(r, 50));

      // Проверяем, загрузился ли конфиг из localStorage
      const currentConfig = useAppStore.getState().config;

      if (currentConfig) {
        // Конфиг есть в localStorage — просто показываем спиннер немного
        await new Promise((r) => setTimeout(r, SIMULATED_DELAY));
        setLoading(false);
        return;
      }

      // Конфиг отсутствует — загружаем из init.json
      try {
        const response = await fetch('/init.json');
        if (!response.ok) {
          throw new Error(`Failed to load init.json: ${response.status}`);
        }

        const data: AppConfig = await response.json();

        // Искусственная задержка для UX
        await new Promise((r) => setTimeout(r, SIMULATED_DELAY));

        setConfig(data);
      } catch (error) {
        console.error('Initialization failed:', error);
        // TODO: Добавить обработку ошибок (показать error state)
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [setConfig, setLoading]);

  return { isLoading, config };
}
