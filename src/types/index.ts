export interface PageContent {
  // Расширить по мере необходимости
}

export interface Page {
  id: number;
  name: string;
  slug: string;
  content: PageContent;
}

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  mode: ThemeMode;
}

export interface Settings {
  siteName: string;
  language: string;
  theme: Theme;
}

export interface AppConfig {
  pages: Page[];
  settings: Settings;
}
