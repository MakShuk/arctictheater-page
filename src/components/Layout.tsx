import { useAppStore } from '../store/useAppStore';
import './Layout.css';

/**
 * Главный layout компонент.
 * Управляет переключением между представлениями (views).
 */
export function Layout() {
  const config = useAppStore((s) => s.config);
  const currentView = useAppStore((s) => s.currentView);
  const activePageId = useAppStore((s) => s.activePageId);
  const navigateToPage = useAppStore((s) => s.navigateToPage);
  const navigateHome = useAppStore((s) => s.navigateHome);
  const openSettings = useAppStore((s) => s.openSettings);

  if (!config) {
    return <div className="layout-error">Ошибка: конфигурация не загружена</div>;
  }

  const activePage = activePageId
    ? config.pages.find((p) => p.id === activePageId)
    : null;

  return (
    <div className="layout">
      {/* Header */}
      <header className="layout-header">
        <h1 className="layout-title">{config.settings.siteName}</h1>
        {currentView !== 'HOME' && (
          <button type="button" className="btn btn-home" onClick={navigateHome}>
            ← Домой
          </button>
        )}
        {currentView === 'HOME' && (
          <button type="button" className="btn btn-settings" onClick={openSettings}>
            ⚙️
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="layout-main">
        {/* HOME View */}
        {currentView === 'HOME' && (
          <div className="home-grid">
            {config.pages.map((page) => (
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
            <h2 className="page-title">{activePage.name}</h2>
            <div className="page-content">
              {/* TODO: Рендеринг контента страницы */}
              <p>Контент страницы "{activePage.name}" (slug: {activePage.slug})</p>
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
  const config = useAppStore((s) => s.config);
  const updateTheme = useAppStore((s) => s.updateTheme);

  if (!config) return null;

  const { primaryColor, secondaryColor } = config.settings.theme;

  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTheme(e.target.value, secondaryColor);
  };

  const handleSecondaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTheme(primaryColor, e.target.value);
  };

  return (
    <div className="settings-panel">
      <h2>Настройки</h2>

      <div className="settings-group">
        <label htmlFor="primary-color" className="settings-label">
          Основной цвет:
          <input
            id="primary-color"
            type="color"
            value={primaryColor}
            onChange={handlePrimaryChange}
            className="color-input"
          />
        </label>
      </div>

      <div className="settings-group">
        <label htmlFor="secondary-color" className="settings-label">
          Вторичный цвет:
          <input
            id="secondary-color"
            type="color"
            value={secondaryColor}
            onChange={handleSecondaryChange}
            className="color-input"
          />
        </label>
      </div>
    </div>
  );
}
