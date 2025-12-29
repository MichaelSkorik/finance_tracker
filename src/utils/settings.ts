import { supabase } from "./supabase";

export type Theme = "dark" | "light";
export type Lang = "ru" | "en" | "az";
export type Currency = "AZN" | "USD" | "RUB";

export interface AppSettings {
  theme: Theme;
  lang: Lang;
  currency: Currency;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  lang: "ru",
  currency: "AZN",
};

/* =========================
   LOAD SETTINGS
========================= */
export async function loadSettings(userId: string): Promise<AppSettings> {
  const { data, error } = await supabase
    .from("profiles")
    .select("theme, lang, currency")
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.warn("loadSettings fallback:", error);
    return DEFAULT_SETTINGS;
  }

  return {
    theme: data.theme ?? "dark",
    lang: data.lang ?? "ru",
    currency: data.currency ?? "AZN",
  };
}

/* =========================
   SAVE SETTINGS
========================= */
export async function saveSettings(userId: string, settings: AppSettings) {
  const { error } = await supabase
    .from("profiles")
    .update(settings)
    .eq("id", userId);

  if (error) {
    console.error("saveSettings error:", error);
    throw error;
  }
}

/* =========================
   APPLY THEME
========================= */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
