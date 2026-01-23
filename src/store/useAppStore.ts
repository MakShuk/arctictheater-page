import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AppConfig } from '../types';

// Возможные представления (views)
export type ViewType = 'HOME' | 'SETTINGS' | 'PAGE_VIEW';

interface AppState {
  // Данные
  config: AppConfig | null;

  // UI-состояние
  isLoading: boolean;
  currentView: ViewType;
  activePageId: number | null;

  // Экшены
  setConfig: (config: AppConfig) => void;
  setLoading: (loading: boolean) => void;
  setCurrentView: (view: ViewType) => void;
  setActivePageId: (id: number | null) => void;

  // Комбинированные экшены для навигации
  navigateToPage: (id: number) => void;
  navigateHome: () => void;
  openSettings: () => void;

  // Обновление настроек темы
  setThemeMode: (mode: 'light' | 'dark') => void;

  // Сброс к настройкам по умолчанию (из init.json)
  resetToDefault: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      // Начальное состояние
      config: null,
      isLoading: true,
      currentView: 'HOME',
      activePageId: null,

      // Базовые сеттеры
      setConfig: config => set({ config }),
      setLoading: isLoading => set({ isLoading }),
      setCurrentView: currentView => set({ currentView }),
      setActivePageId: activePageId => set({ activePageId }),

      // Навигация на страницу
      navigateToPage: id =>
        set({
          activePageId: id,
          currentView: 'PAGE_VIEW',
        }),

      // Навигация домой
      navigateHome: () =>
        set({
          activePageId: null,
          currentView: 'HOME',
        }),

      // Открыть настройки
      openSettings: () =>
        set({
          currentView: 'SETTINGS',
        }),

      // Переключение режима темы (светлая/тёмная)
      setThemeMode: mode =>
        set(state => {
          if (!state.config) return state;
          return {
            config: {
              ...state.config,
              settings: {
                ...state.config.settings,
                theme: {
                  ...state.config.settings.theme,
                  mode,
                },
              },
            },
          };
        }),

      // Сброс к настройкам по умолчанию (загрузка init.json)
      resetToDefault: async () => {
        try {
          const response = await fetch('/init.json');
          if (!response.ok) {
            throw new Error('Ошибка загрузки init.json');
          }
          const defaultConfig = await response.json();
          set({ config: defaultConfig });
        } catch (error) {
          console.error('Не удалось сбросить настройки:', error);
        }
      },
    }),
    {
      name: 'app_config', // Ключ в localStorage
      storage: createJSONStorage(() => localStorage),

      // Сохраняем ТОЛЬКО config — остальное рантайм-состояние
      partialize: state => ({ config: state.config }),
    }
  )
);
