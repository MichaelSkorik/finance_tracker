import { supabase } from "./supabase";

export interface AppSettings {
  lang: string;
  currency: string;
  theme: string;
}

export async function getSettings(userId: string) {
  return supabase
    .from("profiles")
    .select("lang, currency, theme")
    .eq("id", userId)
    .single();
}

export async function updateSettings(userId: string, settings: AppSettings) {
  return supabase.from("profiles").update(settings).eq("id", userId);
}
