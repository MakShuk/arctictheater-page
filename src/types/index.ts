export interface PageContent {
  // Расширить по мере необходимости
}

export interface Page {
  id: number;
  name: string;
  slug: string;
  content: PageContent;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
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
