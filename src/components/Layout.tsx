import { useAppStore } from '../store/useAppStore';
import { Logo } from './Logo';
import { QRPage } from './QRPage';
import { EmotionsPage } from './EmotionsPage';
import { EventsPage } from './EventsPage';
import { ArrowLeft, Settings, Maximize, Minimize } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import './Layout.css';

/**
 * Главный layout компонент.
 * Управляет переключением между представлениями (views).
 */
export function Layout() {
  const config = useAppStore(s => s.config);
  const currentView = useAppStore(s => s.currentView);
  const activePageId = useAppStore(s => s.activePageId);
  const navigateToPage = useAppStore(s => s.navigateToPage);
  const navigateHome = useAppStore(s => s.navigateHome);
  const openSettings = useAppStore(s => s.openSettings);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Следим за изменениями полноэкранного режима (например, по F11)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  if (!config) {
    return (
      <div className="layout-error">Ошибка: конфигурация не загружена</div>
    );
  }

  const activePage = activePageId
    ? config.pages.find(p => p.id === activePageId)
    : null;

  return (
    <div className="layout">
      {/* Header */}
      <header className="layout-header">
        <div className="layout-brand">
          <Logo size="medium" onClick={navigateHome} />
          <h1 className="layout-title">{config.settings.siteName}</h1>
        </div>
        
        <div className="layout-controls">
          {currentView !== 'HOME' && (
            <button
              type="button"
              className="btn btn-home"
              onClick={navigateHome}
              aria-label="На главную"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          {currentView === 'HOME' && (
            <button
              type="button"
              className="btn btn-settings"
              onClick={openSettings}
              aria-label="Настройки"
            >
              <Settings size={24} />
            </button>
          )}

          <button
            type="button"
            className="btn btn-home" // Используем тот же класс для стиля
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Выйти из полноэкранного режима" : "На весь экран"}
          >
           {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="layout-main">
        {/* HOME View */}
        {currentView === 'HOME' && (
          <div className="home-grid">
            {config.pages.map(page => (
              <button
                key={page.id}
                type="button"
                className="page-card"
                onClick={() => navigateToPage(page.id)}
              >
                {page.name}
              </button>
            ))}
          </div>
        )}

        {/* PAGE_VIEW */}
        {currentView === 'PAGE_VIEW' && activePage && (
          <div className="page-view">
            {/* Скрываем заголовок для QR-страницы, страницы эмоций и событий */}
            {activePage.content?.type !== 'qr-page' && 
             activePage.content?.type !== 'emotions-page' &&
             activePage.content?.type !== 'events-page' && (
              <h2 className="page-title">{activePage.name}</h2>
            )}
            <div className="page-content">
              {/* Рендеринг QR-страницы */}
              {activePage.content?.type === 'qr-page' ? (
                <QRPage />
              ) : activePage.content?.type === 'emotions-page' ? (
                <EmotionsPage
                  pageId={activePage.id}
                  emotions={activePage.content.emotions as string[]}
                />
              ) : activePage.content?.type === 'events-page' ? (
                <EventsPage
                  events={activePage.content.events as { id: number; title: string; date: string; time: string; city: string; description: string; link?: string }[]}
                />
              ) : (
                <p>
                  Контент страницы "{activePage.name}" (slug: {activePage.slug})
                </p>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS View */}
        {currentView === 'SETTINGS' && <SettingsPanel />}
      </main>
    </div>
  );
}

/**
 * Панель настроек для редактирования темы.
 */
function SettingsPanel() {
  const config = useAppStore(s => s.config);
  const setThemeMode = useAppStore(s => s.setThemeMode);
  const resetToDefault = useAppStore(s => s.resetToDefault);

  if (!config) return null;

  const { mode } = config.settings.theme;

  return (
    <div className="settings-panel">
      <h2>Настройки</h2>

      {/* Переключатель темы */}
      <div className="settings-group">
        <span className="settings-label">Тема оформления:</span>
        <div className="theme-toggle">
          <button
            type="button"
            className={`theme-toggle-btn ${mode === 'light' ? 'active' : ''}`}
            onClick={() => setThemeMode('light')}
          >
            ☀️ Светлая
          </button>
          <button
            type="button"
            className={`theme-toggle-btn ${mode === 'dark' ? 'active' : ''}`}
            onClick={() => setThemeMode('dark')}
          >
            🌙 Тёмная
          </button>
        </div>
      </div>

      {/* Кнопка сброса */}
      <div className="settings-group">
        <button type="button" className="btn btn-reset" onClick={resetToDefault}>
          Сбросить к стандартным
        </button>
      </div>
    </div>
  );
}
