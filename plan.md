
#### Этап 1: Инициализация и Базовая настройка
Здесь мы идем по стандартному пути, но сразу готовим почву под CI/CD.

1.  **Сборка:**
    *   `npm create vite@latest . -- --template react-ts`
    *   Установка линтеров (ESLint + Prettier), чтобы код не превратился в помойку.
    *   Установка `gh-pages` пакета для деплоя.

2.  **CI/CD (GitHub Actions):**
    *   Создать `.github/workflows/deploy.yml`.
    *   Настроить экшн: `checkout` -> `setup-node` -> `npm install` -> `npm run build` -> деплой папки `dist` в ветку `gh-pages`.
    *   **Возражение:** Ты хотел CI/CD, но для GitHub Pages это часто оверкилл, если ты работаешь один. Проще пушить собранный билд. Но раз надо — делаем через Actions.
#### Этап 2: Стейт-менеджмент и "Кэширование" (Самая спорная часть)
Нам нужно состояние, которое управляет загрузкой конфига.

1.  **Store (Zustand или React Context):**
    *   Создаем стор `useAppStore`.
    *   Поля: `config` (весь твой JSON), `isLoading` (boolean), `currentView` (enum: 'HOME' | 'SETTINGS' | 'PAGE_VIEW'), `activePageId` (number | null).

2.  **Logic "Init vs Storage":**
    *   При маунте приложения (`useEffect`):
        1.  Проверяем ключ `app_config` в `localStorage`.
        2.  **Если есть:** Парсим и кладем в стейт. Выключаем спиннер.
        3.  **Если нет:** Делаем `fetch('/init.json')` (файл лежит в `/public`).
        4.  Сохраняем результат в `localStorage` и в стейт.
        5.  Имитируем задержку (если нужно), чтобы показать твой спиннер.
#### Этап 3: Темизация и Настройки
Так как ты хочешь менять цвета "на лету" из JSON, хардкодить их в CSS нельзя.

1.  **CSS Variables Wrapper:**
    *   Компонент-обертка, который читает `settings.theme` из стейта.
    *   Инжектит стили в `:root`:
        ```css
        --primary-color: {config.settings.theme.primaryColor};
        --secondary-color: {config.settings.theme.secondaryColor};
        ```
2.  **Редактор настроек:**
    *   Отображается **только** если `currentView === 'HOME'`.
    *   Два `input type="color"`, которые меняют стейт и сразу перезаписывают LocalStorage.
#### Этап 4: Роутинг (Виртуальный)
Раз ты отказался от React Router и смены URL, пишем свой свитч.

1.  **Компонент `<Layout />`:**
    *   Если `isLoading === true` -> Рендерим `<Spinner />`.
    *   Если `false`:
        *   Рендерим хедер (Название сайта из конфига).
        *   Основной контент через условный рендеринг.
2.  **Логика переключения:**
    *   **Home View:** Grid-сетка с кнопками. Кнопки берутся мапом из `config.pages`.
        *   `onClick` -> `setActivePageId(id)` -> `setCurrentView('PAGE_VIEW')`.
    *   **Page View:**
        *   Находит страницу в конфиге по ID.
        *   Рендерит заголовок и контент.
        *   Обязательно нужна кнопка "Домой" (раз браузерная кнопка "Назад" не работает, пользователю нужно как-то выбраться).
    *   **Settings View:** (Модалка или отдельный блок, открывается по кнопке с шестеренкой на главной).
#### Этап 5: UI Компоненты (Минимализм)
Не тащи тяжелые библиотеки UI (MUI/AntD) ради трех кнопок.
1.  **Button:** Стилизуется через CSS Modules, использует переменные цветов темы.
2.  **Spinner:** CSS-анимация (keyframes rotate).
3.  **Card/Block:** Для кнопок на главной странице.
### Итоговая структура файлов

```text
src/
  ├── assets/
  ├── components/
  │   ├── Spinner.tsx       # Твоя анимация
  │   ├── ThemeProvider.tsx # Инъекция CSS переменных
  │   └── Navigation.tsx    # Кнопка "Домой" (если не на главной)
  ├── store/
  │   └── useStore.ts       # Вся логика данных
  ├── types/
  │   └── index.ts          # Типизация твоего JSON
  ├── App.tsx               # Главный свитч (Home vs Page vs Settings)
  └── main.tsx
public/
  └── init.json             # Твой исходный файл
```

### init.json 
```json
{
  "pages": [
    {
      "id": 1,
      "name": "Страница 1",
      "slug": "page-1",
      "content": {
       //Пока пусто 
      }
    },
    {
      "id": 2,
      "name": "Страница 2",
      "slug": "page-2",
      "content": {
        //Пока пусто 
      }
    }
  ],
  "settings": {
    "siteName": "Название сайта",
    "language": "ru",
    "theme": {
      "primaryColor": "#000000",
      "secondaryColor": "#ffffff"
    }
  }
}
```