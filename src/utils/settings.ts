export type Theme = "dark" | "light";
export type Lang = "ru" | "en" | "az";
export type Currency = "AZN" | "USD" | "RUB";

export interface AppSettings {
  theme: Theme;
  lang: Lang;
  currency: Currency;
}

const KEY = "ft:settings";

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  lang: "ru",
  currency: "AZN",
};

export function loadSettings(id: string): AppSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const p = JSON.parse(raw) as Partial<AppSettings>;
    const theme: Theme = p.theme === "light" ? "light" : "dark";
    const lang: Lang = p.lang === "en" ? "en" : p.lang === "az" ? "az" : "ru";
    const currency: Currency =
      p.currency === "USD" ? "USD" : p.currency === "RUB" ? "RUB" : "AZN";
    return { theme, lang, currency };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: AppSettings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function t(lang: Lang, key: string): string {
  const dict: Record<Lang, Record<string, string>> = {
    ru: {
      nav_home: "Главная",
      nav_analytics: "Аналитика",
      nav_profile: "Профиль",
      nav_settings: "Настройки",
      title: "Финансовый трекер",
      add: "+ Добавить транзакцию",
      logout: "Выйти",
    },
    en: {
      nav_home: "Home",
      nav_analytics: "Analytics",
      nav_profile: "Profile",
      nav_settings: "Settings",
      title: "Finance Tracker",
      add: "+ Add transaction",
      logout: "Logout",
    },
    az: {
      nav_home: "Əsas",
      nav_analytics: "Analitika",
      nav_profile: "Profil",
      nav_settings: "Ayarlar",
      title: "Maliyyə izləyicisi",
      add: "+ Tranzaksiya əlavə et",
      logout: "Çıxış",
    },
  };

  return dict[lang][key] || key;
}
